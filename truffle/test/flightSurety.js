const Test = require("./config/testConfig.js");
const BigNumber = require("bignumber.js");

contract("Flight Surety Tests", async (accounts) => {
  let config;
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
      value: web3.utils.toWei("1", "ether"),
    });

    await config.flightSuretyApp.approveAirlineRegistration.sendTransaction(
      config.firstAirline,
      true
    );
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`(isOperational) has correct initial isOperational() value`, async function () {
    // Get operating status
    const status = await config.flightSuretyApp.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");
  });

  it(`(isOperational) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {
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

      for (let x = 3; x < 10; x++) {
        await config.flightSuretyApp.registerAirline.sendTransaction(
          accounts[x],
          `Airline ${x}`,
          {
            from: config.firstAirline,
          }
        );
      }
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
      for (let x = 2; x < 10; x++) {
        await config.flightSuretyApp.airlineFund.sendTransaction({
          from: accounts[x],
          value: web3.utils.toWei("1", "ether"),
        });
      }
    } catch (e) {
      console.log(e);
    }
    const result = await config.flightSuretyApp.getAirline.call(newAirline);

    // ASSERT
    assert.equal(
      result[2].toString(),
      "1000000000000000000",
      "Airline should be funded and waiting to be approved"
    );
  });

  it("(airline) Approve Airline Registration", async () => {
    // ARRANGE
    const newAirline = accounts[2];
    // ACT
    try {
      for (let x = 2; x < 5; x++) {
        await config.flightSuretyApp.approveAirlineRegistration.sendTransaction(
          accounts[x],
          true
        );
      }
    } catch (e) {
      console.log(e);
    }
    const result = await config.flightSuretyApp.getAirline.call(newAirline);

    // ASSERT
    assert.equal(result[1].toString(), "2", "Airline should be approved");
  });

  it("(airline) Approve Airline Registration - Multi-Party Consensus", async () => {
    // ARRANGE
    const newAirline = accounts[5];

    // ACT
    try {
      for (let x = 1; x < 3; x++) {
        await config.flightSuretyApp.approveAirlineRegistration.sendTransaction(
          newAirline,
          true,
          {
            from: accounts[x],
          }
        );
      }
    } catch (e) {
      console.log(e);
    }

    const result = await config.flightSuretyApp.getAirline.call(newAirline);
    const count = await config.flightSuretyApp.getTotalAirlines.call();

    // ASSERT
    assert.equal(result[1].toString(), "2", "Airline should be approved");
    assert.equal(
      count.toString(),
      "5",
      "Should have 5 airlines with approved status"
    );
  });

  it("(airline) Reject Airline Registration - Multi-Party Consensus", async () => {
    // ARRANGE
    const newAirline = accounts[6];

    // ACT
    try {
      for (let x = 1; x < 3; x++) {
        await config.flightSuretyApp.approveAirlineRegistration.sendTransaction(
          newAirline,
          false,
          {
            from: accounts[x],
          }
        );
      }
    } catch (e) {
      console.log(e);
    }

    const result = await config.flightSuretyApp.getAirline.call(newAirline);
    const count = await config.flightSuretyApp.getTotalAirlines.call();

    // ASSERT
    assert.equal(result[1].toString(), "3", "Airline should be Rejected");
    assert.equal(
      count.toString(),
      "5",
      "Should have 5 airlines with approved status"
    );
  });
});
