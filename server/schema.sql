CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150),
  phone VARCHAR(20),
  category VARCHAR(50),
  location VARCHAR(200)
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  payer_id INT REFERENCES payers(id),
  amount DECIMAL(12,2),
  method VARCHAR(20),
  reference VARCHAR(100),
  category VARCHAR(50),
  recorded_by INT REFERENCES users(id),
  paid_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE receipts (
  id SERIAL PRIMARY KEY,
  payment_id INT REFERENCES payments(id),
  receipt_number VARCHAR(50) UNIQUE,
  issued_at TIMESTAMP DEFAULT NOW()
);