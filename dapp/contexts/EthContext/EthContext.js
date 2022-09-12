import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import { reducer, actions, initialState } from "./state";

function EthContext() {
  const [state, dispatch] = useReducer(reducer, initialState);

  //create web3 objects to be used across the App
  const init = useCallback(async (artifactApp, artifactData) => {
    if (artifactApp) {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const accounts = await web3.eth.requestAccounts();
      const networkID = await web3.eth.net.getId();
      const { abi } = artifactApp;
      const { abi: abiData } = artifactData;
      let address, contract, addressData, contractData, isOperational;
      try {
        address = artifactApp.networks[networkID].address;
        addressData = artifactData.networks[networkID].address;

        contract = new web3.eth.Contract(abi, address);
        contractData = new web3.eth.Contract(abiData, addressData);
        isOperational = await checkIfContractIsOperational(
          contract,
          accounts[0]
        );
      } catch (err) {
        console.error(err);
      }
      dispatch({
        type: actions.init,
        data: {
          contract,
          contractData,
          web3,
          accounts,
          networkID,
          contract,
          isOperational,
        },
      });
    }
  }, []);

  const connectWallet = useCallback(() => {
    try {
      const artifactApp = require("contracts/FlightSuretyApp.json");
      const artifactData = require("contracts/FlightSuretyData.json");
      init(artifactApp, artifactData);
    } catch (error) {
      console.error(error);
    }
  }, [init]);

  //if wallet connected, init the state
  useEffect(() => {
    if (window?.ethereum !== undefined) {
      if (window.ethereum.isConnected()) connectWallet();
    }
  }, []);

  //handle events when metamask changes
  useEffect(() => {
    const events = ["chainChanged", "accountsChanged", "disconnect"];
    const handleChange = (e) => {
      dispatch({
        type: actions.init,
        data: initialState,
      });
    };

    if (window?.ethereum !== undefined)
      events.forEach((e) => window.ethereum.on(e, () => handleChange(e)));
    return () => {
      if (window?.ethereum !== undefined) {
        events.forEach((e) =>
          window.ethereum.removeListener(e, () => handleChange(e))
        );
      }
    };
  }, [init, state.artifact]);

  const checkIfContractIsOperational = async (contract, account) => {
    try {
      const result = await contract.methods
        .isOperational()
        .call({ from: account });

      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return {
    state,
    dispatch,
    connectWallet,
  };
}

export default EthContext;
