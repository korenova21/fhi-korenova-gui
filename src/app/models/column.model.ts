export interface Column<T> {
  name: string;
  value: (row: T) => string | number;
}
