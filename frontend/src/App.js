import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BookAppointment from './components/BookAppointment';
import Appointments from './components/Appointments';
import Doctors from './components/Doctors';
import Patients from './components/Patients';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="App">
      {user && <Navbar />}
      <div className="container">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/book-appointment" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
