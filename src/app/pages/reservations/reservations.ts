import {Component, inject, signal, WritableSignal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {PageTitle} from '../../components/page-title/page-title';
import {Card} from '../../components/card/card';
import {Table} from '../../components/table/table';
import {Loader} from '../../components/loader/loader';
import {Reservation} from '../../models/reservation.model';
import {Room} from '../../models/room.model';
import {Person} from '../../models/person.model';
import {Column} from '../../models/column.model';
import {ReservationsService} from '../../services/reservations.service';
import {RoomsService} from '../../services/rooms.service';
import {PersonsService} from '../../services/persons.service';
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

  // hlavne data
  reservations: WritableSignal<Reservation[] | undefined> = signal(undefined);

  roomsList: Room[] = [];
  personsList: Person[] = [];

  // data formulara
  activeReservation: any = {};

  originalCode: string | null = null;

  columns: Column<Reservation>[] = [
    {name: 'ID', value: row => row.code},
    {name: 'Name', value: row => row.guest.name},
    {name: 'Room', value: row => row.room.cislo},
    {name: 'Nights', value: row => row.nights},
    {name: 'Pax', value: row => row.party},
    {
      name: 'Actions',
      actions: [
        { label: 'Change', type: ActionType.Change, cssClass: 'btn btn-sm btn-outline-primary me-1' },
        { label: 'Delete', type: ActionType.Delete, cssClass: 'btn btn-sm btn-outline-danger' }
      ]
    }
  ];

  constructor() {
    this.loadData();
  }

  loadData() {
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

  openForm(reservation?: Reservation) {
    if (this.roomsList.length === 0 || this.personsList.length === 0) {
      alert('Cannot create reservation: No rooms or guests available.');
      return;
    }

    if (reservation) {
      this.originalCode = reservation.code;
      this.activeReservation = {
        code: reservation.code,
        roomId: reservation.room.id,
        guestId: reservation.guest.id,
        nights: reservation.nights,
        party: reservation.party
      };

    } else {
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
        party: 1
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
      this.openForm(event.row);
    }
  }
}
