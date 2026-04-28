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
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (user?.role !== 'doctor') {
    return (
      <div className="card">
        <h2>Access Denied</h2>
        <p>Only doctors can view patient information.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Patients</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      {patients.length === 0 ? (
        <div className="card">
          <p>No patients registered yet.</p>
        </div>
      ) : (
        <div className="card">
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
                  <td>{patient.gender}</td>
                  <td>{formatDate(patient.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Patients;
