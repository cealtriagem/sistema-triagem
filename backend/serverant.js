// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const triagemRoutes = require('./routes/triagemRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/usuarios', userRoutes);
app.use('/api/triagens', triagemRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});

