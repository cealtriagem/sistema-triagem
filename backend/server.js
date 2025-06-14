// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const triagemRoutes = require('./routes/triagemRoutes');

const app = express();
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', userRoutes);
app.use('/api/triagens', triagemRoutes);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const jwtSecret = process.env.JWT_SECRET || 'secreta123';

function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/api/usuarios/login', async (req, res) => {
  const { email, senha } = req.body;
  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND senha = $2', [email, senha]);
  if (result.rows.length > 0) {
    const token = jwt.sign({ id: result.rows[0].id }, jwtSecret);
    res.json({ token });
  } else {
    res.status(401).send('Credenciais inválidas');
  }
});

app.post('/api/usuarios', async (req, res) => {
  const { email, senha } = req.body;
  await pool.query('INSERT INTO usuarios (email, senha) VALUES ($1, $2)', [email, senha]);
  res.sendStatus(201);
});

app.get('/api/triagens', authMiddleware, async (req, res) => {
  const result = await pool.query('SELECT * FROM triagens');
  res.json(result.rows);
});

app.post('/api/triagens', authMiddleware, async (req, res) => {
  const {
    nome_assitido, status_cobertor, status_camisa, tam_camisa
  } = req.body;

  await pool.query(
    `INSERT INTO triagens (
      nome_assitido, status_cobertor, status_camisa, tam_camisa
    ) VALUES ($1, $2, $3, $4)`,
    [nome_assitido, status_cobertor, status_camisa, tam_camisa]
  );

  res.sendStatus(201);
});

app.listen(PORT, () => {
  console.log('Backend rodando na porta', PORT);
});



