const router = require('express').Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const { User } = require('../models');

router.get('/', auth, async (_req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] }, order: [['user_id', 'ASC']] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const exists = await User.findOne({ where: { username } });
    if (exists) return res.status(400).json({ message: 'Username already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, role: role || 'registrar' });
    res.status(201).json({ user_id: user.user_id, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { username, password, role } = req.body;
    if (username && username !== user.username) {
      const exists = await User.findOne({ where: { username } });
      if (exists) return res.status(400).json({ message: 'Username already exists' });
      user.username = username;
    }
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;
    await user.save();
    res.json({ user_id: user.user_id, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
