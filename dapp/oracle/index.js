const FlightSuretyApp = require("../contracts/FlightSuretyApp.json");
const Web3 = require("web3");

console.log("#### ORACLE - INIT");
oracle();
console.log("#### ORACLE - UP AND RUINNING");

async function oracle() {
  const providerURL = "ws://localhost:7545";
  const web3 = new Web3(new Web3.providers.WebsocketProvider(providerURL));
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
