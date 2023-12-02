// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

contract PrestamosFactory {

    //ENTRE ELEGIR MAPPING Y ARRAY SE TIENE QUE DECIDIR EN TIEMPOR DE EJECUION SEGUN COSTE O POSIBLIDAD DE EXCEDER LÍMITE DE TIEMPO
    //(COMENTAR EN ALGÚN LADO Y ELEGIR CUALQUIERA)

    address payable private owner;
    TipoContrato[] tiposContrato;

    mapping(address => PrestamoCursando[]) public prestamosCursando;
    address[] clientes;

    struct TipoContrato {
        uint256 index;
        uint8 porcentajeInteres; 
        uint256 cantidad; 
        uint256 deudaTotal;
        uint8 cuotas;
        uint8 penalizacionImpago;
    }
    
    event PrestamoDefinido(TipoContrato tipoContrato);
    event NuevoPrestamoCursando(address indexed direccionContrato, address indexed prestatario);
    event FondosRecibidos(address direccion,uint256 cantidad);

    modifier onlyOwner() {
        require(owner == msg.sender,"Only Owner");
         _;
    }
    
    constructor(){
        owner = payable(msg.sender);
    }

    receive() external payable {
        invertir();
    }

    function invertir() public payable {
        emit FondosRecibidos(msg.sender, msg.value);
    }

    function recolectarFondos(uint256 amount) public  onlyOwner {
        require(address(this).balance >= amount);
        owner.transfer(amount);

    }

    function verTiposContrato() public view returns (TipoContrato[] memory) {
        return tiposContrato;
    }


    function verContratos(address _prestatario) public view returns (PrestamoCursando[] memory){
        require((msg.sender == owner)||(msg.sender == _prestatario), "Top Secret");
        return (prestamosCursando[_prestatario]);
    }


    function definirPrestamo(uint8 _porcentajeInteres, uint256 _cantidad, uint8 _cuotas, uint8 _penalizacionImpago) public onlyOwner {

        require(_penalizacionImpago >= 0 && _penalizacionImpago <= 100, "La penalizacion tiene que ser un porcentaje");
        require(_porcentajeInteres >= 0 && _porcentajeInteres <= 100, "El interes tiene que ser un porcentaje");


        uint256 _deudaTotal = _cantidad * (_porcentajeInteres / 100);

        TipoContrato memory nuevoPrestamo = TipoContrato({
            index: 0 ,
            porcentajeInteres: _porcentajeInteres,
            cantidad: _cantidad,
            deudaTotal: _deudaTotal,
            cuotas: _cuotas,
            penalizacionImpago: _penalizacionImpago
        });

        tiposContrato.push(nuevoPrestamo);
        //Guardo el index dentro del Objeto préstamo para mayor facilidad de acceso desde web3
        tiposContrato[tiposContrato.length - 1].index = tiposContrato.length-1;
        emit PrestamoDefinido(nuevoPrestamo);
    
    }



   
    function contratarPrestamo(address payable _prestatario, uint8 indexTipoContrato) public {

        require(msg.sender == _prestatario, "No se puede contratar en nombre de otros");

        TipoContrato memory tipoPrestamo = tiposContrato[indexTipoContrato];
        require(address(this).balance >= tipoPrestamo.cantidad,"Prestamo no disponible");

        //Compruebo si la cuenta tiene otro conrtrato contratado
        if(prestamosCursando[_prestatario].length == 0){
            clientes.push(_prestatario);
        }
        //Guardo index para faciltar acceso
        uint256 _indexNuevoPrestamo = prestamosCursando[_prestatario].length;
        PrestamoCursando newPrestamo = new PrestamoCursando(_indexNuevoPrestamo, _prestatario, owner, tipoPrestamo.cuotas, tipoPrestamo.cantidad,
                                                            tipoPrestamo.deudaTotal, tipoPrestamo.penalizacionImpago);

        //Enviar dinero a usuario
        emit NuevoPrestamoCursando(address(newPrestamo), _prestatario);                                                
        prestamosCursando[_prestatario].push(newPrestamo);
        _prestatario.transfer(tipoPrestamo.cantidad);

    }

    function  eliminarPrestamoFinalizado(address user, address _finalizado, uint index) external {
        require(msg.sender == _finalizado, "Los contratos se autoeliminan una vez finalizados");
        //Se copia el ultimo elemento del array y se le cambia el índice
        prestamosCursando[user][index] = prestamosCursando[user][prestamosCursando[user].length - 1];
        prestamosCursando[user][index].setIndex(index);
        //Se elimina el elemento copiado
        prestamosCursando[user].pop();

        //En caso de que el cliente deje de tener contratos con nostros le eliminamos de la lista de clientes
        if( prestamosCursando[user].length == 0){
            for(uint i = 0 ; i < clientes.length; i ++ ) {
                if (clientes[i] == user) {
                    clientes[i] = clientes[clientes.length - 1];
                    break;
                }
            }
            clientes.pop();
        }

    }
    
    }

contract PrestamoCursando {

    uint index;
    enum State { PAGADO, ABIERTO, FINALIZADO }
    State state;
    address prestatario;
    address entidadFinanciera;
    address payable prestamosFactory;
    uint8 cuotasRestantes;
    uint256 cantidadPrestada;
    uint256 deudaRestante;
    uint256 cuotaMensual;
    uint8 penalizacion;
    uint256 ultimoCheckeo;

    //2592000000 = 1 MES;
    uint256 public constant PLAZO = 30000;

    modifier onlyFinancialEntity() {
        require(entidadFinanciera == msg.sender,"Only financial entity");
         _;
    }
    
    modifier onlyContractFactory() {
        require(prestamosFactory == msg.sender,"Only contract Factory");
         _;
    }

    modifier hasBeenOneMonth() {
        require(block.timestamp - ultimoCheckeo >= PLAZO );
        _;
    }

    constructor(uint256 _index, address _prestatario, address _entidad, uint8 _cuotasRestantes, uint256 _cantidad, uint256 _deudaTotal, uint8 _penalizacion){
        index = _index;
        state = State.ABIERTO;
        prestatario = _prestatario;
        entidadFinanciera = _entidad;
        prestamosFactory = payable(msg.sender);
        cuotasRestantes = _cuotasRestantes;
        cantidadPrestada = _cantidad;
        deudaRestante = _deudaTotal;
        penalizacion = _penalizacion;
        cuotaMensual = calculoCuotaMensual();
        ultimoCheckeo = block.timestamp;
    }

    function setIndex(uint _index) external onlyContractFactory {
        index = _index;
    }

    function calculoCuotaMensual() private view returns (uint256){
        return deudaRestante / cuotasRestantes;
    }

    function checkeoMensual() onlyFinancialEntity hasBeenOneMonth public {
        
        if(state == State.ABIERTO){
            penalizarPrestamo();
        }
        else if(state == State.PAGADO){
            state = State.ABIERTO;
        }
        else if (state == State.FINALIZADO){
            eliminarContratoFinalizado();
        }
    }

    function eliminarContratoFinalizado() private {
        PrestamosFactory(prestamosFactory).eliminarPrestamoFinalizado(prestatario, address(this), index); 
    }

    //Numero de cuotas se mantiene
    function penalizarPrestamo() private {
        deudaRestante += deudaRestante * penalizacion / 100; 
        cuotaMensual = calculoCuotaMensual();
    }

    receive() external payable {
        pagarMensualidad();
    }

    function pagarMensualidad() payable public {
        require(msg.sender == prestatario, "Only borrower");
        require(msg.value == cuotaMensual, "Send exact debt value");
        require(state == State.ABIERTO, "Payment period not open");
        if(cuotasRestantes == 0){
            state = State.FINALIZADO;
        }
        else {
            state = State.PAGADO;
            deudaRestante -= cuotaMensual;
        }
        transferirFondosAFactory(cuotaMensual);
    }

    //Por seguridad se pone a public para evitar fondos bloqueados en este contrato.
    function transferirFondosAFactory(uint256 _amount) public {
        prestamosFactory.transfer(_amount);
    }
    


}