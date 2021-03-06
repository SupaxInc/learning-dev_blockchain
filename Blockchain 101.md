# Blockchain 101

## **Table of Content**

[TOC]

## Ethereum Development

### What Are Smart Contracts in Ethereum?

Smart contracts are scripts that handle money. It is a code that executes when conditions are met which will either refund the money or send the money.  The contracts are enforced and certified by parties called **miners**. 

**Miners** are multiple computers who add the transaction (eg. payment of a cryptocurrency) to a public ledger called a **block**. Multiple blocks make up a blockchain. The miners are paid using **Gas**, which is the cost to run a contract or in other words called **gwei**. 



#### Development of a Smart Contract

We will be exploring how to create smart contracts while taking **security** as a consideration.

The language will be based on Solidity which is very similar to **Javascript**. 

##### **Example: Wrestling Time using Solidity**

```javascript
pragma solidity ^0.4.18;	// need this line to initiate the version of 								solidity

contract Wrestling {	// how to start creating the smart contract
    
    // variables that hold the address of two people
    address public wrestler1;
    address public wrestler2; 
    
    // the two people will be able to put in a sum of money each round
    bool public wrestler1Played;
    bool public wrestler2Played;
    
    // private variables could only be accessed inside the contract
    uint private wrestler1Deposit;	// defaults to uint256
    uint private wrestler2Deposit;	// defaults to uint256
    
    bool public gameFinished;
    
    address public theWinner;
    uint gains;
    
    // We will be creating three events for every step of the game.
    // First event, when the wrestlers register for the match.
    event WrestlingStartsEvent(address wrestler1, address wrestler2);
    // Second event, during the event of the match, after each round.
    event EndOfRoundEvent(uint wrestler1Deposit, uint wrestler2Deposit);
    // Third event, the end of the event when a wrestler wins.
    event EndOfWrestlingEvent(address winner, uint gains);
    
    // This is a constructor for a contract, will be called when the contract 		is created.
	function Wrestling() public {
    	wrestler1 = msg.sender;	// msg.sender returns the address of who 									invokes the function
	}
    
    // We will now create a function to register the opponent.
    function registerAsAnOpponent() public {
        // require function will check,
        // if wrestler2 does not already have an address, we will proceed.
        // else it refuses new registrations
        require(wrestler2 == address(0));	// address(0) means 0x000....
        wrestler2 = msg.sender;
        // We start the end when both wrestlers are registered.
        WrestlingStartsEvent(wrestler1, wrestler2);
    }
    
    // We will now make every wrestler be able to call the function 			  wrestle()
    function wrestle() public payable {
        // checks if the game is not finished,
        // and checks if the address of the sender is either wrestler1 or 2
        require(!gameFinished && (msg.sender == wrestler1 || msg.sender == 		    													wrestler2));
        if(msg.sender == wrestler1){
            // checks if wrestler1 has already played, if not continue.
            require(wrestler1Played == false);
            wrestler1Played = true;
            
            // adds the deposit of Ether sent to the function to wrestler1
            wrestler1Deposit = wrestler1Deposit + msg.value;
        }else{
            require(wrestler2Played == false);
            wrestler2Played = true;
            wrestler2Deposit = wrestler2Deposit + msg.value;
        }
        
        // if both wrestlers has already played
        if(wrestler1Played && wrestler2Played){
            if(wrestler1Deposit >= wrestler2Deposit * 2) {
                endOfGame(wrestler1);
            } else if (wrestler2Deposit >= wrestler1Deposit * 2) {
                endOfGame(wrestler2);
            } else {
                endOfRound();
            }
        }
    }
    
    function endOfRound() internal {
        wrestler1Played = false;
        wrestler2Played = false;
        EndOfRound(wrestler1Deposit, wrestler2Deposit);
    }
    
    function endOfGame(address winner) internal {
        gameFinished = true;
        theWinner = winner;
        // the winner gains will be calculated but is not sent right away.
        gains = wrestler1Deposit + wrestler2Deposit;
        EndOfWrestlingEvent(winner, gains);	
    }
    
    function withdraw() public {
        // if game has finished and the address who called the function is 			  the winner
        require(gameFinished && theWinner == msg.sender);
        uint amount = gains;

        gains = 0;	// make sure to re-initialize the amount of ether to be 				   	  rewarded back to zero.
        
        // transfers the amount to the address 
        // that has invoked the withdraw function.
        msg.sender.transfer(amount);	
    }
}

```





##### Variables

###### Private Keyword

**Private** keywords, a private variable does not mean that no one could view the content inside it. All it means is that could only be accessed within that **Contract**. 

**Important security measure** must be taken place when using variables since the whole information is stored within the blockchain, every computer will be able to see this content. 

```javascript
uint private wrestler1Deposit;
uint private wrestler2Deposit;
```

**eg.** The player deposits could only be accessed by the **Wrestler** contract. 



###### Public Keyword

**Public** keywords make it possible for other classes (Contracts) or users to change the values of the public variable. The compiler **automatically creates a getter function for public variables.**

To be able to change the value of the public variable, a setter function must be created. 



###### Event Keyword

**Event** keywords are used for debugging purposes for development. They are call backs in the user interface when a developer is creating a dapp. Could also be known as a console.log() function compared to Javascript.

```javascript
event WrestlingStartsEvent(address wrestler1, address wrestler2);
event EndOfRoundEvent(uint wrestler1Deposit, uint wrestler2Deposit);
event EndOfWrestlingEvent(address winner, uint gains);
```

**eg.** Three events that are used to debug the match during development of the wrestling match.



###### Payable Keyword

Payable keywords are used to make the function be able to receive money (cryptocurrency), if this keyword is not set to the function then it will not be able to accept any Ethereum. 

```javascript
function bid() public payable { // Function
    // ...
}
```

**eg.** In this bid function, it is set as payable so it is able to receive either and be used to bid in an auction. 



###### Internal Keyword 

Internal keywords are the same as private but if it is set for a function, **the function will be able to be inherited by other Contracts** while private keyword cannot. 



###### Mappings

**Syntax:** mapping(_KeyType => _ValueType)

**KeyType** - could be a dynamically sized array, contract, enumerator, or struct.

**ValueType** - could be any type.

A mapping type maps keys to values. This type only allows for state variables in internal functions. 

```javascript
mapping(address => uint) public balances;
```

**eg. ** In this example, we map an address to an unsigned integer value type and it is marked as public within the balances variable. This balances variable will be able to be accessed by other Contracts since it is public. 





##### Functions

###### Constructors

A constructor function is a function with the same as a the Contract. It will be called upon the creation of the Contract. 

```javascript
function Wrestling() public {
  wrestler1 = msg.sender;
}
```

**eg.** In this example, the first wrestler is the one who creates the contract. The msg.sender is used to to find the address of the who invoked the function. In this case, the first wrestler invokes the function.



###### Require 

The **require** function is used for error handling in solidity. If the argument in the require function is evaluated to 'false', it will **revert all changes** to the state and Ether balances.  

**Becareful**, this function will consume all provided gas used to run this function. (but this is planned to change in the future).

```javascript
function registerAsAnOpponent() public {
    require(wrestler2 == address(0));	// address(0) means a 0x0 address.
    wrestler2 = msg.sender;
    WrestlingStartsEvent(wrestler1, wrestler2);
}
```

**eg.** In this example, if the address variable wrestler2 equals to a 0x0 address then we will continue with the function. Else, if the condition becomes false then it means that the wrestler2 has already been registered therefore we will refuse any new registrations. 

You are also able to add an error message to why the require function has failed:

```javascript
require(wrestler2 == address(0), "Address has already been registered");
// If wrestler2 is already registered, it will pop up the error message in the require function.
```





##### Properties

###### msg.sender

**msg.sender(address)** is a block and transaction property in Solidity that **returns the address of who ever invoked the function**. 



###### msg.value

**msg.value(uint)** is a block and transaction property in Solidity that **returns the number of wei sent with the message** or the amount of ether that was sent to the contract.



###### msg.sender.transfer

**msg.sender.transfer** will send the amount of Ethereum sent to the function to the address that has invoked the function.



##### Directives

**The directives will be used within the truffle development network.**

###### From

The **from directive** is used to specify which address should call the function. That address will then spend the amount of gas to use that function from the contract.

```javascript
WrestlingInstance.registerAsAnOpponent({from: account1})
```

**eg. **From the Wrestling example,  we are using the specified account address that was initialized with the account1 variable. The account1 address will then be used to call the *registerAsAnOpponent()* function.



###### Value 

The **value directive** is used to specify how much wei should be sent to the function with the **payable keyword**. Note that we had a *wrestle()* function that uses the payable keyword. 

```javascript
WrestlingInstance.wrestle({from: account0, value: web3.toWei(5, "ether")})
```

**eg. **From the Wrestling Example, we are using the account0 address to send the amount of ether (converted to wei) and the value will be returned by the **msg.value** block property.



##### Security

###### Re-entrancy

A form of attack from hackers that makes them call a function that withdraws ether multiple times from that contract multiple times. 

```javascript
    function withdraw() public {
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            // It is important to set this to zero because the recipient
            // can call this function again as part of the receiving call
            // before `transfer` returns (see the remark above about
            // conditions -> effects -> interaction).
            pendingReturns[msg.sender] = 0;

            msg.sender.transfer(amount);
        }
    }
```

**Add more security measures**



##### Types of IDE

###### Remix IDE

It is a website IDE, try it out [here](https://ethereum.github.io/browser-solidity/).

###### Free Ethereum on Testnet

On metamask, go to Ropsten Testnet, then to receive your free Ethereum go to the Ethereum Ropsten Faucet here: http://faucet.ropsten.be:3001/

###### BUGS

If smart contracts do not compile properly move back from Javascript VM back to default then again to Javascript VM and redeploy contract.



#### Virtual Environment

We will be using Node.js as the language format to run code locally on our computer.

##### Installation

**Truffle** is a development environment and will be used to test and develop your smart contracts. 

To install truffle write this command in the node.js command line:

```js
npm install -g truffle
```



To begin, we must initialize a truffle project by typing this into the cli:

```js
truffle init
```

*Make sure to create a folder first and navigate to that folder in the cli before typing that command to have better organization of data.*



##### Deploying Contracts

**To start deploying contracts** we must create a script in the Migrations folder inside the initialized truffle files. Name this script as *2_deploy_contracts.js*. In this script, we are going to deploy the created 'Wrestling' contract from the previous example to the blockchain. 

```javascript
// First import the required file from the contracts folder
const Wrestling = artifacts.require("./Wrestling.sol")

module.exports = function(deployer) {
	deployer.deploy(Wrestling);		// deploys the file into the blockchain
};
```

**eg.** Example code to deploy the Wrestling.sol file created earlier into the blockchain.  



##### Truffle Network Configuration

To stop any naming problems for **Windows users** delete the truffle.js file in the root directory of the initalized truffle directory. 

When the file has been deleted, in the *truffle-config.js* this code must now be added:  

```js
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {	
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  }
};
```

**eg.** This example simply states that when the user is using the development network, use the local host and the port 7545 with any network id.



##### Testing the Smart Contract

Before we begin testing any code, we must have "generated" accounts that own Ethereum to be able to test the transactions for our smart contract.



**To generate accounts that have a balance of 100 Ethereum each** (default), open a new Node.js command prompt and open the ganache command line by typing:

```js
ganache-cli -p 7545
```

When the ganache command line is open, you will see generated accounts with the wallet address and private key. 



Before we deploy our code into the blockchain, the **Ethereum Virtual Machine** (EVM) must first understand the code by converting it into bytes:

```js
truffle compile
```

**Type this code into the regulate node.js CLI (not in the ganache CLI) while in the contracts folder** to compile the written Solidity files.



Finally we may now deploy our code by typing this line into the regular node.js CLI:

```js
truffle migrate --network development
```

This command will simply **migrate the code into the Ethereum blockchain** using the development network.



When the contracts are deployed to the blockchain, you will see transactions execute on the ganache CLI. 

![transactions](E:\Class\Research\Pictures\transactions.png)

You may see one of the transactions with the same address as the deployed Wrestling.sol Contract (Compare the addresses from the regular Node.js CLI and Ganache CLI).



###### Interacting with the Blockchain on Ganache

**To interact with the blockchain in the Ganache CLI**, type this command into the truffle CLI:

```js
truffle console --network development
```

 This will enable us to run the truffle environment on the development network.



###### Using the Wrestling Time Example to Interact with Blockchain

**We will be using the Web3 Javascript API to interact with the Ethereum Blockchain**.



**Run all of the commands in the Truffle Environment**

**Step 1)** We will first initialize account variables for the two players by using the generated accounts created by Ganache:

```js
account0 = web3.eth.accounts[0]
account1 = web3.eth.accounts[1]
```

This code will initialize addresses for the two accounts.



**Step 2)** We now need to create a reference to the contract that we have deployed (Wrestling.sol) and assign it to the variable *WrestlingInstance*:

```js
Wrestling.deployed().then(inst => { WrestlingInstance = inst})
```

When the command is run you will see *undefined* text that pops up, this is fine.



**Step 3)** Now using the WrestlingInstance, we can check the address of wrestler1:

```js
WrestlingInstance.wrestler1.call()
```

This code will return the address of wrestler1 **which will be the default account from Ganache** (first account generated). It is the default account because no addresses were specified in the config file from Truffle. 



**Step 4)** Now that we have wrestler1 "registered", we may now also register wrestler2. 

```js
WrestlingInstance.registerAsAnOpponent({from: account1})
```

Notice how we use a directive called **from** that points to the address of the second account. The **from** directive will simply tell the *registerAsAnOpponent* function to call the function using the specified address.

Remember that in the Wrestling.sol code, the wrestler2 address initializes to the address that has called the function:

```javascript
wrestler2 = msg.sender;
```

**eg.** This an example of the code that was used in Wrestling.sol.

**Note that  the wrestler1 and wrestler2 should have the same address as the initialized account0 and account1 from the beginning.**

![wrestler1and2_address](C:\Users\Supax2\Documents\GitHub\learning-dev_blockchain\Pictures\wrestler1and2_address.png)

To check that it is the same, use the call() function again to check.

![calledwrestler1and2](C:\Users\Supax2\Documents\GitHub\learning-dev_blockchain\Pictures\calledwrestler1and2.png)



**Step 5)**  After all players are registered, now the two wrestlers can fight to win.  We will now use the wrestle() function and send the amount specified to the contract. Note that a wrestler wins only when their deposit is greater than the other wrestler's deposit **doubled**. 

```javascript
WrestlingInstance.wrestle({from: account0, value: web3.toWei(2, "ether")})
WrestlingInstance.wrestle({from: account1, value: web3.toWei(3, "ether")})
// End of the first round
WrestlingInstance.wrestle({from: account0, value: web3.toWei(5, "ether")})
WrestlingInstance.wrestle({from: account1, value: web3.toWei(20, "ether")})
// End of the wrestling
```

The *toWei()* function is used to convert the amount of Ethereum into wei which is the lowest denomination of Ether (eg. Satoshi's from bitcoin). 

![eventlogs](C:\Users\Supax2\Documents\GitHub\learning-dev_blockchain\Pictures\eventlogs.png)

*Remember to always look at the logs after every transaction to see if the events have properly occured, for step 5, the event "EndOfWrestlingEvent" should occur as the two wrestlers have finally played.*



**Step 6) **You may now withdraw to the address that has won the match (in this case account1) since we have doubled the amount of Ether that account1 has deposited which beats account0. 

```javascript
WrestlingInstance.withdraw({from: account1})
```





###### Running Ethereum Testnet (using Geth and Truffle)

To be able to have a smart contract that is secure from hackers and the functionality is correct, we need to have our development environment to be as real as possible. We will run our smart contract using the Ethereum testnet for better testing of our contract. 



**What is a Testnet?** The Ethereum testnet is a chain that is ran locally in your own private network separately from the real Ethereum mainnet. 

In this example, we will be exploring the use of the Ethereum testnet and how we will be able to test our smart contracts using test transactions with 'fake' mined Ethereum. 

 

**Step 1) **Install Geth [here.](https://geth.ethereum.org/downloads/)

Geth will be used to connect to the Ethereum blockchain.





**Step 2) ** Install the Mist wallet or Ethereum wallet (any of them could be used but the Ethereum wallet is definitely a lot more secure than Mist). Choose which wallet [here.](https://github.com/ethereum/mist/releases)

We need a wallet to be able to test our transactions for our Smart Contracts.





**Step 3) **In the root folder of our created smart contract, create a new file and name it genesis.json. In this file we need to have the following code in it: 

```javascript
{
  "difficulty" : "0x20000",
  "extraData"  : "",
  "gasLimit"   : "0x8000000",
  "alloc": {},
  "config": {
        "chainId": 15,
        "homesteadBlock": 0,
        "eip155Block": 0,
        "eip158Block": 0
    }
}
```

*The contents of this file basically contains information that geth needs to create a new blockchain*





**Step 4) **There is already a public testnet for Ethereum but for better understanding on how testnet works. We will be creating our own instance of Ethereum testnet but using our own local network using the *genesis.json* file in the past step.

Go to the root folder of our created smart contracts folder and open up a new Node.js CLI and type this: 

```js
geth --datadir=./chaindata/ init ./genesis.json
```

This line will basically generate a chaindata folder in the root of our smart contracts folder using the genesis.json configuration file. **This is where our private blockchain will be stored.**





**Step 5) **After the chaindata folder is created, we now need to start up geth ( to start running our own private chain):

Open another new Node.js CLI and type this (make sure to be in the root folder again): 

```js
geth --datadir=./chaindata/ --rpc
```

This line will start up Geth in our generated chaindata folder, the "--rpc" command tells Geth to accept remote procedure calls (RPC) connections. An RPC connection will be used for client-server interaction and **this command will let us create an RPC end point for our local loopback IP** (127.0.0.1). 

![httpendpoint](C:\Users\Supax2\Documents\GitHub\learning-dev_blockchain\Pictures\httpendpoint.png)

*From this picture, you can see that the HTTP end point for our loopback IP is now available for us to connect*





**Step 6) **We will now launch the Mist wallet and connect to our loopback IP address using RPC.

Open up **another** new Node.js CLI and type this. Make sure to be in the directory where mist (or Ethereum wallet) is located: 

```js
start mist -rpc http://127.0.0.1:8545
```

*This will start up mist wallet using the rpc endpoint to our **localhost**.*

<span style="color:red">**Security Measures when using RPC over Geth**</span>

**When you enable Geth over RPC using port 8545**, make sure to **always** enable it using your local loopback IP of (**127.0.0.1**). Unless, you understand what you are doing using your non-local IP address of (**192.168.1.123**). If you use that non-local IP address you will be forwarding your IP address traffic for port 8545 to the public, which will make you vulnerable for JSON attacks (ie. hackers being able to steal your Ethereum). 

**When your RPC endpoint is your loopback IP**, no one except your own local computer can communicate to the Geth RPC endpoint since you are connected to the **localhost** (which is only accessible by the local computer). 





**Step 7) **When Mist is opened, create a new wallet with a simple password (do not use your main account with your real Ethereum). In this case, I will be using the password "123456789". **Make sure to not use the same password as your real wallet account, remember this is just for testing purposes.**

![priavtenetwork](C:\Users\Supax2\Documents\GitHub\learning-dev_blockchain\Pictures\priavtenetwork.png)

*At the bottom left, your Mist wallet must have the Private symbol to have successfully ran our own local private test net. If this is not there, **do not continue on to the next steps**.*

**REMEMBER: Your mist wallet data will be in the generated chaindata folder such as your wallet keystore data.**





**Step 8) **Open up **another** Node.js CLI without closing the other CLI's and type this command: 

```js
geth attach ipc:\\.\pipe\geth.ipc
```

This will let us now interact with the blockchain using Geth such as mine Ethereum. 

One thing we need to do before we start mining is that we need to set our Etherbase account to the account we just created. **If this is your first wallet account creation, then the first account should be the default Etherbase account (You should be okay to move on).** **But if it is not your first Etherbase account we need to make the account we created to as our Etherbase account.** 

**What is Etherbase? **When an account is set as an Etherbase account, it makes the wallet address be able to receive the mined Ethereum. 

Before we initialize our Etherbase account, you need to first understand how the eth.accounts indexes work. it is based on zero indices, for example, the wallet with *Main Account* title is the first created wallet, thus making it accounts[0]. If you create more accounts, they will be named as account1, account2, etc. These accounts will be accounts[1], accounts[2], etc. 

To change the default Etherbase account type this into the console we attached geth to (**change it depending on the account you want to mine Ethereum and run the contract on**):

```javascript
// these commands are from the Web3 Api
eth.defaultAccount = eth.accounts[0]
miner.setEtherbase(eth.accounts[0])
```

Now that our Etherbase account is set we may now mine Ethereum using this command:

```js
miner.start()
```

*null* Message will popup which is okay, wait a couple of seconds or minutes then these messages should pop up on the console of where we enabled RPC connections:

![miningblock](C:\Users\Supax2\Documents\GitHub\learning-dev_blockchain\Pictures\miningblock.png)

**Check your wallet and you should start seeing your wallet start to receive Ethereum in a fast rate**.







**Step 9)** We will now go back to our *truffle-config.js* file in the root folder of our smart contract and add *ourTestNet* network beside our *development* network.

The config file must now look like this:

```javascript
module.exports = {
  
	// See <http://truffleframework.com/docs/advanced/configuration>
  
	// to customize your Truffle configuration!

	networks: {
		development: {
			host: "127.0.0.1",
			port: 7545,
			network_id: "*"
		},
		ourTestNet: {
			host: "127.0.0.1",
			port: 8545,
			network_id: "*"
		}
	}
};

```

Make sure the host is our localhost, our port is 8545 and that we can accept any network_id just like in our development network.  (Port 8545 is the default port Geth connects to)





**Step 10) **Before we migrate truffle to *ourTestNet* network, we need to unlock our wallet to be able to interact with truffle.

Run this command in the geth command line that we have opened up: 

```js
personal.unlockAccount('(enter wallet address here)', 'enter wallet password here')
```







**Step 11) ** We now need to migrate our truffle network to *ourTestNet* network.  

**Make sure you have unlocked the Etherbase account, the wallet has atleast 1 Ethereum and that the miner is still running before you migrate the Network or it will not work. (deploying our contract costs gas).**

Open up a new Node.js command line and make sure the directory is the root folder of your smart contract: 

```js
truffle migrate --network ourTestNet
```

You will know the migration is successful if  you see these messages: 

![img](https://i.gyazo.com/c2e640621235c3b014416fa1a0ec477e.png) 







**Step 12) **Now in the same Node.js CLI, type this into the command line to connect to the truffle console (**make sure the Etherbase account is still unlocked, you may re-do the personal.UnlockAccount if this command does not work**):

```js
truffle console --network ourTestNet
```

To make sure everything is working type these commands into the truffle console:

```js
Wrestling.address	// shows the address of the deployed Wrestling contract
JSON.stringify(Wrestling.abi)
```

*JSON.stringify(Wrestling.abi)* command shows the description of the contract such as variables, events, functions, etc.

The information that you see on the console is very important because we will be using it to watch the contract on Mist.





**Step 13) **Go back to the Mist wallet and press Contracts button on the top right of the wallet. Press Watch Contract and add the address of the Contract (from *Wrestling.address* command), enter the name of the Contract, and enter the ABI of the Contract (from the *JSON.strongify(Wrestling.ABI)* command). 

**Take out the single quotations of the copied information**, it should look like this:

![watchcontract](C:\Users\Supax2\Documents\GitHub\learning-dev_blockchain\Pictures\watchcontract.png)







**Step 14) **Click on the Contract that we have just added. We will now be able to see the variables of the contract and test the functions of the contract.









#### Creating Tokens on the Ethereum Blockchain

In this section, I will be teaching you how to create your own **token** and as an example we will be creating the **SupaxCoin**.

##### What are tokens?

As everyone knows, Ethereum is a currency on its own but what people don't understand is that other currencies may co-exist within the Ethereum blockchain. The 'currency of a currency' in blockchains may also be known as **tokens**. 

Tokens are important for blockchains because they are used for decentralized applications (**dApps**). These applications are decentralized because they are not being ran by a single entity (e.g, the government), it runs on a peer to peer network comprised of many computers. Since decentralized applications are not owned by a single person, the way to figure out ownership is by creating a crowdfund called an initial coin offering (**ICO**) which is similar to an IPO in stocks. The way ICO's work is that people are able to send their Ethereum to the dApp's ICO wallet address and the company will convert the Ethereum into their own token.

There are many types of tokens on Ethereum: **ERC20** and **ERC721** are one of the two main types/guidelines of a token. **ERC** means **E**thereum **R**equest for **C**omments and the numbers are just the ID for the different set of rules for the token. 



**ERC20 (fungible)**: An ERC20 token runs on the Ethereum network. These types of tokens do not have any uses for it other than be traded/transferred from exchanges that support ERC20 tokens and are easily replaceable. However, some companies do use the ERC20 standard token to launch a crowdfund to be able to develop their own blockchain for their token. Additionally, this type of token may also be labelled as a **work token** because it acts as a shareholder for the dApp. 

Examples: TRON and OmiseGo piggyback on the Ethereum network as just tokens but plan to create their own blockchain.



**ERC721 (non-fungible)**:  An ERC721 tokens are not replaceable and could be labelled as a **collectible** type of token. This means that when a dApp uses ERC721 they are able to create items that uses that standard that are unique rather than being duplicated like an ERC20 token. This type of token may also be called as a **usage token** because it contains value and could be used as a currency for the dApp.

Examples: A dApp called CryptoKitties created on the Ethereum blockchain contain an ERC721 token which is a unique kitty that could be traded or transferred between other uses for value.







##### Creating the Token

We will be creating an ERC20 standardized token, which means we will be following the guidelines made by the Ethereum foundation to create this token. 



```javascript
pragma solidity ^0.4.18;

contract SupaxToken {
    
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
    
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    
    string public tokenName = "Supax";
    string public symbol = "SPX";
    
    uint8 public decimals = 4;
    
    uint256 public totalSupply;
    
    mapping(address => uint256) balances;
    
    function SupaxToken() public {  // constructor
        totalSupply = 1000000;
        
        balances[msg.sender] = 100;     // update the balance of who created the contract
    }
    
    //  getter function to get maximum supply
    function totalSupply() public constant returns (uint256 _totalSupply){
        return totalSupply;
    }
    
    //  getter function to get balance
    function balanceOf (address tokenOwner) public view returns (uint256 balance){
        return balances[tokenOwner];
    }
}
```













### Front End Development Using Metamask and Node.js

Tutorial from HardlyDifficult: https://steemit.com/tutorial/@hardlydifficult/ethereum-dapp-tutorial-part-2-of-3-web-front-end-with-metamask-integration

Modified to fit with the WrestlingTime contract.

##### Requirements

1. Use the [Solidity Documentation](http://solidity.readthedocs.io/en/v0.4.24/) for creating smart contracts.
2. Use the [Ownable class code](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol) when creating smart contracts. 
3. Download [Metamask](https://metamask.io/) Chrome Extension. 
4. Use [Ropsten Testnet Faucet](http://faucet.ropsten.be:3001/) to get free Ethereum for dApp testing.
5. Change the network in MetaMask to **Ropsten Testnet**.
6. Install [NPM and Node.js](https://www.npmjs.com/get-npm).



##### Steps

**Step 1)** Create a smart contract first using the Ethereum web solidity compiler (**the browser compiler is pretty powerful**) from [here](https://remix.ethereum.org). 

In this example we will be using the same smart contract file that we have created from the beginning of this document. (**Wrestling Time**)



**Step 2)** Compile your smart contract.



**Step 3)** In the Solidity compiler, go to the run tab and put the environment as **JavaScript VM**.  In this VM environment, you are able to test your contract and be able to change to different accounts. Try different accounts and register the two different wrestlers using the events in the WrestlingTime smart contract.

You can debug through the code if an error happens by pressing debug on the error log in the console.



**Step 4) ** After testing the different function and events, switch the environment to **Injected Web 3**. In this environment, we are able to use MetaMask to test our dApp.

Deploy the **WrestlingTime** contract again and use a value of 4.3 wei as the gas. **(DOUBLE CHECK THAT YOU ARE IN ROPSTEN TESTNET)**



**Step 5)** Once the contract is deployed, **verify** and **publish** the source code to the **Ethereum block explorer** as it is ethical to do so.  [Here](https://ropsten.etherscan.io/) is the link to **Ropsten Testnet Block Explorer**. 

Copy the contract address from the Remix IDE and paste it onto the Block Explorer. 

Go to the `Code` Tab and press **Verify and Publish**.

Now enter the Contract Address, Contract Name, Compiler Version, and if it Optimized. To find these details simply press **Detail** in the `Compiler` Tab. 

![img](https://i.gyazo.com/a82908a13f9b5a66558b6796de9b7da8.png) 

Last but not least, enter the Smart Contract code then press Verify. 

***The Code should now be available to be seen by the public.***



**(BEFORE THE NEXT STEPS, MAKE SURE NPM AND NODE.JS IS INSTALL)**

**Step 6)** Create a folder and name it relevant to your dApp.

**Step 7)** Add a directory named `src` and in the directory, create an empty file named `index.js`.



**Step 8)** Open a Node.js command prompt and run it as an administrator. Change the directory of the command prompt to your root directory of your dApp and run the following command to **install Webpack**:

```npm
npm install webpack webpack-cli webpack-dev-server --save-dev
```

**Breaking down the command**

`npm` is the package manager for JavaScript, it helps with retrieving dependencies for your JavaScript project very easy.

`install` command will download the component and saves it in the current directory, in this case our root directory of our dApp project.

`webpack webpack-cli webpack-dev-server` is a command that contains many delimited statements for a Webpack

`--save-dev` tells the package manager to make the packages available in development mode but not in production. **The dApp being created has no server-side dependencies.**



**Step 9) ** After Webpack is installed, you may now launch the Webpack dev server by using this command in the Node.js command prompt:

```npm
npx webpack-dev-server --https
```

`npx` is used to execute an npm package, in this case webpack-dev-server.

`--https` option will generate a certificate automatically helping make testing easy.



**Step 10)** You may now visit your website that is in development by opening https://localhost:8080 in your browser. Press advanced options and proceed to localhost.

**For now close the command prompts and we will re-open them again later.**



**Step 11) **Create an empty `index.html` file in the root directory of your dApp project.

In the html file, add the following code to add the basic website template that includes jquery and the main.js file: 

```html
<html>
    <head>
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js">			    </script>
        <script src="./dist/main.js"></script>
    </head>
    <body>
    </body>
</html>
```

The code `<script src="./dist/main.js"></script>` will basically create a main.js file in a `dist` directory that will be a bundle of all the javascript files you have created.



**Step 12) ** In the `index.js` file create constant variables for your contract address and ABI. It should look like this: 

```javascript
const contract_address = "0x48b6fc9b9b501ace88cc50e83011235d6a8373d0";
const abi = [
	{
		"anonymous": false,
		"inputs": [
            .....
            }
            ];
```

You can find all of these information again in the `Compiler` Tab of the Remix IDE.

Press `Details` and just copy the information to your clipboard.

![img](https://i.gyazo.com/6ba17e6470a88c1204252ec34fb16800.png) 



**Step 13) ** We will now move away form the minimal Webpack deployment for testing from *Step 9-10* and move onto a more capable environment.

Open a new Node.js command prompt as administrator and run this command: 

`npm init -y` , this will create a package.json file which will help manage the packages we will be adding.



**Step 14) ** In the same command prompt enter the following command:

```npm
npx webpack-dev-server --https
```

This will again launch the local server.



**Step 15) **Open another command prompt as administrator and change directory to the root directory of your dApp project. 

Type this command: 

```npm
npx webpack --mode=development
```

This command **compiles your application** and generates the `dist/main.js`  that we have added in the `index.html` file. 

**YOU WILL NEED TO RUN THIS COMMAND ANYTIME YOU HAVE CHANGED YOUR JAVASCRIPT FILES**

`--mode=development` option prevents compression in order to make debugging easier.



**Step 16) **We will now **add Web3 and Ledger support.**

Type this command to install the following Web3.js and Ledger components:

```npm
npm install web3 web3-provider-engine @ledgerhq/web3-subprovider @ledgerhq/hw-transport-u2f
```







**Step 17) **Add the following include directives add the top of your `index.js` file:

```javascript
import Web3 from "web3";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import ProviderEngine from "web3-provider-engine";
import RpcSubprovider from "web3-provider-engine/subproviders/rpc";
```

Since Metamask does not use the latest version of Web3.js to maintain backward compatibility for dApps, we need to change the Web3 object that Metamask provides by using the latest directive. **We will now be able to support read-only calls for users who don't have either MetaMask or Ledger.**

The rest of the `import` statements are for the Web3 and Ledger support.







**Step 18) ** In the `index.js` file, add the following code:

```javascript
let my_web3;		// Replacing Web3 object Metamask provides with this.
let account;		// Variable will allow us to block any attempt to create 					   a transaction.
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
    my_web3.eth.getAccounts((error, result) => {	//promise statement
      if(error) {
        console.log(error);
      } else if(result.length == 0) {
        console.log("You are not logged in");
      } else {
        account = result[0];
        contract.options.from = account;
      }
    }).catch((error) => {	// new Web3.js version uses promises, any error 							caught is responded to here.
      console.log("Error: " + error);
    });
});
```

`const rcpUrl` is needed because our application reads from an Ethereum node. Users that don't have a Metamask account needs this to be able to select a node manually.



`window.addEventListener('load')` is being used because on 'load' Metamask adds an object named `web3` automatically to the page before 'load' completes. So on load, we use the web3 object to create a **contract object** using the **abi** and **contact_address** that we have made earlier.

























## NEO Development

Work in progress..

- Learn how NEO scales a lot better than Ethereum.
- Importance of learning NEO Development?

## VeChain Thor Development

Work in progress..

Main net, end of June?

GITHUB: https://github.com/vechain/thorify 

- Able to use RFID and buy their RFID?
- Open source?
- Use Solidity like Ethereum in the beginning.
- Tracker app? Gun control? 
- Which mobile phone is it compatible with?
- Wallet does not support VET pooling.
- How does Multi-payment Protocol (MPP) work?
- Learn the partnerships of VET.
- Review github



## TRON Development

Work in progress..

Main Net, end of May?



## Other blockchain





# Citations

http://solidity.readthedocs.io/en/v0.4.21/solidity-by-example.html?highlight=require%20function

https://hackernoon.com/ethereum-development-walkthrough-part-1-smart-contracts-b3979e6e573e
https://hackernoon.com/ethereum-development-walkthrough-part-2-truffle-ganache-geth-and-mist-8d6320e12269

https://medium.com/@gus_tavo_guim/reentrancy-attack-on-smart-contracts-how-to-identify-the-exploitable-and-an-example-of-an-attack-4470a2d8dfe4
https://ethereum.stackexchange.com/questions/10681/what-are-ipc-and-rpc
https://blockgeeks.com/guides/ethereum-token/



https://steemit.com/tutorial/@hardlydifficult/ethereum-dapp-tutorial-part-2-of-3-web-front-end-with-metamask-integration



**Adding proper citations later**