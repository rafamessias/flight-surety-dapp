const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");

module.exports = async function (deployer) {
  await deployer.deploy(FlightSuretyData);
  await deployer.deploy(FlightSuretyApp, FlightSuretyData.address);

  // adding App as an authorized caller
  const flightSuretyData = await FlightSuretyData.at(FlightSuretyData.address);
  await flightSuretyData.authorizeCaller(FlightSuretyApp.address);
};
