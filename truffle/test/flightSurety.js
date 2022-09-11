const Test = require("./config/testConfig.js");
const BigNumber = require("bignumber.js");

contract("Flight Surety Tests", async (accounts) => {
  let config;
  //updatedTimestamp
  let updatedTimestamp = new Date();
  updatedTimestamp.setMonth(updatedTimestamp.getDate() + 2);
  updatedTimestamp = updatedTimestamp.getMilliseconds();

  //setting the funds
  const airlineFunds = web3.utils.toWei("0.000001", "ether");
  const customerFund = web3.utils.toWei("0.000001", "ether");

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
          value: airlineFunds,
        });
      }
    } catch (e) {
      console.log(e);
    }
    const result = await config.flightSuretyApp.getAirline.call(newAirline);

    // ASSERT
    assert.equal(
      result[2].toString(),
      airlineFunds.toString(),
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

  it("(Flight) Airline can register a flight", async () => {
    // ARRANGE
    const newAirline = accounts[2];

    // ACT
    try {
      for (let x = 1; x < 3; x++) {
        await config.flightSuretyApp.registerFlight.sendTransaction(
          `XYZ${x}`,
          updatedTimestamp,
          newAirline,
          {
            from: newAirline,
          }
        );
      }
    } catch (e) {
      console.log(e);
    }

    const result = await config.flightSuretyApp.getFlight.call(
      `XYZ${1}`,
      updatedTimestamp,
      newAirline
    );

    // ASSERT
    assert.equal(result[4], true, "Airline should register a flight");
  });

  it("(Customer) Can buy Insurance", async () => {
    // ARRANGE
    const customer = accounts[7];
    const airline = accounts[2];

    // ACT
    try {
      await config.flightSuretyApp.buyInsurance.sendTransaction(
        `XYZ1`,
        updatedTimestamp,
        airline,
        {
          from: customer,
          value: customerFund,
        }
      );
    } catch (e) {
      console.log(e);
    }

    const result = await config.flightSuretyApp.getCustomerInsurances.call(
      customer,
      { from: customer }
    );

    // ASSERT
    assert.equal(
      result[0][0],
      customerFund.toString(),
      "Customer should have an insurance"
    );
  });
});
