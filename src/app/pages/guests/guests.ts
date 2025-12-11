import {Component, inject, signal, WritableSignal} from '@angular/core';
import {PageTitle} from '../../components/page-title/page-title';
import {Card} from '../../components/card/card';
import {Table} from '../../components/table/table';
import {Loader} from '../../components/loader/loader';
import {FormsModule} from '@angular/forms'; // Potrebné pre formulár
import {PersonsService} from '../../services/persons.service';
import {Person} from '../../models/person.model';
import {Column} from '../../models/column.model';
import {ActionEvent, ActionType} from '../../models/action.model';
import {toSignal} from '@angular/core/rxjs-interop';
import {take} from 'rxjs';

@Component({
  selector: 'app-guests',
  imports: [
    PageTitle,
    Card,
    Table,
    Loader,
    FormsModule // Dôležité pre [(ngModel)]
  ],
  templateUrl: './guests.html',
})
export default class Guests {
  private personsService = inject(PersonsService);

  // STAV STRÁNKY: 'table' alebo 'form'
  viewMode = signal<'table' | 'form'>('table');

  // DÁTA
  persons: WritableSignal<Person[] | undefined> = signal(undefined);

  // EDITOVANÝ OBJEKT (Ak je null, vytvárame nový)
  activePerson: Partial<Person> = {};

  columns: Column<Person>[] = [
    {name: '#', value: row => row.id},
    {name: 'Name', value: row => row.name},
    {name: 'Email', value: row => row.email},
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
    this.personsService.getPersons().pipe(take(1)).subscribe(data => {
      this.persons.set(data);
    });
  }

  // --- LOGIKA PREPÍNANIA ---

  openForm(existingPerson?: Person) {
    if (existingPerson) {
      // Edit mode: skopírujeme dáta, aby sme nemenili tabuľku pri písaní
      this.activePerson = { ...existingPerson };
    } else {
      // Create mode: prázdny objekt
      this.activePerson = { name: '', email: '' };
    }
    this.viewMode.set('form'); // Prepne zobrazenie na formulár
  }

  closeForm() {
    this.viewMode.set('table'); // Prepne späť na tabuľku
    this.activePerson = {};
  }

  // --- ACTIONS (Backend volania) ---

  savePerson() {
    if (this.activePerson.id) {
      // UPDATE
      this.personsService.updatePerson(this.activePerson.id, this.activePerson).subscribe(() => {
        this.loadData();
        this.closeForm();
      });
    } else {
      // CREATE
      this.personsService.createPerson(this.activePerson).subscribe(() => {
        this.loadData();
        this.closeForm();
      });
    }
  }

  onRowAction(event: ActionEvent<Person>) {
    if (event.type === ActionType.Delete) {
      if(confirm('Delete user?')) {
        this.personsService.deletePerson(event.row.id).subscribe(() => this.loadData());
      }
    } else if (event.type === ActionType.Change) {
      this.openForm(event.row);
    }
  }
}
