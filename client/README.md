# Mombasa County Revenue Collection System

A digital revenue collection and management system for Mombasa County Government. Built to replace manual paper-based collection with a fast, transparent, and auditable platform.

## Features

- Record payments for Business Permits, Land Rates, Market Stalls and Parking Fees
- Support for Cash, M-Pesa and Bank Transfer payments
- Real-time revenue dashboard with charts
- Payer registration and management
- PDF receipt generation
- Admin login with JWT authentication
- Revenue reports by category and payment method

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Authentication | JWT + bcryptjs |
| Charts | Recharts |
| Payments | M-Pesa Daraja API |

## Getting Started

### Requirements
- Node.js v18+
- PostgreSQL 18
- Git

### Installation

1. Clone the repository
   git clone https://github.com/leviupendo/-mombasa-revenue-collection.git
   cd -mombasa-revenue-collection

2. Set up the database
   psql -U postgres -c "CREATE DATABASE mombasa_revenue;"
   psql -U postgres -d mombasa_revenue -f server/schema.sql

3. Configure environment variables
   cd server
   cp .env.example .env
   Edit .env with your PostgreSQL password and JWT secret

4. Install and run the backend
   cd server
   npm install
   node index.js

5. Install and run the frontend
   cd client
   npm install
   npm start

6. Open your browser at http://localhost:3000

### Default Admin Login
- Email: admin@mombasa.go.ke
- Password: admin123

## Project Structure

mombasa-revenue-collection/
├── client/          React frontend
│   └── src/
│       └── pages/
│           ├── Login.jsx
│           └── Dashboard.jsx
├── server/          Node.js backend
│   ├── routes/
│   │   ├── auth.js
│   │   ├── payments.js
│   │   └── payers.js
│   ├── db.js
│   ├── index.js
│   └── schema.sql
└── README.md

## Revenue Categories

- Market Stall Fees — daily and monthly stall charges
- Parking Fees — hourly and daily parking
- Land Rates — annual land and rent charges
- Business Permits — annual business licensing

## License
MIT License — Mombasa County Government 2026