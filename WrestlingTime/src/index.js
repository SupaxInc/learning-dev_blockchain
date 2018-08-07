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
        contract.options.from = account;
      }
    }).catch((error) => {
      console.log("Error: " + error);
    });
});