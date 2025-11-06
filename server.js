const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock data para demostración
const teams = [
  { id: 1, name: 'Lakers', city: 'Los Angeles', players: 12 },
  { id: 2, name: 'Warriors', city: 'Golden State', players: 15 },
  { id: 3, name: 'Bulls', city: 'Chicago', players: 13 }
];

const players = [
  { id: 1, name: 'LeBron James', team: 'Lakers', position: 'Forward', points: 25.3 },
  { id: 2, name: 'Stephen Curry', team: 'Warriors', position: 'Guard', points: 29.5 },
  { id: 3, name: 'DeMar DeRozan', team: 'Bulls', position: 'Guard', points: 22.1 }
];

const games = [
  { id: 1, homeTeam: 'Lakers', awayTeam: 'Warriors', homeScore: 108, awayScore: 112, date: '2024-11-01' },
  { id: 2, homeTeam: 'Bulls', awayTeam: 'Lakers', homeScore: 95, awayScore: 103, date: '2024-11-03' }
];

// API Routes
app.get('/api/teams', (req, res) => {
  res.json(teams);
});

app.get('/api/players', (req, res) => {
  res.json(players);
});

app.get('/api/games', (req, res) => {
  res.json(games);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Basketball Scoreboard API is running!' });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🏀 Basketball Scoreboard Server running on port ${PORT}`);
  console.log(`🌐 Access the application at: http://localhost:${PORT}`);
});

module.exports = app;
