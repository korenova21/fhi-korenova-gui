import {Component, inject, signal, WritableSignal} from '@angular/core';
import {FormsModule} from '@angular/forms'; // Dôležité
import {PageTitle} from '../../components/page-title/page-title';
import {Card} from '../../components/card/card';
import {Table} from '../../components/table/table';
import {Loader} from '../../components/loader/loader';
import {Reservation} from '../../models/reservation.model';
import {Room} from '../../models/room.model';
import {Person} from '../../models/person.model';
import {Column} from '../../models/column.model';
import {ReservationsService} from '../../services/reservations.service';
import {RoomsService} from '../../services/rooms.service';     // <-- Potrebujeme načítať izby
import {PersonsService} from '../../services/persons.service'; // <-- Potrebujeme načítať hostí
import {ActionEvent, ActionType} from '../../models/action.model';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [PageTitle, Card, Table, Loader, FormsModule],
  templateUrl: './reservations.html',
})
export default class Reservations {
  private reservationsService = inject(ReservationsService);
  private roomsService = inject(RoomsService);
  private personsService = inject(PersonsService);

  viewMode = signal<'table' | 'form'>('table');

  // Hlavné dáta
  reservations: WritableSignal<Reservation[] | undefined> = signal(undefined);

  // Zoznamy pre Dropdowny (Select)
  roomsList: Room[] = [];
  personsList: Person[] = [];

  // Dáta formulára
  // Ukladáme si ID vybranej izby a hosťa, nie celé objekty, aby sa to ľahšie posielalo
  activeReservation: any = {};

  originalCode: string | null = null;

  columns: Column<Reservation>[] = [
    {name: '#', value: row => row.code},
    {name: 'Name', value: row => row.guest.name},
    {name: 'Room', value: row => row.room.cislo},
    {name: 'Nights', value: row => row.nights},
    {name: 'NoP', value: row => row.party},
    {
      name: 'Actions',
      actions: [
        { label: 'Change', type: ActionType.Change, cssClass: 'btn btn-sm btn-outline-primary me-1' },
        { label: 'Delete', type: ActionType.Delete, cssClass: 'btn btn-sm btn-outline-danger' }
        // Change pre rezervácie zatiaľ vynecháme pre jednoduchosť, alebo dorobíme neskôr
      ]
    }
  ];

  constructor() {
    this.loadData();
  }

  loadData() {
    // Načítame naraz Rezervácie, Izby aj Ľudí
    forkJoin({
      reservations: this.reservationsService.getReservations(),
      rooms: this.roomsService.getRooms(),
      persons: this.personsService.getPersons()
    }).subscribe({
      next: (res) => {
        this.reservations.set(res.reservations);
        this.roomsList = res.rooms;
        this.personsList = res.persons;
      },
      error: (err) => console.error(err)
    });
  }

// Funkcia teraz prijíma voliteľný parameter 'reservation'
  openForm(reservation?: Reservation) {
    if (this.roomsList.length === 0 || this.personsList.length === 0) {
      alert('Cannot create reservation: No rooms or guests available.');
      return;
    }

    if (reservation) {
      // --- MÓD ÚPRAVY (CHANGE) ---
      // Vyplníme formulár dátami z riadku
      this.originalCode = reservation.code;
      this.activeReservation = {
        code: reservation.code,
        roomId: reservation.room.id,
        guestId: reservation.guest.id,
        nights: reservation.nights,
        party: reservation.party
      };
      // Hack: Aby sme vedeli, či editujeme, uložíme si príznak, alebo budeme kontrolovať existenciu kódu
    } else {
      // --- MÓD VYTVÁRANIA (NEW) ---
      this.originalCode = null;

      const firstAvailableRoom = this.roomsList.find(r => !r.isOccupied);
      if (!firstAvailableRoom) {
        alert('All rooms are currently occupied!');
        return;
      }
      this.activeReservation = {
        code: '',
        roomId: firstAvailableRoom.id,
        guestId: this.personsList[0].id,
        nights: 1,
        party: '1 Adult'
      };
    }
    this.viewMode.set('form');
  }

  closeForm() {
    this.viewMode.set('table');
    this.activeReservation = {};
  }

  saveReservation() {
    const payload = {
      code: this.activeReservation.code,
      roomId: Number(this.activeReservation.roomId),
      guestId: Number(this.activeReservation.guestId),
      nights: this.activeReservation.nights,
      party: this.activeReservation.party
    };

    if (this.originalCode) {
      // --- UPDATE ---
      // Posielame request na pôvodný kód (originalCode), ale s novými dátami (payload)
      this.reservationsService.updateReservation(this.originalCode, payload).subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
        },
        error: (err) => console.error(err)
      });
    } else {
      // --- CREATE ---
      this.reservationsService.createReservation(payload).subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
        },
        error: (err) => {
          // Pridajme aspon console log, aby sme videli chybu
          console.error(err);
          alert('Error creating reservation');
        }
      });
    }
  }

  onRowAction(event: ActionEvent<Reservation>) {
    if (event.type === ActionType.Delete) {
      if (confirm(`Delete reservation ${event.row.code}?`)) {
        this.reservationsService.deleteReservation(event.row.code).subscribe(() => this.loadData());
      }
    } else if (event.type === ActionType.Change) {
      // Zavoláme openForm s údajmi z riadku
      this.openForm(event.row);
    }
  }
}
