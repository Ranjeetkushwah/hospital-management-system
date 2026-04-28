import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          Hospital Appointment System
        </Link>
        
        <ul className="navbar-nav">
          <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
          <li><Link to="/book-appointment" className="nav-link">Book Appointment</Link></li>
          <li><Link to="/appointments" className="nav-link">My Appointments</Link></li>
          <li><Link to="/doctors" className="nav-link">Doctors</Link></li>
          {user?.role === 'doctor' && <li><Link to="/patients" className="nav-link">Patients</Link></li>}
          <li>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
