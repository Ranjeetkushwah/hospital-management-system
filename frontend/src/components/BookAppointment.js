import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/users/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post('/api/appointments/book', formData);
      setSuccess('Appointment booked successfully!');
      
      // Reset form
      setFormData({
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: ''
      });
      
      // Redirect to appointments after 2 seconds
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots from 9:00 AM to 5:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="form-container">
      <h2 className="text-center mb-3">Book Appointment</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Select Doctor</label>
          <select
            className="form-control"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
          >
            <option value="">Choose a doctor...</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Appointment Date</label>
          <input
            type="date"
            className="form-control"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            min={today}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Appointment Time</label>
          <select
            className="form-control"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          >
            <option value="">Select time...</option>
            {generateTimeSlots().map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Reason for Appointment</label>
          <textarea
            className="form-control"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="4"
            placeholder="Please describe the reason for your appointment..."
            required
          ></textarea>
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
