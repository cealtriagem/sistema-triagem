const pool = require('../db');

exports.criar = async (req, res) => {
  const dados = req.body;
  try {
    const keys = Object.keys(dados);
    const values = Object.values(dados);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO triagens (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).send('Erro ao criar triagem: ' + err.message);
  }
};

exports.listar = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM triagens ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Erro ao listar triagens: ' + err.message);
  }
};

exports.obter = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM triagens WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Erro ao obter triagem: ' + err.message);
  }
};

exports.atualizar = async (req, res) => {
  const dados = req.body;
  try {
    const keys = Object.keys(dados);
    const values = Object.values(dados);
    const updates = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const query = `UPDATE triagens SET ${updates} WHERE id = $${keys.length + 1} RETURNING *`;
    const result = await pool.query(query, [...values, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).send('Erro ao atualizar triagem: ' + err.message);
  }
};

exports.deletar = async (req, res) => {
  try {
    await pool.query('DELETE FROM triagens WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).send('Erro ao deletar triagem: ' + err.message);
  }
};