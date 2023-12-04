import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {

  //SEPOLIA
  
  public OWNER: string = "0x46ccd6c01296f9aa02a161b92b007e9ae7675e97"; 
  public FACTORY = "0xB923D2bd7a380aa2aE59f678091F59654407AdAD";
  public PROVIDER = "https://sepolia.infura.io/v3/d09825f256ae4705a74fdee006040903";
  
  //GANACHE
  /*
  public OWNER: string = "0x2dcb591e1591efe2439b589f3c80ccb925ead312"; 
  public FACTORY = "0x4Ee8BD81DC16d4FAC64927b589cc042e60C39C38"; 
  public PROVIDER = "http://localhost:8545";
*/
  window:any;

  constructor(@Inject(DOCUMENT)private document: Document) {
    this.window = document.defaultView;
  }


async  loginMetamask(){
  
    if (typeof this.window.ethereum !== 'undefined') {
      const accounts = await this.window.ethereum.request({ method: 'eth_requestAccounts' })
      .catch((err: any) => {
        if (err.code === 4001) {
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      }); 
      this.saveLogin(accounts[0]);
    }
  }
   saveLogin(address: string) {
    localStorage.setItem('userAddress',address);
  }
    deleteLogin() {
    localStorage.removeItem('userAddress');

  }
}
