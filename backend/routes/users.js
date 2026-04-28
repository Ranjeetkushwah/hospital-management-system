const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all patients
router.get('/patients', auth, async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all doctors
router.get('/doctors', auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
