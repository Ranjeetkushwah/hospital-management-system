import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Doctors = () => {
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
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h1>Available Doctors</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      {doctors.length === 0 ? (
        <div className="card">
          <p>No doctors available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="card">
              <div className="card-header">
                Dr. {doctor.firstName} {doctor.lastName}
              </div>
              <div className="card-body">
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Experience:</strong> {doctor.experience} years</p>
                <p><strong>Email:</strong> {doctor.email}</p>
                <p><strong>Phone:</strong> {doctor.phone}</p>
                <a href="/book-appointment" className="btn btn-primary mt-2">
                  Book Appointment
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
