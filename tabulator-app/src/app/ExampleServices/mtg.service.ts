import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MtgService {

  public baseURL = 'https://api.scryfall.com';
  public searchParams = 'q=%28set%3Ator+OR+set%3Apls+OR+set%3Ainv+OR+set%3Apcy+OR+set%3Anem%29+%28rarity%3Ar+OR+rarity%3Am%29+lang%3Aany&unique=cards';

  constructor(private http: HttpClient) { }

  getLocalMTGCards(): Observable<any> {
    const url = `${this.baseURL}/cards/search?${this.searchParams}`;
    return this.http.get<any>(url);
  }

  getRemoteMTGCards(): string {
    const url = `${this.baseURL}/cards?`;
    return url;
  }

}
