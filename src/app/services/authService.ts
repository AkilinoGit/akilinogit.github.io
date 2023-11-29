import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAuthenticated = false;
  public userAddress: string | null = null;

  constructor() {}

  login(address: string) {
    this.isAuthenticated = true;
    this.userAddress = address;
  }

  logout() {
    this.isAuthenticated = false;
    this.userAddress = null;

  }
}
