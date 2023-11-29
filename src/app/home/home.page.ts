import { Component } from '@angular/core';
import Web3 from 'web3';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  private web3: any;
  window: any;
  wallet: any;
  
  constructor(@Inject(DOCUMENT) private document: Document, private authService: AuthService) {

    this.window = document.defaultView;
    this.web3 = new Web3(this.window.ethereum);

  }


 async loginMetamask() {
    if (this.window.ethereum) {
      try {
        // Request account access
        await this.window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the user's address
        const accounts = await this.window.ethereum.request({ method: 'eth_accounts' });
        const userAddress = accounts[0];
        this.handleLoginRedirect(userAddress);

      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('MetaMask not detected. Please install MetaMask.');
    }
  }

  private handleLoginRedirect(userAddress: string) {
    
    const redirectUrl = this.determineRedirectUrl(userAddress);

    this.authService.login(userAddress);
    window.location.href = redirectUrl;
  }

  private determineRedirectUrl(userAddress: string): string {
    // Implement your logic to determine the redirect URL based on the user's address
    // For example, you might have a mapping of addresses to specific URLs
    // You can also use regular expressions, etc.
   /* if (userAddress === '0xYourAddress1') {
      return '/dashboard1';
    } else if (userAddress === '0xYourAddress2') {
      return '/dashboard2';
    } else {
      return '/defaultRedirect';
    }
    */
   return '/admin'
  }


}
