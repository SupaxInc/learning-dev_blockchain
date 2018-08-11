import Web3 from "web3";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import ProviderEngine from "web3-provider-engine";
import RpcSubprovider from "web3-provider-engine/subproviders/rpc";

const contract_address = "0x033C341Edea44FDE85BCb114A632E2A2c8E19C4E";
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
		"name": "registerWrestler1",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "registerWrestler2",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "resetGame",
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
		"name": "gains",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
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
		"name": "hasWinnerWithdrawn",
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
		"name": "wrestler1Deposit",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
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
		"name": "wrestler2Deposit",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
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
let wrestler1Deposit;
let wrestler2Deposit;
let gains;
let theWinner;
let gameFinished;
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
	
	contract.methods.wrestler1Deposit().call(function(error, result){
		if(error){
			console.log(error);
		}
		wrestler1Deposit = result;
		$('#wrestler1_deposit').text(result);

	}).catch((error) => {
		console.log("Error: " + error);
	});

	contract.methods.wrestler2Deposit().call(function(error, result){
		if(error){
			console.log(error);
		}
		wrestler2Deposit = result;
		$('#wrestler2_deposit').text(result);
		
	}).catch((error) => {
		console.log("Error: " + error);
	});

	contract.methods.theWinner().call(function(error, result){
		if(error){
			console.log(error);
		}
		theWinner = result;
		$('#winner').text(result);

	}).catch((error) => {
		console.log("Error: "+ error);
	})

	contract.methods.gains().call(function(error, result){
		if(error){
			console.log(error);
		}
		gains = result;
		$('#gains').text(result);

	}).catch((error) => {
		console.log("Error: "+ error);
	})

	contract.methods.wrestler1().call(function(error, result){	// resolve wrestler1 variable
		if(error){
			console.log(error);
		}
		wrestler1 = result;	
		if(wrestler1 != 0x0){		// checks if wrestler2 exists, if not show register button
			$('#wrestler1').text(wrestler1);
			document.getElementById('register_1').style.visibility = 'hidden';
		} else {
			$('#wrestler1').text("Waiting for a player...");
			document.getElementById('register_1').style.visibility = 'visible';
		}

	}).catch((error) => {
		console.log("Error: " + error);
	});

	contract.methods.wrestler2().call(function(error, result){	// resolve wrestler2 variable
		if(error){
			console.log(error);
		}
		wrestler2 = result;
		if(wrestler2 != 0x0){		// checks if wrestler2 exists, if not show register button
			$('#wrestler2').text(wrestler2);
			document.getElementById('register_2').style.visibility = 'hidden';
		} else {
			$('#wrestler2').text("Waiting for a player...");
			document.getElementById('register_2').style.visibility = 'visible';
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
		} else {
			document.getElementById('wrestle_1').style.visibility = 'visible';
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
		} else {
			document.getElementById('wrestle_2').style.visibility = 'visible';
		}
	}).catch((error) => {
		console.log("Error: " + error);
	});




	// DEBUGGING PURPOSES
	// my_web3.eth.getStorageAt(contract_address, 2).then(console.log);
	// my_web3.eth.getStorageAt(contract_address, 3).then(console.log);
	// my_web3.eth.getStorageAt(contract_address, 6).then(console.log);
	// my_web3.eth.getStorageAt(contract_address, 7).then(console.log);
	// my_web3.eth.getStorageAt(contract_address, 8).then(console.log);
	
	$('#register_1').click(registerWrestler1);
	$('#register_2').click(registerWrestler2);
	$('#wrestle_1').click(wrestle);
	$('#wrestle_2').click(wrestle);
	$('#withdraw_1').click(withdraw);
	$('#withdraw_2').click(withdraw);
});
// variables initiated inside the promise is only initialized after the load event


function registerWrestler1() {
	contract.methods.registerWrestler1().send(
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

function registerWrestler2() {
	contract.methods.registerWrestler2().send(
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

function withdraw() {
	contract.methods.withdraw().send(
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

function checkWinner() {

}