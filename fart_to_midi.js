const express = require('express');
const multer = require('multer');
const fs = require('fs');
const jsmidgen = require('jsmidgen');
require('dotenv').config();
const {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} = require('@solana/web3.js');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Solana setup
const cluster = process.env.SOLANA_CLUSTER || 'devnet';
const connection = new Connection(clusterApiUrl(cluster));
const TAX_WALLET = new PublicKey(process.env.TAX_WALLET || '11111111111111111111111111111111');

// Simple function to generate a MIDI file based on file length (placeholder)
function generateMidiFromAudio(path) {
  const fileSize = fs.statSync(path).size;
  const file = new jsmidgen.File();
  const track = new jsmidgen.Track();
  file.addTrack(track);

  for (let i = 0; i < Math.min(16, fileSize % 32); i++) {
    const note = 60 + (fileSize + i) % 12;
    track.addNote(0, jsmidgen.Util.midiPitchFromNote(note), 64);
  }
  const midiData = file.toBytes();
  const midiPath = path + '.mid';
  fs.writeFileSync(midiPath, midiData, 'binary');
  return midiPath;
}

async function sendTaxTransaction(payer) {
  const tx = new Transaction();
  tx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: TAX_WALLET, lamports: 5000 }));
  const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
  return sig;
}

app.post('/record', upload.single('fart'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No fart uploaded' });
  }
  const payer = Keypair.generate();
  const midiPath = generateMidiFromAudio(req.file.path);
  try {
    const sig = await sendTaxTransaction(payer);
    res.json({ midi: midiPath, transaction: sig });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/share', async (req, res) => {
  const { pubkey } = req.body;
  try {
    const airdropSig = await connection.requestAirdrop(new PublicKey(pubkey), 1e8); // 0.1 SOL
    res.json({ airdrop: airdropSig });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/replica', (req, res) => {
  res.json({ message: 'Replica created - share with your friends!' });
});

const PORT = process.env.PORT || 7860;
// Bind to 0.0.0.0 so the server works on platforms like HuggingFace Spaces
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () =>
    console.log(`Fart2Midi DApp running on port ${PORT}`)
  );
}

module.exports = app;
