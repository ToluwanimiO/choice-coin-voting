
import './App.css';
import logo from './assets/logo2.png'
import welcome from './assets/bgwelcome.jpg'
import MyAlgoConnect from '@randlabs/myalgo-connect';
// import algosdk from "algosdk"; 
const myAlgoWallet = new MyAlgoConnect();

async function connectToMyAlgo() {
  // This function connects the voters wallet to my program, it brings up a pop up used to connect user's wallet
  try {
    const accounts = await myAlgoWallet.connect();
    const addresses = accounts.map(account => account.address);
    window.acc = accounts
    // if addresses is not empty, it returns true and displays the voting div and takes away the welcome image
    if (addresses)
    {
      var element = document.getElementById("welcome");
      element.classList.add("d-none");
      var element2 = document.getElementById("wallet");
      element2.classList.remove("d-none");
      var element2 = document.getElementById("success");
      element2.classList.add("d-none");   
      // focuses on the input automatically
      document.getElementById("amount").focus();
    }
    
  // in case of an error in connection
  } catch (err) {
    console.error(err);
  }
  
}
function App() {
  // returns what is displayed for the user to see
  return (
    <div className="">
      <nav className="navbar navbar-light bg-white justify-content-between pl-5 pr-5 shadow-sm">
        
        <a href='/' className="navbar-brand d-block d-md-none"><img alt="text" src={logo} width="auto" height="50px"/></a>
        <a href='/' className="navbar-brand d-none d-md-block"><img alt="text" src={logo} width="auto" height="50px"/> &nbsp;Choice Coin Voting</a>
        
        <button id="connectBtn" className="btn btn-lg btn-outline-primary my-2 my-sm-0" onClick={connectToMyAlgo}>Connect Wallet</button>
        
    </nav>
      <div className="card marginFix shadow-sm">
        <img alt="text" id="welcome" src={welcome} width="100%" height="100%"/>
        
        
        <div id="wallet" className="card-body d-none padIssue p-3">
            <p>Issue Number: <span style={{fontWeight: "100"}}>AQUJDI4DJH68</span></p>
            <input type="text" className="form-control lengthen" disabled value="Statement of Issue to be voted on:" />
            <span>Amount</span>
            <input id="amount" type="number" className="form-control" placeholder='Input choice Amount'/>
            <div className="row text-center mt-3">
                <div className="col-6">
                    <p>Yes&nbsp;<input type="radio" id="yes" name="choice"/></p>
                </div>
                <div className="col-6">
                    <p>No&nbsp;<input type="radio" id="no" name="choice"/></p>
                </div>
                <small id="err" className="alert alert-danger mx-auto d-none"> </small>
            </div>
            <div className="text-center mt-3">
                <button onClick={vote} className="btn btn-lg btn-primary btn-color-blue">Submit</button>
            </div>
        </div>
        <div id="success" className="card-body text-center p-3 d-none" style={{height: "25em"}}>
            <div className="text-center centerSuccess">
                <i className="fa fa-check fa-5x text-success"></i><br/>
                <p className="text-success "><b>Succesfully Voted </b></p>
                <i id="result"></i>
            </div>
        </div>
        
      </div>
    </div>
  );
}

function vote()
{
  // used for voting
    var amount = document.getElementById("amount").value
    // prevents user for voting if amount is empty
    if(amount == "")
    {
        var error = document.getElementById("err");
        error.classList.remove("d-none")
        error.innerHTML = "Enter an amount"
    }
    else
    {
        // if user picks yes, the coin is sent to the zero address
        var result = document.getElementById("result");
        if (document.getElementById("yes").checked)
        {
            const zero_address = ''
            let txn = {
              fee: 1000,
              type: 'pay',
              from: window.acc[0].address,
              to:  zero_address,
              amount: 1000000, // 1 algo
              firstRound: 12449335,
              lastRound: 12450335,
              genesisHash: "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
              genesisID: "testnet-v1.0"
          };
                  
          result.innerHTML = amount+" choice coin sent to zero address"
          var element = document.getElementById("wallet");
          element.classList.add("d-none");
          var element2 = document.getElementById("success");
          element2.classList.remove("d-none");  
          myAlgoWallet.signTransaction(txn)
          .then((signedTxn) => {
            // after  succesfully signing, the coin can be sent, then the success messsage is displayed
              console.log(signedTxn);
              
                  
          })
          .catch((err) => {
              // I keep getting an error: ReferenceError: Buffer is not defined at MyAlgoConnect.signTransaction
              // this is caused by webpack 5 as webpack 5 does not parse Buffer type, using webpack4 should fix it
              console.log(err)  
            });
        }
        else if(document.getElementById("no").checked)
        {
          // if user picks no, the coin is sent to the one address
          const one_address = ''
            let txn = {
              fee: 1000,
              type: 'pay',
              from: window.acc[0].address,
              to:  one_address,
              amount: 1000000, // 1 algo
              firstRound: 12449335,
              lastRound: 12450335,
              genesisHash: "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
              genesisID: "testnet-v1.0"
          };
          
          result.innerHTML = amount+" choice coin sent to one address"
          var element = document.getElementById("wallet");
          element.classList.add("d-none");
          var element2 = document.getElementById("success");
          element2.classList.remove("d-none");   
          myAlgoWallet.signTransaction(txn)
          .then((signedTxn) => {
            // after  succesfully signing, the coin can be sent, then the success messsage is displayed
            console.log(signedTxn);
                  
          })
          .catch((err) => {
              // I keep getting an error: ReferenceError: Buffer is not defined at MyAlgoConnect.signTransaction
              // this is caused by webpack 5 as webpack 5 does not parse Buffer type, using webpack4 should fix it
              console.log(err)  
            });
             
        }
        else{
          // ensure user picks either yes or no
            var error = document.getElementById("err");
            error.classList.remove("d-none")
            error.innerHTML = "Pick either YES or NO to vote"
        }
    }
            
            
}
export default App;
