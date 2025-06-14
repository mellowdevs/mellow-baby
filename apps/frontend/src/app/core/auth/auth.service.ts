import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  access_token: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Sends login creds to MellowAPI and stores JWT upon success
   * @param credentials - the user's email and password
   * @returns an observable with server's auth response
   */
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((resp) => {
        this.saveAccessToken(resp.access_token);
      }),
    );
  }

  private saveAccessToken(token: string): void {
    localStorage.setItem('mellow_token', token);
  }
}
