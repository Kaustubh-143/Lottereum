import logo from './logo.svg';
import './App.css';
import web3 from './web3'
import lottery from './lottery'
import {useState,useEffect} from 'react'

function App() {

  const [players, setPlayers] = useState(0) ;
  const [balance,setBalance] = useState(0) ;
  const [manager,setManager] = useState('') ;
  const [value,setValue] = useState('');
  const [message,setMessage] = useState('');
  const [winMessage,setWinMessage] = useState('');

  useEffect(() =>{
    const fetchPlayers = async () => {
        const playerss = await lottery.methods.getPlayers().call() ;
        setPlayers(playerss.length);
    }

    const fetchBalance = async () => {
      const bal = await lottery.methods.getBalance().call() ;
      const inEther = web3.utils.fromWei(bal,'ether') ;
      setBalance(inEther);
    }

    const fetchManager = async () => {
         const man = await lottery.methods.manager().call() ;
         setManager(man) ;
    }

    fetchPlayers();
    fetchBalance();
    fetchManager();

  },[])

  const onSubmit = async (event) => {
    event.preventDefault() ;

    setMessage('Waiting for the transaction to get confirmed ') ;
    const accounts = await web3.eth.getAccounts() ;

    await lottery.methods.enter().send({from : accounts[0], value:web3.utils.toWei(value,'ether')});

    setMessage('Kudos! You have entered the lottery') ;
    
  }

  const pickW = async () => {
    const accounts = await web3.eth.getAccounts() ;

    setWinMessage('We are picking a winner') ;


    await lottery.methods.pickWinner().send({from:accounts[0]}); 

    setWinMessage('Winner has been picked!') ;
  }

  return (
    <div style={{backgroundColor:'black'}}>
   <div style={{height:750,display:'flex',flexDirection:'column',justifyContent: 'center',alignItems: 'center'}}>
     <h2 style={{color:'white'}}>Wanna get lucky? Enter into the lottery !!</h2>
     <h4 style={{color:'white'}}>This contract is managed by {manager}</h4>
     <h4 style={{color:'white'}}>{players} player(s) are competing to win {balance} ether</h4>
     
     <form onSubmit={onSubmit}>
       <div style={{backgroundColor:'#A32CC4',borderRadius:10,borderColor:'#A32CC4',borderWidth:5,padding:10,width:250,marginLeft:55}}>
       <label style={{color:'white',fontWeight:'bold',padding:60}}>Enter the lottery </label>
       </div>
       <br/>
       <input style={{borderRadius:15,height:29,width:230,fontWeight:'bold'}} placeholder='Enter the amount of ether' value={value} onChange = {event => setValue(event.target.value)} />
       <button style={{backgroundColor:'#A32CC4',borderRadius:20,padding:9,fontWeight:'bold',borderColor:'#A32CC4',borderWidth:3,marginLeft:10}}>I wanna enter !</button>
     </form>
     <h3 style={{color:'white'}}>{message}</h3>
  
     
     <button style={{backgroundColor:'#A32CC4',borderRadius:20,fontWeight:'bold',borderColor:'#A32CC4',borderWidth:3,marginTop:20,height:50}} onClick={pickW}>
       <h3 style={{color:'white'}}>Pick a Winner !</h3>
     </button>
     <h3 style={{color:'white'}}>{winMessage}</h3>
   </div>
   </div>

  );
}

export default App;
