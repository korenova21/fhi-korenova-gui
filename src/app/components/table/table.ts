import {Component, input, output} from '@angular/core'; // Pridaný 'output'
import {Column} from '../../models/column.model';
import {ActionEvent, ColumnAction} from '../../models/action.model'; // NOVÝ IMPORT

@Component({
  selector: 'app-table',
  imports: [],
  standalone: true,
  templateUrl: './table.html',
})
export class Table<T> {

  rows = input.required<T[]>();
  columns = input.required<Column<T>[]>();

  rowAction = output<ActionEvent<T>>();

  onActionClick(row: T, action: ColumnAction): void {
    this.rowAction.emit({
      type: action.type,
      row: row
    } as ActionEvent<T>);
  }
}
