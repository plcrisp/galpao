import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodeService {
  private apiKey = 'b6e2c6ca9406436e83d69be68bd095ef'; // Substitua por sua chave da OpenCage API
  private apiUrl = 'https://api.opencagedata.com/geocode/v1/json';

  constructor(private http: HttpClient) {}

  reverseGeocode(latitude: number, longitude: number): Observable<any> {
    const url = `${this.apiUrl}?q=${latitude}+${longitude}&key=${this.apiKey}`;
    return this.http.get<any>(url);
  }
}
