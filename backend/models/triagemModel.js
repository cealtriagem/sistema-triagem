// backend/models/triagemModel.js
const { Pool } = require('pg');
const pool = new Pool();

module.exports = {
  async listarTriagens() {
    const result = await pool.query('SELECT * FROM triagens ORDER BY data_presenca DESC');
    return result.rows;
  },

  async criarTriagem(data) {
    const campos = Object.keys(data);
    const valores = Object.values(data);
    const params = campos.map((_, i) => `$${i + 1}`);

    const query = `INSERT INTO triagens (${campos.join(', ')}) VALUES (${params.join(', ')})`;

    await pool.query(query, valores);
  }
};
