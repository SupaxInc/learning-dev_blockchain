import Web3 from "web3";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import ProviderEngine from "web3-provider-engine";
import RpcSubprovider from "web3-provider-engine/subproviders/rpc";

const contract_address = "0x48b6fc9b9b501ace88cc50e83011235d6a8373d0";
const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "gains",
				"type": "uint256"
			}
		],
		"name": "EndOfWrestlingEvent",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "registerAsAnOpponent",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "wrestler1",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "wrestler2",
				"type": "address"
			}
		],
		"name": "WrestlingStartsEvent",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "wrestle",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "wrestler1Deposit",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "wrestler2Deposit",
				"type": "uint256"
			}
		],
		"name": "EndOfRoundEvent",
		"type": "event"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "gameFinished",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "theWinner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "wrestler1",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "wrestler1Played",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "wrestler2",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "wrestler2Played",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

let my_web3;
let account;
let wrestler1;
let wrestler2;
let wrestler1Played;
let wrestler2Played;
const rpcUrl = "https://ropsten.infura.io";
let contract; 
window.addEventListener('load', () => {
    const use_ledger = location.search.indexOf("ledger=true") >= 0;
	
    if(use_ledger)
    {
      const engine = new ProviderEngine();
      const getTransport = () => TransportU2F.create();
      const ledger = createLedgerSubprovider(getTransport, {
        networkId: 3, // 3 == Ropsten testnet
      });
      engine.addProvider(ledger);
      engine.addProvider(new RpcSubprovider({ rpcUrl }));
      engine.start();
      my_web3 = new Web3(engine); 
      $('#mode').text("Ledger");
    } else if(typeof(web3) === 'undefined') {
      my_web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
      $('#mode').text("None");
    } else {
      my_web3 = new Web3(web3.currentProvider);    
      $('#mode').text("MetaMask");
    }
    contract = new my_web3.eth.Contract(abi, contract_address);
    my_web3.eth.getAccounts((error, result) => {
      if(error) {
        console.log(error);
      } else if(result.length == 0) {
        console.log("You are not logged in");
      } else {
		account = result[0];
		contract.options.from = account;	// the transactions should be made from the chosen account
		$('#account').text(account);
      }
    }).catch((error) => {
      console.log("Error: " + error);
	});
	
	contract.methods.wrestler1().call(function(error, result){	// resolve wrestler1 variable
		if(error){
			console.log(error);
		}
		wrestler1 = result;	
		$('#wrestler1').text(wrestler1);
	}).catch((error) => {
		console.log("Error: " + error);
	});

	contract.methods.wrestler2().call(function(error, result){	// resolve wrestler2 variable
		if(error){
			console.log(error);
		}
		wrestler2 = result;
		if(wrestler2 != null){		// checks if wrestler2 exists, if not show register button
			$('#wrestler2').text(wrestler2);
			document.getElementById('register').style.visibility = 'hidden';
		} else {
			$('#wrestler2').text("Please find a player to wrestle!");
			document.getElementById('register').style.visibility = 'visible';
		}
	}).catch((error) => {
		console.log("Error: " + error); 
	});

	contract.methods.wrestler1Played().call(function(error, result){
		if(error){
			console.log(error);
		}
		wrestler1Played = result;
		if(wrestler1Played == true) {		// check which account and hides Wrestle! button depending if 
			document.getElementById('wrestle_2').style.visibility = 'visible';
			document.getElementById('wrestle_1').style.visibility = 'hidden';
		}
	}).catch((error) => {
		console.log("Error: " + error);
	});

	contract.methods.wrestler2Played().call(function(error, result){
		if(error){
			console.log(error);
		}
		wrestler2Played = result;
		if(wrestler2Played == true) {		// check which account and hides Wrestle! button depending if 
			document.getElementById('wrestle_1').style.visibility = 'visible';
			document.getElementById('wrestle_2').style.visibility = 'hidden';
		}
	}).catch((error) => {
		console.log("Error: " + error);
	});


	$('#register').click(registerAsAnOpponent);
	$('#wrestle_1').click(wrestle);
	$('#wrestle_2').click(wrestle);
});
// variables initiated inside the promise is only initialized after the load event


function registerAsAnOpponent() {
	contract.methods.registerAsAnOpponent().send(
		{gasPrice: my_web3.utils.toWei("4.1", 'Gwei')},
		(error, result) => {
			if(error){
				return console.log(error);
			}
			console.log("Tx Hash: " + result);
		}
	).catch((error) => {
		console.log("Error: " + error);
	});
}

function wrestle() {		// fix this function
	let value1 = $('#deposit_1').val();
	let value2 = $('#deposit_2').val();

	if(account === wrestler1){
		contract.methods.wrestle().send(
			{from: account,
			gasPrice: my_web3.utils.toWei("4.1", 'Gwei'),
			value: my_web3.utils.toWei(value1, 'ether')},
			(error, result) => {
				if(error){
					return console.log(error);
				}
				console.log("Tx Hash: " + result);
			}
		).catch((error) => {
			console.log("Error: " + error);
		});
	} else {
		contract.methods.wrestle().send(
			{from: account,
			gasPrice: my_web3.utils.toWei("4.1", 'Gwei'),
			value: my_web3.utils.toWei(value2, 'ether')},
			(error, result) => {
				if(error){
					return console.log(error);
				}
				console.log("Tx Hash: " + result);
			}
		).catch((error) => {
			console.log("Error: " + error);
		});
	}
}