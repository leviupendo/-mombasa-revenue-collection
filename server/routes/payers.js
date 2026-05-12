const router = require('express').Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM payers ORDER BY name');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { name, phone, category, location } = req.body;
  const result = await pool.query(
    'INSERT INTO payers (name, phone, category, location) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, phone, category, location]
  );
  res.json(result.rows[0]);
});

module.exports = router;