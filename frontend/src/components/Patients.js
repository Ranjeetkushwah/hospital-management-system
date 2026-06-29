import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Patients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'doctor') {
      setError('Access denied. Only doctors can view patients.');
      setLoading(false);
      return;
    }
    fetchPatients();
  }, [user]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/users/patients');
      setPatients(response.data);
    } catch (error) {
      setError('Failed to fetch patients');
      console.error('Error fetching patients:', error);
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
        <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Loading Patients...</div>
      </div>
    );
  }

  if (user?.role !== 'doctor') {
    return (
      <div className="card text-center" style={{ padding: '3rem' }}>
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)' }}>Only doctors can view patient information.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Patients Directory</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      {patients.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No patients registered yet.</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient._id}>
                    <td>{patient.firstName} {patient.lastName}</td>
                    <td>{patient.email}</td>
                    <td>{patient.phone}</td>
                    <td>{formatDate(patient.dateOfBirth)}</td>
                    <td style={{ textTransform: 'capitalize' }}>{patient.gender}</td>
                    <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
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

export default Patients;
  