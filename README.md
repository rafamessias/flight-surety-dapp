# Flight Surety Dapp 

This Dapp is part of my journey to build a very solid Blockchain development skill

## How to use it

- 1 Configure ganache to generate 40 addresses with 1000 ethers each
- 2 Run ganache blockchain
- 3 On truffle folder, run truffle compile `truffle compile` and migrate `truffle migrate`
- 3 Run the oracle server services, go to oracle-server folder
  - Configure the env variable *MNEMONIC* with ganache mnemonic.
  - Run `npm run dev`
- 4 Run the client Dapp, go to dapp folder and run `npm run dev`
- 5 You can test the contracts via `truffle test` and test the Dapp via [http://localhost:3000](http://localhost:3000)

## What the App can do

You can:

- Set Operational contract control
- Register Authorized caller (in order to call Data contract)
- Register Airlines
- Register Flights
- Buy Insurance
- Verify the flight status
- Call Oracles to update flight status
- Withdraw the money

### Tech used

- Solidity ^0.8.8
- Truffle 5.5.21
- ReactJS 18.2.0
- NextJs 12.2.5
- tailwindcss ^3.1.8
- Web3.js 1.7.4
