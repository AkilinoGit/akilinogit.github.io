import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/auth-service.service';
import { TxServiceService } from 'src/app/tx-service.service';
import Web3 from 'web3';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ABI as FACTORYABI} from 'src/app/abiFactory';
import {ABI as PRESTAMOCURSANDO} from 'src/app/abiPrestamos';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage  {

  web3: any;
  window:any;

  factoryContract: any;
  admin: any;
  balance: any;

  //Direcciones con préstamos en la plataforma
  clientes: any;
  //Relaciona una dirección cliente con sus la información de sus préstamos contratados
  prestamosCursando: { [key: string]: any[] } = {};

  definirForm: any;
  invertirForm: any;
  recogerForm: any;
 

 


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
      cuotas: "3",
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
    //Evita que un usario sin acceso de administrador entre en la web de admin
    if (localStorage.getItem('userAddress') !== this.authService.OWNER) {
      this.window.location.href = "/home";
    } 
  

    this.balance = await this.factoryContract.methods.getBalance().call({ from: localStorage.getItem('userAddress')});
    this.clientes = await this.factoryContract.methods.getClientes().call({ from: localStorage.getItem('userAddress')});
    await this.iniciarVistaContratados();
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

  //
  async iniciarVistaContratados(){

    this.clientes.forEach(async (clientAddress:any) => {
      var direccionesCursando =  await this.factoryContract.methods.verContratos(clientAddress)
        .call({ from: localStorage.getItem('userAddress')});
      var prestamosUsuario : any[] = [];
      direccionesCursando.forEach(async (direccionCursando: any) => {
        var contratoCursando = await new this.web3.eth.Contract(PRESTAMOCURSANDO.abi, direccionCursando);
        var contratado =  await contratoCursando.methods.mostrarInfo().call();
        contratado._ultimoCheckeo = this.secondsToDateString(contratado._ultimoCheckeo);
        prestamosUsuario.push(contratado); 
        console.log(prestamosUsuario);
      })

      this.prestamosCursando[clientAddress]=prestamosUsuario;

    });
  }

// Control del estado de pago de cada préstamo, en el SC el plazo de "mes" está simulado por unos segundos
 async  checkeoMensual(){
  this.clientes.forEach(async (cliente: any) => {
    this.prestamosCursando[cliente].forEach(async (prestamo:any) => {
      var prestamoCursando = await new this.web3.eth.Contract(PRESTAMOCURSANDO.abi, prestamo._direccion);
      var method = prestamoCursando.methods.checkeoMensual().encodeABI();
      this.txService.makeTransaction(prestamo._direccion,0,method);
    });

  });
  
  }
  
//Crea un nuevo tipo de préstamo para ser contratado
  definirPrestamo( sendData: any){
   var method = this.factoryContract.methods.definirPrestamo(sendData.porcentajeInteres,
              sendData.cantidad, sendData.cuotas, sendData.penalizacionImpago).encodeABI();
  
    this.txService.makeTransaction(this.authService.FACTORY,0,method);
  }

  //Traduce los segundos de block.timeStamp a un String con la fecha de cierre del plazo de pago
  secondsToDateString(big: BigInt){
    var stringNum = big.toString();
  
    var numberNum = Number(stringNum) * 1000;
    
    var nextCheckDate= new Date(numberNum);
    nextCheckDate.setMonth(nextCheckDate.getMonth() + 1);
    
    var nextCheckString = nextCheckDate.getDay()+ '/'+ (nextCheckDate.getMonth() + 1 )+'/'+ nextCheckDate.getFullYear();
    return nextCheckString;
   
  }
  
 logOut(){
    this.authService.deleteLogin;
    window.location.href = `/home`;
     
  }

}
