import { ColumnAction } from './action.model';

export interface Column<T> {
  name: string;
  value?: (row: T) => any; // Nastavené ako voliteľné, aby mohol byť stĺpec len pre akcie
  actions?: ColumnAction[]; // NOVÉ: Pole definícií tlačidiel
}
