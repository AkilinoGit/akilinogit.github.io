import { Component } from '@angular/core';
import Web3 from 'web3';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  private web3: any;
  window: any;
  wallet: any;
  
  constructor() {

    
  }


  loginMetamask() {
    this.window.ethereum.enable().then(async (accounts:any) => {
      this.wallet.address = accounts[0];
    });
  }

  async enableMetaMask() {
    try {
      await this.web3.currentProvider.enable();
      console.log('MetaMask habilitado');
      const userAddress = await this.web3.eth.getAccounts();
      console.log('Dirección del usuario:', userAddress[0]);
    } catch (error) {
      console.error('Error al habilitar MetaMask:', error);
    }
  }


}
