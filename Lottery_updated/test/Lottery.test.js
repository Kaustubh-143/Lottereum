const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3') ;

const {abi,evm} = require('../compile');

const web3 = new Web3(ganache.provider());

let accounts;
let lottery;

beforeEach(async () => {
     accounts = await web3.eth.getAccounts() ;
    
     lottery = await new web3.eth.Contract(abi)
    .deploy({data:evm.bytecode.object})
    .send({from:accounts[0] , gas :'1000000'}) ;
}) ;

describe('Testing Contract' , () => {
     it('isDeployed on the network' , () => {
         assert.ok(lottery.options.address) ;
     })

     it('checking manager', async () => {
         const man = await lottery.methods.manager().call() ;
         assert.equal(accounts[0],man);
      })

      it('one player is entering the lottery' , async () => {
          await lottery.methods.enter().send({
              from:accounts[0],
              value:web3.utils.toWei('0.2','ether') ,
          })

          const playerss = await lottery.methods.getPlayers().call() ;
          assert.equal(accounts[0],playerss[0]) ;
          assert.equal(1,playerss.length) ;
      })

      it('multiple players are entering the lottery' , async () => {
        await lottery.methods.enter().send({
            from:accounts[0],
            value:web3.utils.toWei('0.2','ether') ,
        })

        await lottery.methods.enter().send({
            from:accounts[1],
            value:web3.utils.toWei('0.2','ether') ,
        })

        const playerss = await lottery.methods.getPlayers().call() ;
        assert.equal(accounts[0],playerss[0]) ;
        assert.equal(accounts[1],playerss[1]) ;
        assert.equal(2,playerss.length) ;
    })

    it('picking up the winner', async () => {
        await lottery.methods.enter().send({
            from:accounts[0],
            value:web3.utils.toWei('2','ether') ,
        })

        const initialBalance = await web3.eth.getBalance(accounts[0]) ;

        await lottery.methods.pickWinner().send({
            from :accounts[0],
            gas:'1000000',
        })

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;
    
        assert(difference>web3.utils.toWei('1.8','ether')) ;

        const array =await lottery.methods.getPlayers().call() ;
        assert.equal(0,array.length) ;

        const balance = await lottery.methods.getBalance().call() ;
        assert.equal(0,balance);
    })


})