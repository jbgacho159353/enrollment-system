# School Enrollment System

A modern, full-stack school enrollment management system built with React, Node.js, Express, Sequelize, and MySQL.

## Features
- JWT-based authentication (Admin & Registrar roles)
- Dashboard with live statistics and enrollment chart
- Student management (CRUD with pagination & search)
- Course management (CRUD)
- Enrollment management (link students to courses)
- Responsive, modern UI inspired by professional dashboard designs

## Tech Stack
- **Frontend**: React 18, React Router v6, Axios, Chart.js
- **Backend**: Node.js, Express.js, Sequelize ORM
- **Database**: MySQL 8
- **Auth**: JWT + bcryptjs

## Quick Start

### Prerequisites
- Node.js v16+
- MySQL 8+

### 1. Setup Database
```bash
mysql -u root -p
source SQL/enrollment_system.sql
```

### 2. Configure Backend
```bash
cp .env.example backend/.env
# Fill in your DB credentials and JWT_SECRET in backend/.env
```

### 3. Install & Seed
```bash
npm run install:all
npm run seed
```

### 4. Run Development Servers
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Default Login:**
| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Registrar | registrar | registrar123 |

## Project Structure
```
enrollment-system/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/auth.js
│   ├── models/
│   ├── routes/
│   ├── seeders/seed.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/AuthContext.jsx
│       ├── pages/
│       ├── services/api.js
│       ├── App.jsx
│       └── App.css
├── SQL/
│   └── enrollment_system.sql
├── .env.example
├── skills.md
├── CLAUDE.md
└── README.md
```

## API Reference
See `CLAUDE.md` for full API endpoint documentation.

## License
MIT
