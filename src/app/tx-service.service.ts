import { Injectable } from '@angular/core';
import { AuthServiceService } from 'src/app/auth-service.service';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import Web3, { AbiError } from 'web3';


//NO TIENE VALORES EL AUTHSERVICE injectados
@Injectable({
  providedIn: 'root',
})  
export class TxServiceService {
  web3: any;
  window: any;

    constructor( @Inject(DOCUMENT)private document: Document, private authService: AuthServiceService){
      this.window = document.defaultView;
      this.web3 = new Web3();
      this.web3.setProvider(
        new this.web3.providers.HttpProvider('https://sepolia.infura.io/v3/d09825f256ae4705a74fdee006040903')
      );
  
    }


    async makeTransaction(_to:String, _value:any, _data:any){
    
      this.signAndSendTransaction(await this.buildTransaction(_to, _value, _data))
    }
    
    async buildTransaction(_to:String, _value:any, _data:any) {

  
      var transaction = [{
        from: localStorage.getItem('userAddress'),
        to: _to,
        value: _value,
        gas: this.web3.utils.toHex(1000000),
        gasPrice: this.web3.utils.toHex(2000000),
        nonce: await this.web3.eth.getTransactionCount(localStorage.getItem('userAddress')).toString,
        data: _data
      }];

      return transaction;
    }

signAndSendTransaction(transaction: any) {
      
      console.log(transaction)

      this.window.ethereum
      .request({
    method: 'eth_sendTransaction',
    params: transaction
  })
  .then((result: any) => {
    // The result varies by RPC method.
    // For example, this method returns a transaction hash hexadecimal string upon success.
    console.log(result);
    console.log("succes");
  })
  .catch((error: any) => {
    // If the request fails, the Promise rejects with an error.
    console.log(error);
  });
      

    }
    
}