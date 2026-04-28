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
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h1>My Appointments</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      {appointments.length === 0 ? (
        <div className="card mb-10">
          <p>No appointments found.</p>
          <a href="/book-appointment" className="btn btn-primary">Book an Appointment</a>
        </div>
      ) : (
        <div className="card">
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
                    {user?.role === 'patient' && (
                      <br />
                    )}
                    {user?.role === 'patient' && (
                      <small style={{ color: '#666' }}>
                        {appointment.doctor.specialization}
                      </small>
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
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      >
                        Cancel
                      </button>
                    )}
                    {appointment.status === 'cancelled' && (
                      <span style={{ color: '#666', fontSize: '0.875rem' }}>
                        Cancelled
                      </span>
                    )}
                    {appointment.status === 'completed' && (
                      <span style={{ color: '#27ae60', fontSize: '0.875rem' }}>
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;
