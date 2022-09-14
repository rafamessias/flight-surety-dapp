const FlightSuretyApp = require("../dapp/contracts/FlightSuretyApp.json");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const Web3WsProvider = require("web3-providers-ws");
require("dotenv").config({ path: `${__dirname}/.env.local` });

console.log("#### ORACLE - INIT");
oracle();
console.log("#### ORACLE - UP AND RUINNING");

async function oracle() {
  const MNEMONIC = process.env.MNEMONIC;
  const providerURL = "ws://localhost:7545";

  // const wsProvider = new Web3.providers.WebsocketProvider(providerURL);
  // HDWalletProvider.prototype.on = wsProvider.on.bind(wsProvider);

  const wsProvider = new Web3WsProvider(providerURL);

  const provider = new HDWalletProvider({
    mnemonic: MNEMONIC,
    providerOrUrl: wsProvider,
    numberOfAddresses: 20,
  });

  // const web3 = new Web3(new Web3.providers.WebsocketProvider(provider));
  const web3 = new Web3(provider);

  const networkID = await web3.eth.net.getId();

  web3.eth.defaultAccount = web3.eth.accounts[0];

  const { abi } = FlightSuretyApp;
  const address = FlightSuretyApp.networks[networkID].address;

  const contract = new web3.eth.Contract(abi, address);

  contract.events.OracleRequest(
    {
      fromBlock: 0,
    },
    function (error, event) {
      if (error) console.log(error);
      console.log(event);
    }
  );
}
