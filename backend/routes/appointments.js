const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const router = express.Router();

// Book appointment
router.post('/book', auth, asyncHandler(async (req, res, next) => {
  const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

  // Only patients can book appointments
  if (req.user.role !== 'patient') {
    return next(new AppError('Only patients can book appointments', 403));
  }

  // Check if doctor exists
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== 'doctor') {
    return next(new AppError('Doctor not found', 404));
  }

  // Check if doctor is already booked at this date and time
  const doctorBusy = await Appointment.findOne({
    doctor: doctorId,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    status: 'scheduled'
  });

  if (doctorBusy) {
    return next(new AppError('Doctor is already booked at this date and time', 400));
  }

  // Check if patient already has an appointment scheduled at this date and time
  const patientBusy = await Appointment.findOne({
    patient: req.user._id,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    status: 'scheduled'
  });

  if (patientBusy) {
    return next(new AppError('You already have another appointment scheduled at this date and time', 400));
  }

  // Create new appointment
  const appointment = new Appointment({
    patient: req.user._id,
    doctor: doctorId,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    reason
  });

  await appointment.save();
  await appointment.populate('patient', 'firstName lastName email phone');
  await appointment.populate('doctor', 'firstName lastName specialization phone');

  res.status(201).json(appointment);
}));

// Cancel appointment
router.put('/cancel/:id', auth, asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);
  
  if (!appointment) {
    return next(new AppError('Appointment not found', 404));
  }

  // Check if user is the patient or doctor
  if (appointment.patient.toString() !== req.user._id.toString() && 
      appointment.doctor.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to cancel this appointment', 403));
  }

  appointment.status = 'cancelled';
  await appointment.save();
  await appointment.populate('patient', 'firstName lastName email phone');
  await appointment.populate('doctor', 'firstName lastName specialization phone');

  res.json(appointment);
}));

// Get all appointments (for logged-in user)
router.get('/my', auth, asyncHandler(async (req, res, next) => {
  let appointments;
  
  if (req.user.role === 'patient') {
    appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'firstName lastName specialization phone')
      .sort({ appointmentDate: -1 });
  } else if (req.user.role === 'doctor') {
    appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'firstName lastName email phone dateOfBirth gender')
      .sort({ appointmentDate: -1 });
  } else {
    return next(new AppError('Role not recognized', 400));
  }

  res.json(appointments);
}));

// Get all appointments (admin view)
router.get('/all', auth, asyncHandler(async (req, res, next) => {
  // Only doctors can access all appointments list for administration
  if (req.user.role !== 'doctor') {
    return next(new AppError('Access denied. Only doctors can view all appointments.', 403));
  }

  const appointments = await Appointment.find()
    .populate('patient', 'firstName lastName email phone')
    .populate('doctor', 'firstName lastName specialization phone')
    .sort({ appointmentDate: -1 });
  res.json(appointments);
}));

// Get appointment by ID
router.get('/:id', auth, asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patient', 'firstName lastName email phone dateOfBirth gender')
    .populate('doctor', 'firstName lastName specialization phone');

  if (!appointment) {
    return next(new AppError('Appointment not found', 404));
  }

  // Check if user is the patient or doctor
  if (appointment.patient._id.toString() !== req.user._id.toString() && 
      appointment.doctor._id.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to view this appointment', 403));
  }

  res.json(appointment);
}));

module.exports = router;
