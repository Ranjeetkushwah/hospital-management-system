const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const router = express.Router();

// Register user
router.post('/register', asyncHandler(async (req, res, next) => {
  const {
    username,
    email,
    password,
    role,
    firstName,
    lastName,
    phone,
    specialization,
    experience,
    dateOfBirth,
    gender
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return next(new AppError('User already exists with this username or email', 400));
  }

  // Create new user
  const userData = {
    username,
    email,
    password,
    role,
    firstName,
    lastName,
    phone
  };

  // Add role-specific fields
  if (role === 'doctor') {
    userData.specialization = specialization;
    userData.experience = experience;
  } else {
    userData.dateOfBirth = dateOfBirth;
    userData.gender = gender;
  }

  const user = new User(userData);
  await user.save();

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

  res.status(201).json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    }
  });
}));

// Login user (supports username or email)
router.post('/login', asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Please provide username/email and password', 400));
  }

  // Check if user exists (by username or email)
  const user = await User.findOne({ 
    $or: [{ username }, { email: username.toLowerCase() }] 
  });
  
  if (!user) {
    return next(new AppError('Invalid credentials', 400));
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError('Invalid credentials', 400));
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    }
  });
}));

// Get current user
router.get('/me', auth, asyncHandler(async (req, res) => {
  res.json(req.user);
}));

module.exports = router;
