// backend/models/userModel.js
const { Pool } = require('pg');
const pool = new Pool();

module.exports = {
  async criarUsuario(email, senha) {
    await pool.query(
      'INSERT INTO usuarios (email, senha) VALUES ($1, $2)',
      [email, senha]
    );
  },

  async autenticar(email, senha) {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND senha = $2',
      [email, senha]
    );
    return result.rows[0];
  }
};
