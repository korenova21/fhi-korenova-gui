import { Room } from './room.model';
import {Person} from './person.model';
export interface Reservation {
  code: string;
  guest: Person;
  room: Room;
  nights: number;
  party: number;
}
