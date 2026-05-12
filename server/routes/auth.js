const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (!user.rows.length) return res.status(400).json({ error: 'User not found' });
  const valid = await bcrypt.compare(password, user.rows[0].password_hash);
  if (!valid) return res.status(400).json({ error: 'Wrong password' });
  const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;