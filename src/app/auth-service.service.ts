import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {

  public OWNER: string = "0x46ccd6c01296f9aa02a161b92b007e9ae7675e97"; //aki
  //public OWNER: string = "0x2dcb591e1591efe2439b589f3c80ccb925ead312";
  //public FACTORY = "0x4E7a1dfA4c53Fc573529Ad3Ee93591A753105859";
  public FACTORY = "0x6b25068e404f6f823f5e2be382860439b1cfac6d";
  //public PROVIDER = "http://localhost:8545";
  public PROVIDER = "https://sepolia.infura.io/v3/d09825f256ae4705a74fdee006040903";
  window:any;

  constructor(@Inject(DOCUMENT)private document: Document) {
    this.window = document.defaultView;
  }


async  loginMetamask(){
  
    if (typeof this.window.ethereum !== 'undefined') {
      const accounts = await this.window.ethereum.request({ method: 'eth_requestAccounts' })
      .catch((err: any) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
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
