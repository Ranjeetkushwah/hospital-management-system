# Hospital Appointment System

A full-stack hospital appointment management system built with React, Express, Node.js, and MongoDB.

## Features

- **User Authentication**: Register and login as patient or doctor
- **Role-based Access**: Different functionalities for patients and doctors
- **Appointment Management**: Book, view, and cancel appointments
- **User Management**: View all patients and doctors
- **Dashboard**: Overview of appointments and statistics

## Technologies Used

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```
hospital-management-system/
|-- backend/
|   |-- models/
|   |   |-- User.js
|   |   |-- Appointment.js
|   |-- routes/
|   |   |-- auth.js
|   |   |-- users.js
|   |   |-- appointments.js
|   |-- middleware/
|   |   |-- auth.js
|   |-- .env
|   |-- package.json
|   |-- server.js
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |   |-- Login.js
|   |   |   |-- Register.js
|   |   |   |-- Dashboard.js
|   |   |   |-- BookAppointment.js
|   |   |   |-- Appointments.js
|   |   |   |-- Doctors.js
|   |   |   |-- Patients.js
|   |   |   |-- Navbar.js
|   |   |-- context/
|   |   |   |-- AuthContext.js
|   |   |-- App.js
|   |   |-- index.js
|   |-- public/
|   |   |-- index.html
|   |-- package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (installed and running)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital-appointment
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/patients` - Get all patients
- `GET /api/users/doctors` - Get all doctors
- `GET /api/users/:id` - Get user by ID

### Appointments
- `POST /api/appointments/book` - Book an appointment
- `PUT /api/appointments/cancel/:id` - Cancel an appointment
- `GET /api/appointments/my` - Get current user's appointments
- `GET /api/appointments/all` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID

## User Roles

### Patient
- Register and login
- View available doctors
- Book appointments
- View and cancel their own appointments
- View dashboard with appointment statistics

### Doctor
- Register and login
- View their appointments
- View all patients
- Cancel appointments
- View dashboard with appointment statistics

## Database Schema

### User Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String ('patient' | 'doctor'),
  firstName: String,
  lastName: String,
  phone: String,
  specialization: String (doctors only),
  experience: Number (doctors only),
  dateOfBirth: Date (patients only),
  gender: String (patients only)
}
```

### Appointment Collection
```javascript
{
  patient: ObjectId (ref: User),
  doctor: ObjectId (ref: User),
  appointmentDate: Date,
  appointmentTime: String,
  reason: String,
  status: String ('scheduled' | 'completed' | 'cancelled'),
  notes: String
}
```

## Usage

1. Make sure MongoDB is running on your system
2. Start the backend server first
3. Start the frontend development server
4. Open `http://localhost:3000` in your browser
5. Register as a patient or doctor
6. Login and start using the system

## Contributing

Feel free to submit issues and enhancement requests!
