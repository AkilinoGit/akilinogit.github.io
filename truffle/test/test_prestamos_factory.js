import Web3 from 'web3';
const assert = require('assert');
const ganache = require('ganache-cli');

const web3 = new Web3(ganache.provider());
const prestamosFactory = require ('../build/contracts/PrestamosFactory.json');



describe('Prestamos factory test', () => {

    before( async() => {  
        accounts = await web3.eth.getAccounts();
        console.log(accounts);
        /*factory = await new web3.eth.Contract(prestamosFactory.abi)
            .deploy({data: prestamosFactory.evm.bytecode.object})
            .send({ from: accounts[0], gas: 50000000 });
        
        console.log('contract address:'+ factory.options.address);
        console.log(accounts[0]);
        */
        
    } );

    it('deploys a contract', () => {
		console.log('Contract address: '+ factory.options.address);
		assert.ok(factory.options.address); 
		
	});
});
