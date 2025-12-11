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

  columns: Column<Reservation>[] = [
    {name: '#', value: row => row.code},
    {name: 'Name', value: row => row.guest.name},
    {name: 'Room', value: row => row.room.cislo},
    {name: 'Nights', value: row => row.nights},
    {name: 'NoP', value: row => row.party},
    {
      name: 'Actions',
      actions: [
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

  openForm() {
    // Validácia: Nedovolíme otvoriť formulár, ak chýbajú dáta
    if (this.roomsList.length === 0 || this.personsList.length === 0) {
      alert('Cannot create reservation: You need at least one Room and one Guest created first.');
      return;
    }

    this.activeReservation = {
      code: '',
      roomId: this.roomsList[0].id, // Predvyberieme prvé
      guestId: this.personsList[0].id, // Predvyberieme prvé
      nights: 1,
      party: '1 Adult'
    };
    this.viewMode.set('form');
  }

  closeForm() {
    this.viewMode.set('table');
    this.activeReservation = {};
  }

  saveReservation() {
    // Pripravíme objekt pre backend
    // Backend očakáva: { code, roomId, guestId, nights, party }
    const payload = {
      code: this.activeReservation.code,
      roomId: Number(this.activeReservation.roomId),
      guestId: Number(this.activeReservation.guestId),
      nights: this.activeReservation.nights,
      party: this.activeReservation.party
    };

    // Vytvoríme (update zatiaľ neriešime)
    this.reservationsService.createReservation(payload).subscribe({
      next: () => {
        this.loadData();
        this.closeForm();
      },
      error: (err) => {
        alert('Error creating reservation');
        console.error(err);
      }
    });
  }

  onRowAction(event: ActionEvent<Reservation>) {
    if (event.type === ActionType.Delete) {
      if (confirm(`Delete reservation ${event.row.code}?`)) {
        this.reservationsService.deleteReservation(event.row.code).subscribe(() => this.loadData());
      }
    }
  }
}
