# Fart-to-MIDI DApp

This repository is now called **fart-to-midi-dapp**. It turns uploaded audio into MIDI notes and posts a small tax transaction on Solana. Share your creation to receive a testnet airdrop and spawn replicas for friends.

## Deploy

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/youruser/fart-to-midi-dapp)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/youruser/fart-to-midi-dapp&branch=main)

The app binds to `0.0.0.0` so it can run on platforms like HuggingFace Spaces.
Netlify assumes a `master` branch. The deploy link above specifies `branch=main` so the build can fetch this repository correctly.

The interface sports an orange and dark blue neomorphic design with floating geometric shapes generated in the browser.

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

Edit `public/script.js` and replace `YOUR_WEB3AUTH_CLIENT_ID` with the client ID from [Web3Auth](https://web3auth.io) if you want wallet login support.
Set `PORT` in your environment to override the default `7860` when running on platforms like HuggingFace Spaces.

Then run tests with:

```bash
npm test
```

## GitHub Pages

To deploy the static UI to GitHub Pages:

```bash
npm run deploy
```

This uses the [gh-pages](https://github.com/tschaub/gh-pages) package to publish the `public` folder.

## HuggingFace Spaces

The server binds to `0.0.0.0` and can be launched in a [HuggingFace Space](https://huggingface.co/spaces) for free hosting.
Simply create a new Space, select "Node.js" as the runtime, and point it at this repository.
