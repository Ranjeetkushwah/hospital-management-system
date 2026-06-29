const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Sync indices to match the schemas dynamically
    const Appointment = require('../models/Appointment');
    const User = require('../models/User');
    
    await Appointment.syncIndexes();
    await User.syncIndexes();
    console.log('Database indexes synchronized successfully');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
