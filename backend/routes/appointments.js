const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Book appointment
router.post('/book', auth, async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({ message: 'Doctor not found' });
    }

    // Check for existing appointment at same time
    const existingAppointment = await Appointment.findOne({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Appointment already booked at this time' });
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel appointment
router.put('/cancel/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is the patient or doctor
    if (appointment.patient.toString() !== req.user._id.toString() && 
        appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();
    await appointment.populate('patient', 'firstName lastName email phone');
    await appointment.populate('doctor', 'firstName lastName specialization phone');

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments (for logged-in user)
router.get('/my', auth, async (req, res) => {
  try {
    let appointments;
    
    if (req.user.role === 'patient') {
      appointments = await Appointment.find({ patient: req.user._id })
        .populate('doctor', 'firstName lastName specialization phone')
        .sort({ appointmentDate: -1 });
    } else if (req.user.role === 'doctor') {
      appointments = await Appointment.find({ doctor: req.user._id })
        .populate('patient', 'firstName lastName email phone dateOfBirth gender')
        .sort({ appointmentDate: -1 });
    }

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments (admin view)
router.get('/all', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization phone')
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName email phone dateOfBirth gender')
      .populate('doctor', 'firstName lastName specialization phone');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is the patient or doctor
    if (appointment.patient._id.toString() !== req.user._id.toString() && 
        appointment.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
