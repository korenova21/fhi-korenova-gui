import {Component, inject} from '@angular/core';
import {PageTitle} from '../../components/page-title/page-title';
import {Card} from '../../components/card/card';
import {Table} from '../../components/table/table';
import {Loader} from '../../components/loader/loader';
import {toSignal} from '@angular/core/rxjs-interop';
import {Column} from '../../models/column.model';
import {ReservationsService} from '../../services/reservations.service';
import {Reservation} from '../../models/reservation.model';
import {ActionType, ActionEvent} from '../../models/action.model'; // <-- NOVÝ IMPORT
import {Router} from '@angular/router'; // <-- NOVÝ IMPORT (pre navigáciu)

@Component({
  selector: 'app-reservations',
  imports: [
    PageTitle,
    Card,
    Loader,
    Table
  ],
  templateUrl: './reservations.html',
})
export default class Reservations {
  private reservationsService = inject(ReservationsService);
  private router = inject(Router);

  // Musíme znovu načítať dáta po akcii, preto môžeme použiť reaktívnu stratégiu
  // Ale pre jednoduchosť to necháme zatiaľ takto, len pridáme metódu reload
  reservations = toSignal(this.reservationsService.getReservations());

  // 1. Upravená definícia stĺpcov s Akciami
  columns: Column<Reservation>[] = [
    {name: '#', value: row => row.code},
    {name: 'Name', value: row => row.guest.name},
    {name: 'Room', value: row => row.room.cislo},
    {name: 'Nights', value: row => row.nights},
    {name: 'NoP', value: row => row.party},
    // NOVÝ STĹPEC AKCIÍ
    {
      name: 'Akcie',
      actions: [
        { label: 'Change', type: ActionType.Change, cssClass: 'btn-sm btn-outline-primary' },
        { label: 'Delete', type: ActionType.Delete, cssClass: 'btn-sm btn-outline-danger' }
      ]
    }
  ];

  // 2. Handler pre akcie z riadku
  onRowAction(event: ActionEvent<Reservation>): void {
    const reservation = event.row;

    switch (event.type) {
      case ActionType.Change:
        console.log(`Open form for editing reservation ${reservation.code}`);
        // TODO: Implementovať navigáciu na editačnú stránku
        // this.router.navigate(['/reservations', reservation.code, 'edit']);
        break;

      case ActionType.Delete:
        if (confirm(`Naozaj chcete vymazať rezerváciu ${reservation.code}?`)) {
          this.deleteReservation(reservation.code);
        }
        break;
    }
  }

  // 3. Handler pre "+New"
  openNewReservationForm(): void {
    console.log('Open form for new reservation');
    // TODO: Implementovať navigáciu na pridávaciu stránku
    // this.router.navigate(['/reservations/new']);
  }

  // 4. Implementácia mazania
  private deleteReservation(code: string): void {
    this.reservationsService.deleteReservation(code).subscribe({
      next: () => {
        console.log(`Reservation ${code} deleted.`);
        // Po úspešnom vymazaní MUSÍŠ znovu načítať zoznam
        // Zatiaľ to necháme na manuálne F5, ale ideálne by tu mala byť reaktivita (napr. znovunačítanie streamu)
        window.location.reload();
      },
      error: (err) => {
        console.error('Error deleting reservation:', err);
        alert('Chyba pri mazaní rezervácie. Skontrolujte konzolu.');
      }
    });
  }
}
