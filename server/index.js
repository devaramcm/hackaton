const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, 'registrations.json');

app.use(cors());
app.use(express.json());

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Ensure file exists
if (!fs.existsSync(DATA_FILE)) {
  writeData([]);
}

app.get('/api/registrations', (req, res) => {
  const regs = readData();
  res.json(regs);
});

app.post('/api/registrations', (req, res) => {
  try {
    const { role, name, email, region } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email required' });

    const regs = readData();
    const item = {
      id: Date.now(),
      role: role || 'farmer',
      name,
      email,
      region: region || '',
      createdAt: new Date().toISOString()
    };
    regs.push(item);
    writeData(regs);
    res.status(201).json(item);
  } catch (err) {
    console.error('Failed to save registration', err);
    res.status(500).json({ error: 'failed to save' });
  }
});

app.listen(PORT, () => {
  console.log(`AgriBridge backend listening on http://localhost:${PORT}`);
});
