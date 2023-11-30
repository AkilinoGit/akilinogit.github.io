import { Injectable } from '@angular/core';
import { AuthService } from './authService';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import Web3 from 'web3';

//NO TIENE VALORES EL AUTHSERVICE injectados
@Injectable({
  providedIn: 'root',
})  
export class TxService {
  web3: any;
  window: any;

    constructor( @Inject(DOCUMENT)private document: Document, private authService: AuthService){
      this.window = document.defaultView;
      this.web3 = new Web3(authService.PROVIDER);
    }


    async makeTransaction(_to:String, _value:any, _data:any){
      this.signAndSendTransaction(await this.buildTransaction(_to, _value, _data))
    }
    
    async buildTransaction(_to:String, _value:any, _data:any) {
      console.log(this.web3);
      const transaction = {
        from: this.authService.userAddress,
        to: _to,
        value: _value,
        gas: 21000,
        gasPrice: 20000000000,
        nonce: await this.web3.eth.getTransactionCount(this.authService.userAddress),
        data: _data
      };

      return transaction;
    }

    signAndSendTransaction(transaction: any) {
      
      this.web3.eth.sendTransaction(transaction)
        .on('transactionHash', (hash: any) => {
          console.log('Hash de transacción:', hash);
        })
        .on('confirmation', (confirmationNumber: any, receipt: any) => {
          console.log('Confirmación:', confirmationNumber);
        })
        .on('receipt', (receipt: any) => {
          console.log('Recibo:', receipt);
        })
        .on('error', (error: any) => {
          console.error('Error:', error);
        });
    }
    
}