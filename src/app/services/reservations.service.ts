import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../consts/app.consts';
import {Reservation} from '../models/reservation.model';

// ... existujúce importy

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {

  private http = inject(HttpClient)

  getReservations() {
    return this.http.get<Reservation[]>(`${API_URL}/reservations`);
  }

  createReservation(reservation: Partial<Reservation>) {
    return this.http.post<string>(`${API_URL}/reservations`, reservation);
  }

  // NOVÉ: Vymazanie rezervácie
  deleteReservation(code: string) {
    return this.http.delete<void>(`${API_URL}/reservations/${code}`);
  }

  // NOVÉ: Úprava rezervácie
  updateReservation(code: string, reservationData: Partial<Reservation>) {
    return this.http.put<void>(`${API_URL}/reservations/${code}`, reservationData);
  }
}
