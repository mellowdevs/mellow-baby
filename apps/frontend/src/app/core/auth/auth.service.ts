import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { RegisterDTO } from '../../pages/register/models/register-dto.model';

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
   * Sends registers creds to MellowAPI and stores JWT upon success
   * @param registerDto - the user's email, name and password
   * @returns an observable with server's auth response
   */
  register(registerDto: RegisterDTO): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users`, registerDto).pipe(
      tap((resp) => {
        console.log(resp);
      }),
    );
  }

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
