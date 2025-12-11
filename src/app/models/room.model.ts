export interface Room {
  id:number;
  cislo: number;
  type: 'single' | 'double' | 'suite'| 'deluxe';
  price: string;
  isOccupied: boolean;
  capacity: string
}
