import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../consts/app.consts';
import {Package} from '../models/package.model';

@Injectable({
  providedIn: 'root',
})
export class PackagesService {

  private http = inject(HttpClient)

  getPackages() {
    return this.http.get<Package[]>(`${API_URL}/packages`);
  }
}
