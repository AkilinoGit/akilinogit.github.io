import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/auth-service.service';
import { TxServiceService } from 'src/app/tx-service.service';
import Web3 from 'web3';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ABI as FACTORYABI} from 'src/app/abiFactory';
import { send } from 'process';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage  {

  web3: any;
  factoryContract: any;
  window:any;
  definirForm: any;
  invertirForm: any;
  admin: any;
  balance: any;
  recogerForm: any;
  AKIbalance: any;


  constructor(@Inject(DOCUMENT) private document: Document,
              private authService: AuthServiceService,
              private txService: TxServiceService,
              private formBuilder: FormBuilder) { 
    
    this.admin = authService.OWNER;
    this.web3 = new Web3();
    this.web3.setProvider(
                  new this.web3.providers.HttpProvider(this.authService.PROVIDER)
                );
    this.window = document.defaultView;
    
    this.definirForm = formBuilder.group({
      porcentajeInteres: "10",
      cantidad: "1000",
      cuotas: "10",
      penalizacionImpago: "10"
    });

    this.invertirForm = formBuilder.group({
      amount: ""
    });
    this.recogerForm = formBuilder.group({
      amount: ""
    });
    
    this.factoryContract = new this.web3.eth.Contract(FACTORYABI.abi, authService.FACTORY);
   

  }

  async ngOnInit() {
    if (localStorage.getItem('userAddress') !== this.authService.OWNER) {
      this.window.location.href = "/home";
    } 
    this.balance = await this.factoryContract.methods.getBalance().call({ from: localStorage.getItem('userAddress')});
    this.AKIbalance = await this.web3.eth.getBalance(this.authService.OWNER);
    
  }

  invertir(sendData : any) {
    var method = this.factoryContract.methods.invertir().encodeABI();
    console.log(sendData.amount);
    
    var amount = this.web3.utils.toHex(parseInt(sendData.amount));
    this.txService.makeTransaction(this.authService.FACTORY,amount,method);
  }
  recogerFondos(sendData: any) {
    var method =  this.factoryContract.methods.recolectarFondos(sendData.amount).encodeABI();
    this.txService.makeTransaction(this.authService.FACTORY,0,method);

  }
  checkeoMensual(){

  }
  

  definirPrestamo( sendData: any){
   var method = this.factoryContract.methods.definirPrestamo(sendData.porcentajeInteres,
              sendData.cantidad, sendData.cuotas, sendData.penalizacionImpago).encodeABI();
  
    this.txService.makeTransaction(this.authService.FACTORY,0,method);
  }
  
 logOut(){
    this.authService.deleteLogin;
    window.location.href = `/home`;
     
  }

}
