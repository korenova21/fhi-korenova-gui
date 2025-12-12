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

  createRoom(room: Partial<Room>) {
    return this.http.post<string>(`${API_URL}/rooms`, room);
  }

  deleteRoom(id: number) {
    return this.http.delete<void>(`${API_URL}/rooms/${id}`);
  }

  updateRoom(id: number, roomData: Partial<Room>) {
    return this.http.put<void>(`${API_URL}/rooms/${id}`, roomData);
  }
}
