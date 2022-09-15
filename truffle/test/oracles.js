const Test = require("./config/testConfig.js");
//const BigNumber = require('bignumber.js');

contract("Oracles", async (accounts) => {
  const TEST_ORACLES_COUNT = 10;
  var config;

  const STATUS_CODE_UNKNOWN = 0;
  const STATUS_CODE_ON_TIME = 10;
  const STATUS_CODE_LATE_AIRLINE = 20;
  const STATUS_CODE_LATE_WEATHER = 30;
  const STATUS_CODE_LATE_TECHNICAL = 40;
  const STATUS_CODE_LATE_OTHER = 50;

  //setting the funds
  const airlineFunds = web3.utils.toWei("0.000001", "ether");

  before("setup contract", async () => {
    config = await Test.Config(accounts);
    await config.flightSuretyData.authorizeCaller(
      config.flightSuretyApp.address
    );

    // add the first airline
    await config.flightSuretyApp.registerAirline.sendTransaction(
      config.firstAirline,
      "First Airlines"
    );

    await config.flightSuretyApp.airlineFund.sendTransaction({
      from: config.firstAirline,
      value: airlineFunds,
    });

    await config.flightSuretyApp.approveAirlineRegistration.sendTransaction(
      config.firstAirline,
      true
    );
  });

  it("can register oracles", async () => {
    // ARRANGE
    let fee = await config.flightSuretyApp.REGISTRATION_FEE.call();

    // ACT
    for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
      await config.flightSuretyApp.registerOracle({
        from: accounts[a],
        value: fee,
      });
      let result = await config.flightSuretyApp.getMyIndexes.call({
        from: accounts[a],
      });
      console.log(
        `Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`
      );
    }
  });

  it("can request flight status", async () => {
    // ARRANGE
    let flight = "ND1309"; // Course number
    let timestamp = Math.floor(Date.now() / 1000);

    await config.flightSuretyApp.registerFlight.sendTransaction(
      flight,
      timestamp,
      config.firstAirline,
      {
        from: config.firstAirline,
      }
    );

    // Submit a request for oracles to get status information for a flight
    await config.flightSuretyApp.fetchFlightStatus(
      config.firstAirline,
      flight,
      timestamp
    );
    // ACT

    // Since the Index assigned to each test account is opaque by design
    // loop through all the accounts and for each account, all its Indexes (indices?)
    // and submit a response. The contract will reject a submission if it was
    // not requested so while sub-optimal, it's a good test of that feature
    for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
      // Get oracle information
      let oracleIndexes = await config.flightSuretyApp.getMyIndexes.call({
        from: accounts[a],
      });
      for (let idx = 0; idx < 3; idx++) {
        try {
          // Submit a response...it will only be accepted if there is an Index match
          await config.flightSuretyApp.submitOracleResponse(
            oracleIndexes[idx],
            config.firstAirline,
            flight,
            timestamp,
            STATUS_CODE_ON_TIME,
            { from: accounts[a] }
          );
        } catch (e) {
          // Enable this when debugging
          console.log(e);
          console.log(
            "\nError",
            idx,
            oracleIndexes[idx].toNumber(),
            flight,
            timestamp
          );
        }
      }
    }
    const result = await config.flightSuretyApp.getFlight(
      flight,
      timestamp,
      config.firstAirline
    );

    assert.equal(
      result[5].toString(),
      STATUS_CODE_ON_TIME.toString(),
      "Flight status not updated!"
    );
  });
});
