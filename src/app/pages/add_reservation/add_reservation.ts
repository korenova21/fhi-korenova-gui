import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageTitle } from '../../components/page-title/page-title';
import { Card } from '../../components/card/card';
import { ReservationsService } from '../../services/reservations.service';
import { RoomsService } from '../../services/rooms.service';
import { Room } from '../../models/room.model';
import { Person } from '../../models/person.model';
import { Reservation } from '../../models/reservation.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-reservation',
  standalone: true,
  imports: [PageTitle, Card, FormsModule],
  templateUrl: './add_reservation.html',
})
export default class AddReservation {
  private reservationsService = inject(ReservationsService);
  private roomsService = inject(RoomsService);

  guestName: string = '';
  selectedRoomId: number | null = null;
  nights: number = 1;
  party: string = '';

  rooms: Room[] = [];
  reservations = toSignal(this.reservationsService.getReservations());

  constructor() {
    // Load rooms
    this.roomsService.getRooms().subscribe((rooms) => (this.rooms = rooms));
  }

  submitReservation() {
    if (!this.guestName || !this.selectedRoomId) {
      alert('Please fill all required fields');
      return;
    }

    const room = this.rooms.find((r) => r.id === this.selectedRoomId)!;

    const guest: Person = {
      id: 0,            // temporary placeholder
      name: this.guestName,
      email: ''         // optional
    };

    const newReservation: Partial<Reservation> = {
      guest,
      room,
      nights: this.nights,
      party: this.party
    };

    this.reservationsService.createReservation(newReservation).subscribe({
      next: () => {
        alert('Reservation added!');
        // Clear form
        this.guestName = '';
        this.selectedRoomId = null;
        this.nights = 1;
        this.party = '';

        // Refresh reservations list
        this.reservations = toSignal(this.reservationsService.getReservations());
      },
      error: (err) => {
        console.error(err);
        alert('Failed to create reservation');
      },
    });
  }
}
