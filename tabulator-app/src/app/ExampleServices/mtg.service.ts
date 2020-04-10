import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MtgService {

  public baseURL = 'https://api.magicthegathering.io/v1/';

  constructor(private http: HttpClient) { }

  getLocalMTGCards(): Observable<any> {
    const url = `${this.baseURL}/cards?`;
    return this.http.get<any>(url);
  }

  getRemoteMTGCards(): string {
    const url = `${this.baseURL}/cards`;
    return url;
  }

}
