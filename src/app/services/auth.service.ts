import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;

  login(): void {
    this.token = 'eyJhbGciOiJub25lIn0.eyJzdWIiOiJkZW1vLXVzZXIifQ.fake-signature';
    localStorage.setItem('token', this.token);
  }

  getToken(): string | null {
    return this.token;
  }
}
