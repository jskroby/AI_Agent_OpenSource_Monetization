fetch('/api/dashboard')
  .then(r => r.json())
  .then(records => {
    const table = document.getElementById('records');
    records.forEach(r => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${r.id}</td><td><a href="/${r.midi}">${r.midi}</a></td>`;
      table.appendChild(row);
    });
  });
