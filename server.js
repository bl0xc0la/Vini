const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Serve the flat frontend files directly from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store for tracking development releases
let releases = [
  { 
    id: '1', 
    title: 'Alpha Wave', 
    artist: 'Sola', 
    genre: 'Electronic / Synthwave', 
    duration: '3:30', 
    status: 'Pending', 
    date: '2026-05-23',
    notes: '' 
  },
  { 
    id: '2', 
    title: 'Sub-Zero Resonance', 
    artist: 'Vini Core', 
    genre: 'Industrial / Techno', 
    duration: '4:12', 
    status: 'Approved', 
    date: '2026-05-22',
    notes: 'DDEX delivery complete.' 
  }
];

// GET: Fetch all active catalog entries
app.get('/api/releases', (req, res) => {
  res.json(releases);
});

// POST: Accept new track submissions from the Artist Gateway
app.post('/api/releases', (req, res) => {
  const { title, artist, genre, duration } = req.body;
  
  if (!title || !artist) {
    return res.status(400).json({ error: 'Missing mandatory tracking parameters.' });
  }

  const newRelease = {
    id: String(releases.length + 1),
    title,
    artist,
    genre,
    duration,
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  };

  releases.unshift(newRelease);
  res.status(201).json(newRelease);
});

// PATCH: Approve release asset for distribution pipelines
app.patch('/api/releases/:id/approve', (req, res) => {
  const targetId = req.params.id;
  const release = releases.find(r => r.id === targetId);

  if (!release) return res.status(404).json({ error: 'Release entry mapping not found.' });

  release.status = 'Approved';
  release.notes = 'Authorized for active distribution.';
  res.json(release);
});

// PATCH: Reject asset and attach formal administrative feedback
app.patch('/api/releases/:id/reject', (req, res) => {
  const targetId = req.params.id;
  const { reason } = req.body;
  const release = releases.find(r => r.id === targetId);

  if (!release) return res.status(404).json({ error: 'Release entry mapping not found.' });

  release.status = 'Rejected';
  release.notes = reason || 'Failed structural requirements.';
  res.json(release);
});

// Fallback route ensures the single page application boots correctly
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`VINI core operational hub hosted on port ${PORT}`);
});
