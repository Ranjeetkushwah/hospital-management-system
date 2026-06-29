import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Doctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/users/doctors');
      setDoctors(response.data);
    } catch (error) {
      setError('Failed to fetch doctors');
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '4rem 0' }}>
        <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Loading Doctors...</div>
      </div>
    );
  }

  return (
    <div>
      <h1>Available Doctors</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      {doctors.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No doctors available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '0.5rem' }}>
                Dr. {doctor.firstName} {doctor.lastName}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#a5b4fc', fontWeight: 600, paddingLeft: '1px', marginBottom: '1.25rem' }}>
                {doctor.specialization}
              </div>
              <div className="card-body" style={{ flexGrow: 1, padding: 0 }}>
                <p><strong>Experience:</strong> {doctor.experience} years</p>
                <p><strong>Email:</strong> {doctor.email}</p>
                <p><strong>Phone:</strong> {doctor.phone}</p>
                
                {user?.role === 'patient' && (
                  <Link 
                    to="/book-appointment" 
                    className="btn btn-primary mt-3" 
                    style={{ width: '100%', textDecoration: 'none', textAlign: 'center', marginTop: '1.5rem' }}
                  >
                    Book Appointment
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
