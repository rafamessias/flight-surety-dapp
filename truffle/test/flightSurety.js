const Test = require("./config/testConfig.js");
const BigNumber = require("bignumber.js");

contract("Flight Surety Tests", async (accounts) => {
  let config;
  before("setup contract", async () => {
    config = await Test.Config(accounts);
    await config.flightSuretyData.authorizeCaller(
      config.flightSuretyApp.address
    );
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`(multiparty) has correct initial isOperational() value`, async function () {
    // Get operating status
    const status = await config.flightSuretyApp.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");
  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {
    // Ensure that access is denied for non-Contract Owner account
    let accessDenied = false;
    try {
      await config.flightSuretyData.setOperatingStatus(false, {
        from: config.testAddresses[2],
      });
    } catch (e) {
      accessDenied = true;
    }
    assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
  });

  it("(airline) can register an Airline using registerAirline()", async () => {
    // ARRANGE
    const newAirline = accounts[2];
    // ACT
    try {
      await config.flightSuretyApp.registerAirline.sendTransaction(
        newAirline,
        "Delta Airlines",
        {
          from: config.firstAirline,
        }
      );
    } catch (e) {
      console.log(e);
    }
    const result = await config.flightSuretyApp.getAirline.call(newAirline);

    // ASSERT
    assert.equal(
      result[0],
      "Delta Airlines",
      "Airline should be registered and waiting to provide funding"
    );
  });

  it("(airline) Validate Arline fund", async () => {
    // ARRANGE
    const newAirline = accounts[2];
    // ACT
    try {
      await config.flightSuretyApp.airlineFund.sendTransaction({
        from: newAirline,
        value: web3.utils.toWei("2", "ether"),
      });
    } catch (e) {
      console.log(e);
    }
    const result = await config.flightSuretyApp.getAirline.call(newAirline);

    // ASSERT
    assert.equal(
      result[2].toString(),
      "2000000000000000000",
      "Airline should be funded and waiting to be approved"
    );
  });

  // it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {
  //   // Ensure that access is allowed for Contract Owner account
  //   const accessDenied = false;
  //   try {
  //     await config.flightSuretyData.setOperatingStatus(false);
  //   } catch (e) {
  //     accessDenied = true;
  //   }
  //   assert.equal(
  //     accessDenied,
  //     false,
  //     "Access not restricted to Contract Owner"
  //   );
  // });

  // it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {
  //   await config.flightSuretyData.setOperatingStatus(false);

  //   let reverted = false;
  //   try {
  //     await config.flightSurety.setTestingMode(true);
  //   } catch (e) {
  //     reverted = true;
  //   }
  //   assert.equal(reverted, true, "Access not blocked for requireIsOperational");

  //   // Set it back for other tests to work
  //   await config.flightSuretyData.setOperatingStatus(true);
  // });

  // it("(airline) cannot register an Airline using registerAirline() if it is not funded", async () => {
  //   // ARRANGE
  //   let newAirline = accounts[2];

  //   // ACT
  //   try {
  //     await config.flightSuretyApp.registerAirline(newAirline, {
  //       from: config.firstAirline,
  //     });
  //   } catch (e) {}
  //   let result = await config.flightSuretyData.isAirline.call(newAirline);

  //   // ASSERT
  //   assert.equal(
  //     result,
  //     false,
  //     "Airline should not be able to register another airline if it hasn't provided funding"
  //   );
  // });
});
