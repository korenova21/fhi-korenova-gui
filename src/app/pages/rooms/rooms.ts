import {Component, inject} from '@angular/core';
import {PageTitle} from '../../components/page-title/page-title';
import {Card} from '../../components/card/card';
import {Table} from '../../components/table/table';
import {Room} from '../../models/room.model';
import {Column} from '../../models/column.model';
import {RoomsService} from '../../services/rooms.service';
import {Loader} from '../../components/loader/loader';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-rooms',
  imports: [
    PageTitle,
    Card,
    Table,
    Loader
  ],
  templateUrl: './rooms.html',
})
export default class Rooms {
  private roomsService = inject(RoomsService)

  rooms = toSignal(this.roomsService.getRooms());

  columns: Column<Room>[] = [
    {name: '#', value: row => row.id},
    {name: 'Number', value: row => row.cislo},
    {name: 'Type', value: row => row.type},
    {name: 'Price', value: row => row.price},
    {name: 'Status', value: (room) => room.isOccupied ? 'occupied' : 'available' },
    {name: 'Capacity', value: row => row.capacity},
  ];
}
