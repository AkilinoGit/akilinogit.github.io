import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/auth-service.service';
import { TxServiceService } from 'src/app/tx-service.service';
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
              private authService: AuthServiceService,
              private txService: TxServiceService,
              private formBuilder: FormBuilder) { 

    this.web3 = new Web3();
   this.web3.setProvider(
                  new this.web3.providers.HttpProvider('https://sepolia.infura.io/v3/d09825f256ae4705a74fdee006040903')
                );
    this.window = document.defaultView;
    
    this.definirForm = formBuilder.group({
      porcentajeInteres: "10",
      cantidad: "1000",
      cuotas: "10",
      penalizacionImpago: "10"
    });
    
    this.factoryContract = new this.web3.eth.Contract(FACTORYABI.abi, authService.FACTORY);

  }

  ionViewWillEnter() {
    if (localStorage.getItem('userAddress') !== this.authService.OWNER) {
      this.window.location.href = "/home";
    } 
    
  }
  

  definirPrestamo( sendData: any){
    const method = this.factoryContract.methods.verTiposContrato().encodeABI();
    //this.factoryContract.methods.definirPrestamo(sendData.porcentajeInteres,
     //         sendData.cantidad, sendData.cuotas, sendData.penalizacionImpago).encodeABI();

    this.txService.makeTransaction(this.authService.FACTORY,0,method);
  }
  
 logOut(){
    this.authService.deleteLogin;
    window.location.href = `/home`;
     
  }

}
