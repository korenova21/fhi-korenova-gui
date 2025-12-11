import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Room} from '../models/room.model';
import {API_URL} from '../consts/app.consts';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {

  private http = inject(HttpClient)

  getRooms() {
    return this.http.get<Room[]>(`${API_URL}/rooms`);
  }
}
