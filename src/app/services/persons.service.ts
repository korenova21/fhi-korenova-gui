import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Person} from '../models/person.model';
import {API_URL} from '../consts/app.consts';

@Injectable({
  providedIn: 'root',
})
export class PersonsService {

  private http = inject(HttpClient)

  getPersons() {
    return this.http.get<Person[]>(`${API_URL}/persons`);
  }


  createPerson(person: Partial<Person>) {
    return this.http.post<number>(`${API_URL}/persons`, person);
  }


  deletePerson(id: number) {
    return this.http.delete<void>(`${API_URL}/persons/${id}`);
  }

  updatePerson(id: number, person: Partial<Person>) {
    return this.http.put<void>(`${API_URL}/persons/${id}`, person);
  }
}
