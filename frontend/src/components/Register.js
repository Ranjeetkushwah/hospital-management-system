import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'patient',
    firstName: '',
    lastName: '',
    phone: '',
    specialization: '',
    experience: '',
    dateOfBirth: '',
    gender: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2 className="text-center mb-3">Register</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Role</label>
          <select className="form-control" name="role" value={formData.role} onChange={handleChange}
          style={{
              color: "black",
              cursor: "pointer",
              backgroundColor: "#ffff"
            }}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              placeholder='Enter your first name'
              value={formData.firstName}
              onChange={handleChange}
              required
              style={{
              color: "black",
              cursor: "pointer",
              backgroundColor: "#ffff"
            }}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              placeholder='Enter your last name'
              value={formData.lastName}
              onChange={handleChange}
              required
              style={{
              color: "black",
              cursor: "pointer",
              backgroundColor: "#ffff"
            }}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            placeholder='Enter your username'
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              color: "black",
              cursor: "pointer",
              backgroundColor: "#ffff"
            }}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='Enter your email'
            required
            style={{
              color: "black",
              cursor: "pointer",
              backgroundColor: "#ffff"
            }}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            placeholder='Enter your phone number'
            value={formData.phone}
            onChange={handleChange}
            required
            style={{
              color: "black",
              cursor: "pointer",
              backgroundColor: "#ffff"
            }}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              name="password"
              placeholder='Enter your password'
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              style={{
                paddingRight: '3rem',
                color: "black",
                cursor: "pointer",
                backgroundColor: "#ffff"
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {formData.role === 'doctor' ? (
          <>
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <input
                type="text"
                className="form-control"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                placeholder='Enter your specialization'
                style={{
                  color: "black",
                  cursor: "pointer",
                  backgroundColor: "#ffff"
                }}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Experience (years)</label>
              <input
                type="number"
                className="form-control"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                placeholder='Enter your experience'
                style={{
                  color: "black",
                  cursor: "pointer",
                  backgroundColor: "#ffff"
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                placeholder='Enter your date of birth'
                style={{
                  color: "black",
                  cursor: "pointer",
                  backgroundColor: "#ffff"
                }}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-control" name="gender" value={formData.gender} onChange={handleChange}
                 style={{
                  color: "black",
                  cursor: "pointer",
                  backgroundColor: "#ffff"
                }}
              required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        )}
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <p className="text-center mt-3">
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default Register;
