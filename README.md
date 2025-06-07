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

Create a `.env` file with:

```
TAX_WALLET=<your-solana-address>
SOLANA_CLUSTER=devnet
```

Then run tests with:

```bash
npm test
```
