import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 
  window: any;
    
  
  constructor(@Inject(DOCUMENT) private document: Document, private authService: AuthService) {
    this.window = document.defaultView;
  }

 async loginMetamask() {
    await this.authService.loginMetamask();
    const redirectUrl = this.redirectUrl(this.authService.userAddress);
    window.location.href = redirectUrl;
  }

  private redirectUrl(userAddress: string | null): string {
    if (userAddress === this.authService.OWNER){
      return '/admin';
    }
    else {
      return '/user';
    }
    
  }
}




