import { Injectable } from '@angular/core';
import { AuthServiceService } from 'src/app/auth-service.service';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import Web3 from 'web3';


@Injectable({
  providedIn: 'root',
})  
export class TxServiceService {
  web3: any;
  window: any;

  constructor( @Inject(DOCUMENT)private document: Document, private authService: AuthServiceService){
    this.window = document.defaultView;
    this.web3 = new Web3();
    this.web3.setProvider(new this.web3.providers.HttpProvider(this.authService.PROVIDER));
  }


  async makeTransaction(_to:String, _value:any, _data:any){
    await this.signAndSendTransaction(await this.buildTransaction(_to, _value, _data));
  }

//Hace una transacción y espera al minado para obtener lo que retorne la función del SC
  async makeAndWaitTransaction(_to:String, _value:any, _data:any){
    var transactionHash = await this.signAndSendTransaction(await this.buildTransaction(_to, _value, _data));
    return await this.esperarMinado(transactionHash);

  }

  async esperarMinado(transactionHash : any){
    const intentos = 60;
    var intentoActual = 0 ;
    var receipt = null;
    while (intentoActual < intentos) {
      try {
        receipt = await this.web3.eth.getTransactionReceipt(transactionHash);
        if (receipt !== null) {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
      } catch (error) {
        console.error('Error al obtener el recibo de la transacción: ', error);
        console.error('Intento numero' + intentoActual);
      }
      intentoActual++;
    }
    console.log(receipt);
    return receipt.logs;

  }
 
    
  async buildTransaction(_to:String, _value:any, _data:any) {
    var transaction = [{
      from: localStorage.getItem('userAddress'),
      to: _to,
      value: _value,
      gas: this.web3.utils.toHex(2000000),
      gasPrice: this.web3.utils.toHex(5000000000),
      // METAMASK MANEJA EL nonce: 
      data: _data,
      }];

      return transaction;
    }

 async signAndSendTransaction(transaction: any) {
  try{
    const result : any =  await this.window.ethereum
    .request({
      method: 'eth_sendTransaction',
      params: transaction
    });
    console.log(result);
    console.log("succes");

    return result;

  }catch(error: any){
      console.log('ERROR:');
      console.log(error);
      console.log('MENSAJE: ');
      console.log(error.message);
    }
  }

  
}