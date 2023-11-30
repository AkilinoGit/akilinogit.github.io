import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  //public OWNER: string = "0x1b9eA650e1C945aEE3b822592333FBe303111BbC";
  public OWNER: string = "0x1b9ea650e1c945aee3b822592333fbe303111bbc";
  public FACTORY = "0x3F26d7fD26bb4B09AF783F7Cf72079eca97a1b47";
  public PROVIDER = "http://localhost:8545";
  public ABI_FACTORY_PATH = "src/assets/abi/abiFactory.ts"

  window:any;
  public isAuthenticated = false;
  public userAddress: string | null = null;

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
      
      
    this.userAddress = accounts[0];
   
  
  }




    /*
    if (this.window.ethereum) {
      try {
        // Petición de acceso de Metamask
        await this.window.ethereum.request({ method: 'eth_requestAccounts' });

        // Obtener dirección de metamask
        const accounts = await this.window.ethereum.request({ method: 'eth_accounts' });
        this.userAddress = accounts[0];
        this.login(this.userAddress);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('MetaMask not detected. Please install MetaMask.');
    }
    
  }
  */
}
  login(address: string | null) {
    this.isAuthenticated = true;
    this.userAddress = address;
  }

  logout() {
    this.isAuthenticated = false;
    this.userAddress = null;

  }
}
