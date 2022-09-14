const FlightSuretyApp = require("../dapp/contracts/FlightSuretyApp.json");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
require("dotenv").config({ path: `${__dirname}/.env.local` });

console.log("#### ORACLE - INIT");
oracle();
console.log("#### ORACLE - UP AND RUINNING");

async function oracle() {
  const MNEMONIC = process.env.MNEMONIC;
  const providerURL = "ws://127.0.0.1:7545";

  const wsProvider = new Web3.providers.WebsocketProvider(providerURL);
  HDWalletProvider.prototype.on = wsProvider.on.bind(wsProvider);

  const provider = new HDWalletProvider(MNEMONIC, providerURL, 0, 40);

  const web3 = new Web3(provider);
  const networkID = await web3.eth.net.getId();
  const accounts = await web3.eth.getAccounts();

  web3.eth.defaultAccount = accounts[0];

  const { abi } = FlightSuretyApp;
  const address = FlightSuretyApp.networks[networkID].address;

  const contract = new web3.eth.Contract(abi, address);

  //##### Register Oracles
  const FEE = await contract.methods.REGISTRATION_FEE().call({
    from: accounts[0],
  });
  const TEST_ORACLES_COUNT = 20;
  for (let a = 11; a < TEST_ORACLES_COUNT; a++) {
    await contract.methods.registerOracle().send({
      from: accounts[a],
      value: FEE,
    });
    const result = await contract.methods.getMyIndexes().call({
      from: accounts[a],
    });
    console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);
  }
  //##### Register Oracles

  contract.events.OracleRequest(
    {
      fromBlock: 0,
    },
    function (error, event) {
      if (error) console.log(error);
      //console.log(event);
    }
  );
}
