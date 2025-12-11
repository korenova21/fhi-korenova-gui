import { ColumnAction } from './action.model';

export interface Column<T> {
  name: string;
  // Buď je stĺpec hodnota...
  value?: (row: T) => any;
  // ...alebo je to stĺpec s akciami.
  actions?: ColumnAction[];
}
