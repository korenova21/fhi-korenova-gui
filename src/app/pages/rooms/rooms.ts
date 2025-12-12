import {Component, inject, signal, WritableSignal} from '@angular/core';
import {FormsModule} from '@angular/forms'; //
import {PageTitle} from '../../components/page-title/page-title';
import {Card} from '../../components/card/card';
import {Table} from '../../components/table/table';
import {Loader} from '../../components/loader/loader';
import {Room} from '../../models/room.model';
import {Column} from '../../models/column.model';
import {RoomsService} from '../../services/rooms.service';
import {ActionEvent, ActionType} from '../../models/action.model';
import {take} from 'rxjs';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    PageTitle,
    Card,
    Table,
    Loader,
    FormsModule
  ],
  templateUrl: './rooms.html',
})
export default class Rooms {
  private roomsService = inject(RoomsService);

  // stav stranky
  viewMode = signal<'table' | 'form'>('table');

  // data
  rooms: WritableSignal<Room[] | undefined> = signal(undefined);

  // data pre formular
  activeRoom: Partial<Room> = {};

  // definicia stlpcov
  columns: Column<Room>[] = [
    {name: '#', value: row => row.id},
    {name: 'Number', value: row => row.cislo},
    {name: 'Type', value: row => row.type},
    {name: 'Price(€)', value: row => row.price},
    {name: 'Status',
      isHtml: true, // 1. Povieme tabuľke: "Toto je HTML, nie text!"
      value: (room) => room.isOccupied
        ? '<span class="badge bg-danger">Occupied</span>'   // 2. HTML pre obsadenú
        : '<span class="badge bg-success">Available</span>' // 3. HTML pre voľnú
    },
    {name: 'Capacity', value: row => row.capacity},
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

  // nacitanie dat z backendu
  loadData() {
    this.roomsService.getRooms().pipe(take(1)).subscribe(data => {
      this.rooms.set(data);
    });
  }

  //formular
  openForm(existingRoom?: Room) {
    if (existingRoom) {
      this.activeRoom = { ...existingRoom };
    } else {
      // default hodnoty pre novu izbu
      this.activeRoom = {
        cislo: '',
        type: 'single',
        price: '',
        capacity: 1,
        isOccupied: false
      };
    }
    this.viewMode.set('form');
  }

  closeForm() {
    this.viewMode.set('table');
    this.activeRoom = {};
  }

  saveRoom() {
    if (this.activeRoom.id) {
      this.roomsService.updateRoom(this.activeRoom.id, this.activeRoom).subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      this.roomsService.createRoom(this.activeRoom).subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
        },
        error: (err) => console.error('Create failed', err)
      });
    }
  }

  // akcie tabulky
  onRowAction(event: ActionEvent<Room>): void {
    const room = event.row;
    switch (event.type) {
      case ActionType.Change:
        if (room.isOccupied) {
          alert('Unable to change occupied room! First, you must cancel the reservation.');
          return;
        }
        this.openForm(room);
        break;

      case ActionType.Delete:
        if (confirm(`Do you really want delete the room ${room.cislo}?`)) { // Upravil som id na cislo pre krajsi text
          this.deleteRoom(room.id);
        }
        break;
    }
  }

  private deleteRoom(id: number): void {
    this.roomsService.deleteRoom(id).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => {
        alert('Cannot delete room. It might have active reservations.');
        console.error(err);
      }
    });
  }
}
