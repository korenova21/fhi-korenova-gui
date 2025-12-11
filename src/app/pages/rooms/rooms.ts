import {Component, inject, signal, WritableSignal} from '@angular/core';
import {FormsModule} from '@angular/forms'; // Dôležité pre [(ngModel)]
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
    FormsModule // Musí byť importované pre formuláre
  ],
  templateUrl: './rooms.html',
})
export default class Rooms {
  private roomsService = inject(RoomsService);

  // 1. STAV STRÁNKY: 'table' (zoznam) alebo 'form' (pridanie/úprava)
  viewMode = signal<'table' | 'form'>('table');

  // 2. DÁTA IZIEB
  rooms: WritableSignal<Room[] | undefined> = signal(undefined);

  // 3. DÁTA PRE FORMULÁR (Ak je id undefined, vytvárame novú)
  activeRoom: Partial<Room> = {};

  // 4. DEFINÍCIA STĹPCOV
  columns: Column<Room>[] = [
    {name: '#', value: row => row.id},
    {name: 'Number', value: row => row.cislo},
    {name: 'Type', value: row => row.type},
    {name: 'Price', value: row => row.price},
    {name: 'Status', value: (room) => room.isOccupied ? 'Occupied' : 'Available' },
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

  // Načítanie dát z backendu
  loadData() {
    this.roomsService.getRooms().pipe(take(1)).subscribe(data => {
      this.rooms.set(data);
    });
  }

  // --- LOGIKA FORMULÁRA ---

  // Otvorí formulár. Ak pošleme 'room', ideme editovať. Ak nie, vytvárame novú.
  openForm(existingRoom?: Room) {
    if (existingRoom) {
      // Klonujeme objekt, aby sa zmeny neprejavili v tabuľke okamžite pri písaní
      this.activeRoom = { ...existingRoom };
    } else {
      // Default hodnoty pre novú izbu
      this.activeRoom = {
        cislo: '',
        type: 'single',
        price: '',
        capacity: '1',
        isOccupied: false
      };
    }
    this.viewMode.set('form'); // Prepne HTML na formulár
  }

  // Zatvorí formulár a vráti sa na tabuľku
  closeForm() {
    this.viewMode.set('table');
    this.activeRoom = {}; // Vyčistíme
  }

  // Uloženie (Create alebo Update)
  saveRoom() {
    if (this.activeRoom.id) {
      // UPDATE: Ak máme ID, upravujeme existujúcu
      this.roomsService.updateRoom(this.activeRoom.id, this.activeRoom).subscribe({
        next: () => {
          this.loadData(); // Obnovíme zoznam
          this.closeForm(); // Zatvoríme formulár
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      // CREATE: Ak nemáme ID, vytvárame novú
      this.roomsService.createRoom(this.activeRoom).subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
        },
        error: (err) => console.error('Create failed', err)
      });
    }
  }

  // --- AKCIE Z TABUĽKY ---

  onRowAction(event: ActionEvent<Room>): void {
    switch (event.type) {
      case ActionType.Change:
        // Kliknutie na Change -> Otvoríme formulár s dátami riadku
        this.openForm(event.row);
        break;

      case ActionType.Delete:
        // Kliknutie na Delete -> Potvrdenie a výmaz
        if (confirm(`Are you sure you want to delete room ${event.row.cislo}?`)) {
          this.deleteRoom(event.row.id);
        }
        break;
    }
  }

  private deleteRoom(id: number): void {
    this.roomsService.deleteRoom(id).subscribe({
      next: () => {
        this.loadData(); // Obnovíme dáta
      },
      error: (err) => {
        alert('Cannot delete room. It might have active reservations.');
        console.error(err);
      }
    });
  }
}
