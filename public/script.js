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
