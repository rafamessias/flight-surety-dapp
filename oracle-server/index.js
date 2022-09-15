const FlightSuretyApp = require("../dapp/contracts/FlightSuretyApp.json");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
require("dotenv").config({ path: `${__dirname}/.env.local` });

const STATUS_CODE_UNKNOWN = 0;
const STATUS_CODE_ON_TIME = 10;
const STATUS_CODE_LATE_AIRLINE = 20;
const STATUS_CODE_LATE_WEATHER = 30;
const STATUS_CODE_LATE_TECHNICAL = 40;
const STATUS_CODE_LATE_OTHER = 50;

const statusCode = [
  STATUS_CODE_UNKNOWN,
  STATUS_CODE_ON_TIME,
  STATUS_CODE_LATE_AIRLINE,
  STATUS_CODE_LATE_WEATHER,
  STATUS_CODE_LATE_TECHNICAL,
  STATUS_CODE_LATE_OTHER,
];

oracle();

async function oracle() {
  console.log("#### ORACLE - INIT");

  const providerURL = "http://127.0.0.1:7545";

  console.log("Getting Contract and Accounts");
  const { contract, accounts } = await flightContract(providerURL);

  console.log("Getting Contract to watch");
  const watchContract = await eventsContract(providerURL);

  let oraclesArr = [];

  //##### Register Oracles
  const FEE = await contract.methods.REGISTRATION_FEE().call({
    from: accounts[0],
  });

  const TEST_ORACLES_COUNT = 16;

  console.log("Registering Oracles");
  try {
    for (let a = 10; a < TEST_ORACLES_COUNT; a++) {
      // await contract.methods.registerOracle().send({
      //   from: accounts[a],
      //   value: FEE,
      // });

      const result = await contract.methods.getMyIndexes().call({
        from: accounts[a],
      });

      oraclesArr.push({
        indexes: result,
        address: accounts[a],
      });
      console.log(
        `Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`
      );
    }
  } catch (error) {
    console.log(error);
  }

  //##### Watch Oracle Request events
  watchContract.events
    .OracleRequest({})
    .on("connected", (subID) => {
      console.log(`OracleRequest - SubID: ${subID}`);
    })
    .on("data", async (event) => {
      const eventRequest = event?.returnValues;
      console.log(`New Event: ${eventRequest.index} ${eventRequest.flight}`);
      const randomStatusIndex = Math.floor(Math.random() * 5);

      for (let x = 0; x < oraclesArr.length; x++) {
        const indexes = oraclesArr[x].indexes;

        if (indexes.indexOf(eventRequest.index) !== -1) {
          const result = await contract.methods
            .submitOracleResponse(
              eventRequest.index,
              eventRequest.airline,
              eventRequest.flight,
              eventRequest.timestamp,
              statusCode[randomStatusIndex]
            )
            .send({
              from: oraclesArr[x].address,
            });

          console.log(
            `Oracle response submitted! ${eventRequest.index} ${eventRequest.flight} - status: ${statusCode[randomStatusIndex]}`
          );
        }
      }
    });

  console.log("#### ORACLE - UP AND RUINNING");
}

async function flightContract(providerURL) {
  const MNEMONIC = process.env.MNEMONIC;

  const provider = new HDWalletProvider({
    mnemonic: MNEMONIC,
    providerOrUrl: providerURL,
    numberOfAddresses: 40,
    networkCheckTimeout: 10000000000000,
    timeoutBlocks: 200000,
  });

  const web3 = new Web3(provider);
  const networkID = await web3.eth.net.getId();
  const accounts = await web3.eth.getAccounts();

  web3.eth.defaultAccount = accounts[0];

  const { abi } = FlightSuretyApp;
  const address = FlightSuretyApp.networks[networkID].address;
  const contract = new web3.eth.Contract(abi, address);

  return { contract, accounts };
}

async function eventsContract(providerURL) {
  const web3 = new Web3(
    new Web3.providers.WebsocketProvider(providerURL.replace("http", "ws"))
  );

  const networkID = await web3.eth.net.getId();
  const { abi } = FlightSuretyApp;
  const address = FlightSuretyApp.networks[networkID].address;

  const contract = new web3.eth.Contract(abi, address);

  return contract;
}
