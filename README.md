# <pre>             PRESTAMOS FACTORY<br>        DOCUMENTACION DEL DESARROLLO  
                     
## 1. ARCHIVOS DAPP:
##<pre>             SERVICIOS
  - https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/auth-service.service.ts<br>
      Control de Login y guardado de direcciones de OWNER Y CONTRACT FACTORY
  - https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/tx-service.service.ts<br>
      Servicio para automatizar la realización de transacciones
#### Las funciones "contratoStateToString" y "secondsToDateString" deberían haberse guardado en un servicio "Utils" para evitar duplicado de código.

##<pre>             PAGINAS HTML Y TYPESCRIPT
  - https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/home/home.page.html
  - https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/home/home.page.ts
      Pagina inicial: redireccionamiento a pagina admin/user almacenamiento userAddress
    
  - https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/pages/admin/admin.page.ts
  - https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/pages/admin/admin.page.html
  - https://github.com/AkilinoGit/akilinogit.github.io/blob/master/src/app/pages/admin/admin.page.scss
      Llamadas a funciones del Smart Contract, inicializa recogiendo la información de los contratos cursando
      en la Red
  
    
