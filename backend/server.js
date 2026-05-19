const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { sequelize } = require('./config/db');
require('./models');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/users', require('./routes/users'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected.');
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err.message);
    process.exit(1);
  });
