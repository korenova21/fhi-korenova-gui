import {Component, input, output} from '@angular/core'; // Pridaný 'output'
import {Column} from '../../models/column.model';
import {ActionEvent, ColumnAction} from '../../models/action.model'; // NOVÝ IMPORT

@Component({
  selector: 'app-table',
  imports: [],
  standalone: true, // Predpokladám, že používaš standalone, ak nie, pridaj do NgModule
  templateUrl: './table.html',
})
export class Table<T> {

  rows = input.required<T[]>();
  columns = input.required<Column<T>[]>();

  // NOVÉ: Definovanie eventu, ktorý sa odosiela pri kliknutí na akčné tlačidlo
  rowAction = output<ActionEvent<T>>();

  // NOVÉ: Handler pre kliknutie na tlačidlo v riadku
  onActionClick(row: T, action: ColumnAction): void {
    this.rowAction.emit({
      type: action.type,
      row: row
    } as ActionEvent<T>);
  }
}
