import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.apiUrl;

  private http = inject(HttpClient);

  async login(email: string, senha: string): Promise<void> {
    const res = await lastValueFrom(this.http.post<{ accessToken: string }>(`${this.api}/login`, { email, senha }));
    localStorage.setItem('accessToken', res!.accessToken);
  }

  logout() {
    localStorage.removeItem('accessToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  async refreshToken(): Promise<string> {
    const res = await lastValueFrom(this.http.post<{ token: string }>(`${this.api}/refresh-token`, {}, { withCredentials: true }));
    localStorage.setItem('accessToken', res!.token);
    return res!.token;
  }
}
