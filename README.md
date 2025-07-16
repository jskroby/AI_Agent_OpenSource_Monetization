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

## Windsurf Agent

This repository includes an experimental script `windsurf.js` that implements an infinite self-correcting loop. It aims to keep CPU and memory usage low while running indefinitely.
Run it with Node.js (preferably with `--expose-gc` to enable manual garbage collection):

```bash
node --expose-gc windsurf.js
```
