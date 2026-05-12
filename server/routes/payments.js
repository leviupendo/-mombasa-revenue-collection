const router = require('express').Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  const { payer_id, amount, method, reference, category } = req.body;
  const result = await pool.query(
    'INSERT INTO payments (payer_id,amount,method,reference,category) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [payer_id, amount, method, reference, category]
  );
  res.json(result.rows[0]);
});

router.get('/', async (req, res) => {
  const result = await pool.query(
    'SELECT p.*, py.name as payer_name FROM payments p JOIN payers py ON p.payer_id=py.id ORDER BY paid_at DESC'
  );
  res.json(result.rows);
});

module.exports = router;