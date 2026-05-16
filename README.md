# -mombasa-revenue-collection
# Mombasa County Revenue Collection System

A digital revenue collection and management system for Mombasa County Government. Built to replace manual paper-based collection with a fast, transparent, and auditable platform.

## Features

- Record payments for Business Permits, Land Rates, Market Stalls and Parking Fees
- Support for Cash, M-Pesa and Bank Transfer payments
- Real-time revenue dashboard with charts
- Payer registration and management
- Admin login with JWT authentication
- Revenue reports by category and payment method

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js + Express |
| Database | PostgreSQL 18 |
| Authentication | JWT + bcryptjs |
| Charts | Recharts |

## Getting Started

### Requirements
- Node.js v18+
- PostgreSQL 18
- Git

### Installation

1. Clone the repository
2. Set up the database
3. Configure environment variables
Edit .env with your PostgreSQL password and JWT secret

4. Install and run the backend
5. Install and run the frontend
6. Open your browser at http://localhost:3000

## Default Admin Login
- Email: admin@mombasa.go.ke
- Password: admin123

## Revenue Categories
- Market Stall Fees
- Parking Fees
- Land Rates
- Business Permits

## License
MIT License
