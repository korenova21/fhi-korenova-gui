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
}
