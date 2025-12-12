export interface Room {
  id:number;
  cislo: string;
  type: 'single' | 'double' | 'suite'| 'deluxe';
  price: string;
  isOccupied: boolean;
  capacity: number
}
