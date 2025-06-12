document.getElementById('record').onclick = async () => {
    const fileInput = document.getElementById('fartFile');
    if (!fileInput.files.length) return alert('Select a fart file first.');
    const data = new FormData();
    data.append('fart', fileInput.files[0]);
    const res = await fetch('/record', { method: 'POST', body: data });
    const out = await res.json();
    document.getElementById('output').textContent = JSON.stringify(out, null, 2);
    if (out.transaction) document.getElementById('share').disabled = false;
};

// Web3Auth basic setup
const initWeb3Auth = async () => {
    const web3auth = new window.Web3Auth.Web3Auth({
        clientId: 'YOUR_WEB3AUTH_CLIENT_ID', // replace with real id
        chainConfig: { chainNamespace: 'eip155', chainId: '0x1' }
    });
    await web3auth.initModal();
};

if (window.Web3Auth) initWeb3Auth();

// Cycle through themes
const themes = [
    { bg: '#e0e0e0', gradient: 'linear-gradient(145deg, #f9a602, #1e90ff)' },
    { bg: '#1f1f1f', gradient: 'linear-gradient(145deg, #ff8c00, #0044ff)' },
    { bg: '#000', gradient: 'linear-gradient(145deg, #ffa500, #00f)' },
    { bg: '#222', gradient: 'linear-gradient(145deg, #ff9900, #0066ff)' }
];

let themeIndex = 0;
const applyTheme = () => {
    const t = themes[themeIndex % themes.length];
    document.body.style.background = t.bg;
    document.querySelectorAll('button, .deploy-buttons a').forEach(el => {
        el.style.background = t.gradient;
    });
    themeIndex++;
};

const makeArt = () => {
    const art = document.getElementById('landing-art');
    for (let i = 0; i < 6; i++) {
        const s = document.createElement('span');
        s.style.left = Math.random() * 100 + 'vw';
        s.style.bottom = '-' + Math.random() * 20 + 'vh';
        s.style.animationDelay = (Math.random() * 5) + 's';
        art.appendChild(s);
    }
};

makeArt();

setTimeout(applyTheme, 30000); // after 30s
setTimeout(applyTheme, 180000); // after 3m

document.getElementById('share').onclick = async () => {
    const outText = document.getElementById('output').textContent;
    if (!outText) return;
    const info = JSON.parse(outText);
    const res = await fetch('/share', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ pubkey: info.transaction ? info.transaction : '' })
    });
    const out = await res.json();
    document.getElementById('output').textContent = JSON.stringify(out, null, 2);
};

document.getElementById('replica').onclick = async () => {
    const res = await fetch('/replica', { method: 'POST' });
    const out = await res.json();
    document.getElementById('output').textContent = JSON.stringify(out, null, 2);
};
