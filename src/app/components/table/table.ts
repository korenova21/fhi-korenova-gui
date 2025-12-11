import {Component, input, output, Input} from '@angular/core';
import {Column} from '../../models/column.model';
import {ActionEvent, ColumnAction} from '../../models/action.model'; // <-- NOVÝ IMPORT

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
})
export class Table<T> {

  rows = input.required<T[]>();
  columns = input.required<Column<T>[]>();

  // NOVÉ: Definovanie, že komponent Table bude odosielať udalosť 'rowAction'
  rowAction = output<ActionEvent<T>>();

  // NOVÉ: Funkcia, ktorá sa zavolá pri kliknutí na tlačidlo v riadku
  onActionClick(row: T, action: ColumnAction): void {
    // Odosielame udalosť s dátami celého riadku (row) a typom akcie (type)
    this.rowAction.emit({
      type: action.type,
      row: row
    } as ActionEvent<T>);
  }
}
