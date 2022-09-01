const Web3 = require('web3');
const abi = require('./abi.json').abi;



// var web3 = new Web3("http://127.0.0.1:8545");
// const contract = new web3.eth.Contract(abi, "0xcAfbF389fC0F3431434988F690337674feb52324");

var web3 = new Web3("ws://127.0.0.1:8545");
const contract = new web3.eth.Contract(abi, "0xcAfbF389fC0F3431434988F690337674feb52324");

// const getValue = async () => {
//     const resultValue = await contract.methods.testValue().call()
//     console.log(resultValue)
// }

const getEvents = () => {
    contract.events.StartFunction({
        fromBlock: 0
    }, function(error, event) { console.log(event); })
        .on("connected", function(subscriptionId) {
            console.log(subscriptionId);
        })
        .on('data', function(event) {
            console.log(event); // same results as the optional callback above
        })
        .on('changed', function(event) {
            // remove event from local database
        })
        .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            console.log('error', error)
        });
}

// getValue()
getEvents()

