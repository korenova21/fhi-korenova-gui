import {Component, inject} from '@angular/core';
import {PageTitle} from '../../components/page-title/page-title';
import {Card} from '../../components/card/card';
import {Table} from '../../components/table/table';
import {Person} from '../../models/person.model';
import {Column} from '../../models/column.model';
import {PersonsService} from '../../services/persons.service';
import {Loader} from '../../components/loader/loader';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-persons',
  imports: [
    PageTitle,
    Card,
    Table,
    Loader
  ],
  templateUrl: './persons.html',
})
export default class Persons {
  private personsService = inject(PersonsService)

  persons = toSignal(this.personsService.getPersons());

  columns: Column<Person>[] = [
    {name: '#', value: row => row.id},
    {name: 'Name', value: row => row.name},
    {name: 'Address', value: row => row.address},
  ];
}
