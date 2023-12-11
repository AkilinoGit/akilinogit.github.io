import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/auth-service.service';
import { TxServiceService } from 'src/app/tx-service.service';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {ABI as FACTORYABI} from 'src/app/abiFactory';
import {ABI as PRESTAMOCURSANDO} from 'src/app/abiPrestamos';

import Web3 from 'web3';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  window: any;
  web3: any;
  factoryContract: any;
  //Lista de posbles préstamos a contratar
  listaPrestamos: any; 
  //Lista de las direcciones de los préstamos contratados
  direccionesContratados: any;
  //Información de los préstamos contratados
  listaContratados: any[] = [];
  user: any;
  balance: any;

  constructor(@Inject(DOCUMENT) private document: Document,
      private authService: AuthServiceService,
      private txService: TxServiceService) {

      this.window = document.defaultView;
      this.web3 = new Web3(new Web3.providers.HttpProvider(authService.PROVIDER));
      this.factoryContract = new this.web3.eth.Contract(FACTORYABI.abi, authService.FACTORY);
      this.user = localStorage.getItem('userAddress');
      }

  async ngOnInit() {
  this.listaPrestamos = await this.factoryContract.methods.verTiposContrato().call();
  this.balance = await this.web3.eth.getBalance(localStorage.getItem('userAddress'));
  await this.iniciarVistaContratados();
  
  }

  //Recoge la información del estado de los préstamos contratados del SC
  async iniciarVistaContratados(){
   this.direccionesContratados = await this.factoryContract.methods
       .verContratos(localStorage.getItem('userAddress'))
        .call({ from: localStorage.getItem('userAddress')});

    this.direccionesContratados.forEach(async (direccion: any) => {
      var prestamoCursando = new this.web3.eth.Contract(PRESTAMOCURSANDO.abi, direccion);
      var contratado = await prestamoCursando.methods.mostrarInfo({from: localStorage.getItem('userAddress')}).call();
      contratado._ultimoCheckeo = this.secondsToDateString(contratado._ultimoCheckeo);
      contratado._state = this.contratoStateToString(contratado._state);
      this.listaContratados.push(contratado);
    });
  }
  
  contratarPrestamo(index: number){
    var method = this.factoryContract.methods.contratarPrestamo(localStorage.getItem('userAddress'),0).encodeABI();
    this.txService.makeTransaction(this.authService.FACTORY,0,method);

  }

  pagarCuota(prestamoAddress: any, amount: any){
    var prestamoContract = new this.web3.eth.Contract(PRESTAMOCURSANDO.abi, prestamoAddress);
    var method = prestamoContract.methods.pagarMensualidad().encodeABI();
    var cuota = this.web3.utils.toHex(parseInt(amount));
    this.txService.makeTransaction(prestamoAddress,cuota,method);
    

  }

  secondsToDateString(big: BigInt){
    var stringNum = big.toString();
  
    var numberNum = Number(stringNum) * 1000;
    
    var nextCheckDate= new Date(numberNum);
    nextCheckDate.setMonth(nextCheckDate.getMonth() + 1);
    
    var nextCheckString = nextCheckDate.getDay()+ '/'+ (nextCheckDate.getMonth() + 1 )+'/'+ nextCheckDate.getFullYear();
    return nextCheckString;
   
  }

  contratoStateToString(estado: number){
    if(estado == 0){
      return "CUOTA PAGADA";
    } else if (estado == 1) {
      return "PLAZO ABIERTO";
    } else {
      return "FINALIZADO";
    }
  }

  logOut(){
    this.authService.deleteLogin;
    window.location.href = `/home`;
  }

}
