const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const router = express.Router();

// Get all patients
router.get('/patients', auth, asyncHandler(async (req, res, next) => {
  // Only doctors can access patient directory
  if (req.user.role !== 'doctor') {
    return next(new AppError('Access denied. Only doctors can view patients list.', 403));
  }

  const patients = await User.find({ role: 'patient' })
    .select('-password')
    .sort({ createdAt: -1 });
  res.json(patients);
}));

// Get all doctors
router.get('/doctors', auth, asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: 'doctor' })
    .select('-password')
    .sort({ createdAt: -1 });
  res.json(doctors);
}));

// Get user by ID
router.get('/:id', auth, asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  res.json(user);
}));

module.exports = router;
