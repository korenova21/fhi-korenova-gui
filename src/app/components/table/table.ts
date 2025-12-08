import {Component, input} from '@angular/core';
import {Column} from '../../models/column.model';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
})
export class Table<T> {

  rows = input.required<T[]>();
  columns = input.required<Column<T>[]>();
}
