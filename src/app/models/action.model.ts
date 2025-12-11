export enum ActionType {
  Change = 'change',
  Delete = 'delete',
  New = 'new', // Pre hlavné tlačidlo (voliteľné)
}

// Akcia definovaná pre stĺpec
export interface ColumnAction {
  label: string;
  type: ActionType;
  cssClass?: string;
}

// Objekt, ktorý vráti tabuľka po kliknutí
export interface ActionEvent<T> {
  type: ActionType;
  row: T; // Celý objekt riadku (Reservation/Room)
}
