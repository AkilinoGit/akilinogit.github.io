import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authService';
import { TxService } from 'src/app/services/txService';
import Web3 from 'web3';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ABI as FACTORYABI} from 'src/app/abiFactory';

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
 


  constructor(@Inject(DOCUMENT) private document: Document,
              private authService: AuthService,
              private txService: TxService,
              private formBuilder: FormBuilder) { 

    this.web3 = new Web3(authService.PROVIDER);
    this.window = document.defaultView;
    
    this.definirForm = formBuilder.group({
      porcentajeInteres: "",
      cantidad: "",
      cuotas: "",
      penalizacionImpago: ""
    });
    
    this.factoryContract = new this.web3.eth.Contract(FACTORYABI.abi, authService.FACTORY);

  }

  ionViewWillEnter() {
    /*if (this.authService.userAddress !== this.authService.OWNER) {
      this.window.location.href = "/home";
    } 
    */
  }
  

  definirPrestamo( sendData: any){
    const method = this.factoryContract.methods.definirPrestamo(sendData.porcentajeInteres,
              sendData.cantidad, sendData.cuotas, sendData.penalizacionImpago).encodeABI();

    this.txService.makeTransaction(this.authService.FACTORY,0,method);
  }
  
  logOut(){
    this.authService.logout;
    window.location.href = `/home`;
  }

}
