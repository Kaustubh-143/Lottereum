const Truffle =  require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const {abi,evm} = require('./compile')

const provider = new Truffle(
    'write east betray item appear grant stand sadness drum sunset alcohol document' ,
    'https://rinkeby.infura.io/v3/505983ddd1a34eb48edcd7b4b9177f91' , 
);

const web3 = new Web3(provider) ;

const deploy = async () => {

    const accounts = await web3.eth.getAccounts() ;

    console.log(`Attempting to deploy from ${accounts[0]}`)

    const lottery =await new web3.eth.Contract(abi)
    .deploy({data:evm.bytecode.object})
    .send({from:accounts[0],gas:'1000000'}) ;

    console.log(`Successfully deployed at ${lottery.options.address}`) ;
    console.log(JSON.stringify(abi)) ;
    provider.engine.stop() ;

}

deploy() ;