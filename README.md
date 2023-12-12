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
  
    

