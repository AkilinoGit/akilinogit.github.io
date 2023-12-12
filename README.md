# <pre>             PRESTAMOS FACTORY<br>        DOCUMENTACION DEL DESARROLLO  
                     
## 1. ARCHIVOS DAPP:
## <pre>             SERVICIOS
  - [auth-service.service.ts](https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/auth-service.service.ts)<br>
      Control de Login y guardado de direcciones de OWNER Y CONTRACT FACTORY
  - [tx-service.service.ts](https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/tx-service.service.ts)<br>
      Servicio para automatizar la realización de transacciones<br> 
      Las funciones "contratoStateToString" y "secondsToDateString" deberían haberse guardado en
      un servicio "Utils" para evitar duplicado de código.

## <pre>             PAGINAS HTML Y TYPESCRIPT
Pagina inicial: redireccionamiento a pagina admin/user almacenamiento userAddress)
  - [home.page.html](https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/home/home.page.html)
  - [home.page.ts](https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/home/home.page.ts)

Los siguientes archivos se encargan de hacer las llamadas al SC y de recoger la información de la Red<br>

ADMIN
  - [admin.page.ts](https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/pages/admin/admin.page.ts)
  - [admin.page.html](https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/pages/admin/admin.page.html)
  - [admin.page.scss](https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/pages/admin/admin.page.scss)

USER
      
  - [user.page.ts](https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/pages/user/user.page.ts)
  - [user.page.html](https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/pages/user/user.page.html)

## 2. SMART CONTRACTS:
[PRESTAMOS_FACTORY.sol](https://github.com/AkilinoGit/akilinogit.github.io/blob/master/truffle/contracts/PRESTAMOS_FACTORY.sol)
<pre>  SafeMath.sol Ha sido importado manualmente ya que npm install no descarga este contrato (Facil acceso en REMIX)</pre>
<pre>  Se ha utilizado truffle para la compilación de contratos y tener a a mano los ABI de los contratos 
## <pre>             CONTRACT FACTORY  
Contrato encargado de generar contratos del tipo "Prestamos Curando" de asignarlos con un cliente y administrarlos

La manera de eliminiar un contrato es mandandolo al final del array de contratos y hacer "POP" es óptimo pero al final he
descubierto una posible brecha a la hora de cambiar el index del contrato en el Contrato hijo.


## <pre>             PRESTAMO EN CURSO
Brecha de seguridad en el método setIndex() ya que su proteccion es un require(msg.sender = DIRECCION_FACTORY) 
La cual se puede simular con un delegateCall() al  CONTRACT_FACTORY.
Pudiendo sobrescribir el indice de un conrato sobre otro y hacerlo "invisible".

En general se han intentado mantener buenas prácticas en la definición del contrato 
como registrar la información de la transacción antes de la transferencia de unidades 
o evitar alto consumo de gas dividiendo el trabajo con la DApp.
    

