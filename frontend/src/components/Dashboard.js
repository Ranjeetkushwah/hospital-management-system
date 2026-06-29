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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { timeZone: 'UTC' });
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '4rem 0' }}>
        <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.firstName} {user?.lastName}!</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here is your schedule and appointment summary.</p>
        </div>
        <span className="role-tag">{user?.role}</span>
      </div>
      
      <div className="grid grid-3 mt-3">
        <div className="card">
          <h3>Total Appointments</h3>
          <p className="stats-num" style={{ color: '#60a5fa' }}>
            {stats.totalAppointments}
          </p>
        </div>
        
        <div className="card">
          <h3>Upcoming Slots</h3>
          <p className="stats-num" style={{ color: '#34d399' }}>
            {stats.upcomingAppointments}
          </p>
        </div>
        
        <div className="card">
          <h3>Cancelled / Completed</h3>
          <p className="stats-num" style={{ color: '#f87171' }}>
            {stats.cancelledAppointments} / {stats.completedAppointments}
          </p>
        </div>
      </div>

      <div className="card mt-3">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Recent Appointments</h2>
        {recentAppointments.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem 0' }}>No appointments scheduled.</p>
        ) : (
          <div className="table-container">
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
                        : `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
