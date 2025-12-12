import { ColumnAction } from './action.model';

export interface Column<T> {
  name: string;
  value?: (row: T) => any;
  actions?: ColumnAction[];
  isHtml?: boolean;
}
