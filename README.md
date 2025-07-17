# Fart-to-MIDI DApp

This project converts uploaded fart audio into simple MIDI notes and posts a small tax transaction on Solana. Share your creation to receive a testnet airdrop and spawn replicas for friends.

## Deploy

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/youruser/fart-to-midi-dapp)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/youruser/fart-to-midi-dapp)

The app binds to `0.0.0.0` so it can run on platforms like HuggingFace Spaces.

## Development

```bash
npm install
npm start
```

## DoctorEscrow & Healthcare Chaincode

This repo also includes experimental smart contracts for a decentralized healthcare workflow. The `solidity` folder contains `DoctorEscrow.sol`, a Solidity escrow contract that distributes patient deposits once 300 doctors confirm a diagnosis. The `chaincode` folder holds a Hyperledger Fabric chaincode implementation to store patient records privately.

To compile the Solidity contract:
```bash
npm install --global hardhat
npx hardhat compile --sources solidity
```

To bring up a local Fabric network and deploy the chaincode:
```bash
cd fabric-network
bash bc-network.sh
```
These scripts are provided as examples and require Docker and Fabric binaries installed locally.
