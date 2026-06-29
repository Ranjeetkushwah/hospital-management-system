import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments/my');
      setAppointments(response.data);
    } catch (error) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.put(`/api/appointments/cancel/${appointmentId}`);
      
      // Update the appointment in the list
      setAppointments(appointments.map(appointment => 
        appointment._id === appointmentId 
          ? { ...appointment, status: 'cancelled' }
          : appointment
      ));
      
      alert('Appointment cancelled successfully');
    } catch (error) {
      alert('Failed to cancel appointment');
      console.error('Error cancelling appointment:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { timeZone: 'UTC' });
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '4rem 0' }}>
        <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Loading Appointments...</div>
      </div>
    );
  }

  return (
    <div>
      <h1>My Appointments</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      {appointments.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem 1.5rem' }}>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>No appointments found in the system.</p>
          {user?.role === 'patient' && (
            <a href="/book-appointment" className="btn btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              Book an Appointment
            </a>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>{user?.role === 'doctor' ? 'Patient' : 'Doctor'}</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{formatDate(appointment.appointmentDate)}</td>
                    <td>{appointment.appointmentTime}</td>
                    <td>
                      {user?.role === 'doctor' 
                        ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                        : `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                      }
                      {user?.role === 'patient' && appointment.doctor.specialization && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {appointment.doctor.specialization}
                        </div>
                      )}
                    </td>
                    <td>{appointment.reason}</td>
                    <td>
                      <span className={`status-badge status-${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => handleCancelAppointment(appointment._id)}
                          className="btn btn-danger"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: '6px' }}
                        >
                          Cancel
                        </button>
                      )}
                      {appointment.status === 'cancelled' && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Cancelled
                        </span>
                      )}
                      {appointment.status === 'completed' && (
                        <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
