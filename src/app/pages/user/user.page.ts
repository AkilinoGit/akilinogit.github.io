import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/auth-service.service';
import { TxServiceService } from 'src/app/tx-service.service';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {ABI as FACTORYABI} from 'src/app/abiFactory';

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
  listaPrestamos: any;

  constructor(@Inject(DOCUMENT) private document: Document,
      private authService: AuthServiceService,
      private txService: TxServiceService) {
      this.window = document.defaultView;

      this.web3 = new Web3(new Web3.providers.HttpProvider(authService.PROVIDER));
      this.factoryContract = new this.web3.eth.Contract(FACTORYABI.abi, authService.FACTORY);
      }

  async ngOnInit() {
  this.listaPrestamos = await this.factoryContract.methods.verTiposContrato().call().then();

  }
  contratarPrestamo(){}



  logOut(){
    this.authService.deleteLogin;
    window.location.href = `/home`;
  }

}
