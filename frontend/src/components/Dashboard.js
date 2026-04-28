import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/appointments/my');
      const appointments = response.data;
      
      // Calculate stats
      const stats = appointments.reduce((acc, appointment) => {
        acc.totalAppointments++;
        if (appointment.status === 'scheduled') {
          acc.upcomingAppointments++;
        } else if (appointment.status === 'completed') {
          acc.completedAppointments++;
        } else if (appointment.status === 'cancelled') {
          acc.cancelledAppointments++;
        }
        return acc;
      }, {
        totalAppointments: 0,
        upcomingAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0
      });

      setStats(stats);
      
      // Get recent appointments (last 5)
      const recent = appointments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      setRecentAppointments(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
      <h1>Welcome, {user?.firstName} {user?.lastName}!</h1>
      <p>Role: {user?.role}</p>
      
      <div className="grid grid-3 mt-3">
        <div className="card">
          <h3>Total Appointments</h3>
          <p className="text-center" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>
            {stats.totalAppointments}
          </p>
        </div>
        
        <div className="card">
          <h3>Upcoming</h3>
          <p className="text-center" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>
            {stats.upcomingAppointments}
          </p>
        </div>
        
        <div className="card">
          <h3>Completed</h3>
          <p className="text-center" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8e44ad' }}>
            {stats.completedAppointments}
          </p>
        </div>
      </div>

      <div className="card mt-3">
        <h2>Recent Appointments</h2>
        {recentAppointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>{user?.role === 'doctor' ? 'Patient' : 'Doctor'}</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{formatDate(appointment.appointmentDate)}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>
                    {user?.role === 'doctor' 
                      ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                      : `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                    }
                  </td>
                  <td>{appointment.reason}</td>
                  <td>
                    <span className={`status-badge status-${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
