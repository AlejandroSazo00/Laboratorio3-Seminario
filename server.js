const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'basketball-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== SISTEMA DE PERSISTENCIA =====
const DATA_FILE = path.join(__dirname, 'data.json');

// Datos por defecto
const defaultData = {
  users: [
    { 
      id: 1, 
      username: 'admin', 
      password: 'hello',
      role: 'admin',
      email: 'admin@basketball.com'
    },
    { 
      id: 2, 
      username: 'coach', 
      password: 'hello',
      role: 'coach',
      email: 'coach@basketball.com'
    },
    { 
      id: 3, 
      username: 'user', 
      password: 'hello',
      role: 'user',
      email: 'user@basketball.com'
    }
  ],
  teams: [
    { id: 1, name: 'Lakers', city: 'Los Angeles', players: 12, wins: 45, losses: 20, coach: 'Frank Vogel', founded: 1947 },
    { id: 2, name: 'Warriors', city: 'Golden State', players: 15, wins: 50, losses: 15, coach: 'Steve Kerr', founded: 1946 },
    { id: 3, name: 'Bulls', city: 'Chicago', players: 13, wins: 35, losses: 30, coach: 'Billy Donovan', founded: 1966 },
    { id: 4, name: 'Celtics', city: 'Boston', players: 14, wins: 42, losses: 23, coach: 'Joe Mazzulla', founded: 1946 },
    { id: 5, name: 'Heat', city: 'Miami', players: 13, wins: 38, losses: 27, coach: 'Erik Spoelstra', founded: 1988 }
  ],
  players: [
    { id: 1, name: 'LeBron James', team: 'Lakers', position: 'Forward', points: 25.3, assists: 7.2, rebounds: 7.8, age: 39 },
    { id: 2, name: 'Stephen Curry', team: 'Warriors', position: 'Guard', points: 29.5, assists: 6.1, rebounds: 4.2, age: 35 },
    { id: 3, name: 'DeMar DeRozan', team: 'Bulls', position: 'Guard', points: 22.1, assists: 4.8, rebounds: 5.1, age: 34 },
    { id: 4, name: 'Jayson Tatum', team: 'Celtics', position: 'Forward', points: 27.0, assists: 4.9, rebounds: 8.1, age: 25 },
    { id: 5, name: 'Jimmy Butler', team: 'Heat', position: 'Forward', points: 20.8, assists: 5.3, rebounds: 5.9, age: 34 },
    { id: 6, name: 'Anthony Davis', team: 'Lakers', position: 'Center', points: 24.7, assists: 3.5, rebounds: 12.6, age: 30 }
  ],
  games: [
    { id: 1, homeTeam: 'Lakers', awayTeam: 'Warriors', homeScore: 108, awayScore: 112, date: '2024-11-01', status: 'Completed' },
    { id: 2, homeTeam: 'Bulls', awayTeam: 'Lakers', homeScore: 95, awayScore: 103, date: '2024-11-03', status: 'Completed' },
    { id: 3, homeTeam: 'Celtics', awayTeam: 'Heat', homeScore: 118, awayScore: 102, date: '2024-11-05', status: 'Completed' },
    { id: 4, homeTeam: 'Warriors', awayTeam: 'Bulls', homeScore: 0, awayScore: 0, date: '2024-11-08', status: 'Scheduled' },
    { id: 5, homeTeam: 'Heat', awayTeam: 'Lakers', homeScore: 0, awayScore: 0, date: '2024-11-10', status: 'Scheduled' }
  ]
};

// Funciones de persistencia
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      console.log('📂 Datos cargados desde archivo');
      return data;
    } else {
      console.log('📂 Creando archivo de datos inicial');
      saveData(defaultData);
      return defaultData;
    }
  } catch (error) {
    console.error('❌ Error cargando datos:', error);
    return defaultData;
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('💾 Datos guardados exitosamente');
  } catch (error) {
    console.error('❌ Error guardando datos:', error);
  }
}

function saveAllData() {
  const data = { users, teams, players, games };
  saveData(data);
}

// Cargar datos al iniciar
const loadedData = loadData();
let users = loadedData.users;
let teams = loadedData.teams;
let players = loadedData.players;
let games = loadedData.games;

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
    req.user = user;
    next();
  });
};

// Middleware para verificar rol de administrador
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  next();
};

// Middleware para verificar rol de coach o admin
const requireCoachOrAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de entrenador o administrador.' });
  }
  next();
};

// ===== RUTAS DE AUTENTICACIÓN =====
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }
    
    const user = users.find(u => u.username === username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        email: user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        email: user.email 
      },
      message: 'Inicio de sesión exitoso'
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/auth/register', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, password, role = 'user', email } = req.body;
    
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Usuario, contraseña y email son requeridos' });
    }
    
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      role,
      email
    };
    
    users.push(newUser);
    saveAllData(); // Guardar cambios
    
    res.json({ 
      message: 'Usuario creado exitosamente', 
      user: { 
        id: newUser.id, 
        username: newUser.username, 
        role: newUser.role,
        email: newUser.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ===== RUTAS PÚBLICAS =====
app.get('/api/teams', (req, res) => {
  res.json(teams);
});

app.get('/api/players', (req, res) => {
  res.json(players);
});

app.get('/api/games', (req, res) => {
  res.json(games);
});

app.get('/api/stats', (req, res) => {
  const stats = {
    totalTeams: teams.length,
    totalPlayers: players.length,
    totalGames: games.length,
    completedGames: games.filter(g => g.status === 'Completed').length,
    scheduledGames: games.filter(g => g.status === 'Scheduled').length,
    averageScore: games.filter(g => g.status === 'Completed')
      .reduce((acc, game) => acc + game.homeScore + game.awayScore, 0) / 
      (games.filter(g => g.status === 'Completed').length * 2) || 0
  };
  res.json(stats);
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Basketball Scoreboard API is running!',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// ===== RUTAS PROTEGIDAS =====
app.post('/api/teams', authenticateToken, requireCoachOrAdmin, (req, res) => {
  try {
    const { name, city, coach, founded } = req.body;
    
    if (!name || !city) {
      return res.status(400).json({ error: 'Nombre y ciudad son requeridos' });
    }
    
    const newTeam = {
      id: teams.length + 1,
      name,
      city,
      players: 0,
      wins: 0,
      losses: 0,
      coach: coach || 'TBD',
      founded: founded || new Date().getFullYear()
    };
    
    teams.push(newTeam);
    saveAllData(); // Guardar cambios
    res.json(newTeam);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/players', authenticateToken, requireCoachOrAdmin, (req, res) => {
  try {
    const { name, team, position, age } = req.body;
    
    if (!name || !team || !position) {
      return res.status(400).json({ error: 'Nombre, equipo y posición son requeridos' });
    }
    
    const newPlayer = {
      id: players.length + 1,
      name,
      team,
      position,
      points: 0,
      assists: 0,
      rebounds: 0,
      age: age || 25
    };
    
    players.push(newPlayer);
    
    // Actualizar contador de jugadores del equipo
    const teamObj = teams.find(t => t.name === team);
    if (teamObj) {
      teamObj.players += 1;
    }
    
    saveAllData(); // Guardar cambios
    res.json(newPlayer);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  const safeUsers = users.map(user => ({
    id: user.id,
    username: user.username,
    role: user.role,
    email: user.email
  }));
  res.json(safeUsers);
});

// Cambiar contraseña
app.put('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' });
    }
    
    const user = users.find(u => u.id === req.user.id);
    
    if (!user || user.password !== currentPassword) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }
    
    user.password = newPassword;
    saveAllData(); // Guardar cambios
    
    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener credenciales actuales (para mostrar dinámicamente)
app.get('/api/credentials', (req, res) => {
  const credentials = users.map(user => ({
    username: user.username,
    password: user.password,
    role: user.role
  }));
  res.json(credentials);
});

// Crear partidos
app.post('/api/games', authenticateToken, requireCoachOrAdmin, (req, res) => {
  try {
    const { homeTeam, awayTeam, date, homeScore = 0, awayScore = 0 } = req.body;
    
    if (!homeTeam || !awayTeam || !date) {
      return res.status(400).json({ error: 'Equipo local, visitante y fecha son requeridos' });
    }
    
    if (homeTeam === awayTeam) {
      return res.status(400).json({ error: 'Un equipo no puede jugar contra sí mismo' });
    }
    
    const newGame = {
      id: games.length + 1,
      homeTeam,
      awayTeam,
      homeScore: parseInt(homeScore),
      awayScore: parseInt(awayScore),
      date,
      status: homeScore > 0 || awayScore > 0 ? 'Completed' : 'Scheduled',
      createdBy: req.user.username
    };
    
    games.push(newGame);
    saveAllData(); // Guardar cambios
    res.json(newGame);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar resultado de partido
app.put('/api/games/:id', authenticateToken, requireCoachOrAdmin, (req, res) => {
  try {
    const gameId = parseInt(req.params.id);
    const { homeScore, awayScore } = req.body;
    
    const game = games.find(g => g.id === gameId);
    
    if (!game) {
      return res.status(404).json({ error: 'Partido no encontrado' });
    }
    
    game.homeScore = parseInt(homeScore) || 0;
    game.awayScore = parseInt(awayScore) || 0;
    game.status = 'Completed';
    
    // Actualizar estadísticas de equipos
    const homeTeamObj = teams.find(t => t.name === game.homeTeam);
    const awayTeamObj = teams.find(t => t.name === game.awayTeam);
    
    if (homeTeamObj && awayTeamObj) {
      if (game.homeScore > game.awayScore) {
        homeTeamObj.wins += 1;
        awayTeamObj.losses += 1;
      } else if (game.awayScore > game.homeScore) {
        awayTeamObj.wins += 1;
        homeTeamObj.losses += 1;
      }
    }
    
    saveAllData(); // Guardar cambios
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Subir imagen de equipo (simulado con base64)
app.put('/api/teams/:id/image', authenticateToken, requireCoachOrAdmin, (req, res) => {
  try {
    const teamId = parseInt(req.params.id);
    const { imageData } = req.body;
    
    const team = teams.find(t => t.id === teamId);
    
    if (!team) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    
    team.image = imageData; // En producción, guardarías en un servicio de archivos
    team.hasImage = true;
    
    saveAllData(); // Guardar cambios
    res.json({ message: 'Imagen actualizada exitosamente', team });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🏀 Basketball Scoreboard Server running on port ${PORT}`);
  console.log(`🌐 Access the application at: http://localhost:${PORT}`);
  console.log(`🔐 Default credentials:`);
  console.log(`   Admin: admin / hello`);
  console.log(`   Coach: coach / hello`);
  console.log(`   User: user / hello`);
});

module.exports = app;
