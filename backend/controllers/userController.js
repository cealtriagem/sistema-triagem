const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

exports.registrar = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)',
      [nome, email, senhaHash]
    );
    res.status(201).send('Usuário registrado com sucesso');
  } catch (err) {
    res.status(400).send('Erro ao registrar: ' + err.message);
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const usuario = result.rows[0];
    if (usuario && await bcrypt.compare(senha, usuario.senha)) {
      const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).send('Credenciais inválidas');
    }
  } catch (err) {
    res.status(500).send('Erro no login: ' + err.message);
  }
};