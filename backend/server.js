const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection with fallback to local MongoDB if Atlas fails
const connectDB = async () => {
  const atlasUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/hospital_management';

  const opts = { useNewUrlParser: true, useUnifiedTopology: true };

  if (atlasUri) {
    try {
      await mongoose.connect(atlasUri, opts);
      console.log('✅ MongoDB Connected Successfully (Atlas)');
      return;
    } catch (err) {
      console.warn('⚠️ Failed to connect to Atlas, falling back to local MongoDB. Error:', err.message || err);
    }
  }

  try {
    await mongoose.connect(localUri, opts);
    console.log('✅ MongoDB Connected Successfully (Local)');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
  }
};

// Start DB connection
connectDB();

// Ensure a default admin user exists (demo credentials)
// This helps the frontend demo login (admin@hospital.com / password123)
const ensureDefaultAdmin = async () => {
  try {
    const User = require('./models/User');
    const Patient = require('./models/Patient');
    const Doctor = require('./models/Doctor');
    const Appointment = require('./models/Appointment');

    // Create admin user
    const existing = await User.findOne({ email: 'admin@hospital.com' });
    if (!existing) {
      await User.create({
        username: 'admin',
        email: 'admin@hospital.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('🔐 Default admin user created: admin@hospital.com / password123');
    } else {
      console.log('🔐 Default admin already exists');
    }

    // Create demo doctors
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      const doctors = [
        {
          name: 'Dr. Rajesh Kumar',
          specialization: 'Cardiology',
          department: 'Cardiology',
          contact: { phone: '01712345678', email: 'rajesh@hospital.com' },
          experience: 15,
          consultationFee: 500,
          schedule: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], startTime: '09:00', endTime: '17:00' },
          qualifications: [{ degree: 'MD', university: 'AIIMS', year: 2008 }]
        },
        {
          name: 'Dr. Priya Singh',
          specialization: 'Pediatrics',
          department: 'Pediatrics',
          contact: { phone: '01798765432', email: 'priya@hospital.com' },
          experience: 10,
          consultationFee: 400,
          schedule: { days: ['Monday', 'Wednesday', 'Friday'], startTime: '10:00', endTime: '16:00' },
          qualifications: [{ degree: 'MD', university: 'CMC Vellore', year: 2013 }]
        },
        {
          name: 'Dr. Amit Patel',
          specialization: 'Neurology',
          department: 'Neurology',
          contact: { phone: '01654321098', email: 'amit@hospital.com' },
          experience: 12,
          consultationFee: 600,
          schedule: { days: ['Tuesday', 'Thursday', 'Saturday'], startTime: '11:00', endTime: '18:00' },
          qualifications: [{ degree: 'DM', university: 'NIMHANS', year: 2011 }]
        }
      ];

      // Save each doctor individually so pre-save hooks run
      const createdDoctors = [];
      for (const doctorData of doctors) {
        const doc = new Doctor(doctorData);
        const saved = await doc.save();
        createdDoctors.push(saved);
      }
      console.log(`✅ ${createdDoctors.length} demo doctors created`);
    }

    // Create demo patients
    const patientCount = await Patient.countDocuments();
    if (patientCount === 0) {
      const patients = [
        {
          name: 'Rahul Sharma',
          age: 35,
          gender: 'Male',
          contact: { phone: '01999888777', email: 'rahul@example.com' },
          bloodGroup: 'O+',
          address: { city: 'Mumbai', state: 'Maharashtra' }
        },
        {
          name: 'Neha Verma',
          age: 28,
          gender: 'Female',
          contact: { phone: '01888777666', email: 'neha@example.com' },
          bloodGroup: 'B+',
          address: { city: 'Delhi', state: 'Delhi' }
        },
        {
          name: 'Vikram Singh',
          age: 45,
          gender: 'Male',
          contact: { phone: '01777666555', email: 'vikram@example.com' },
          bloodGroup: 'A+',
          address: { city: 'Bangalore', state: 'Karnataka' }
        }
      ];

      // Save each patient individually
      const createdPatients = [];
      for (const patientData of patients) {
        const pat = new Patient(patientData);
        const saved = await pat.save();
        createdPatients.push(saved);
      }
      console.log(`✅ ${createdPatients.length} demo patients created`);
    }

    // Create demo appointments
    const appointmentCount = await Appointment.countDocuments();
    if (appointmentCount === 0) {
      const patients = await Patient.find().limit(3);
      const doctors = await Doctor.find().limit(3);

      if (patients.length > 0 && doctors.length > 0) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointments = [
          {
            patientId: patients[0]._id,
            doctorId: doctors[0]._id,
            appointmentDate: today,
            appointmentTime: '10:00',
            reason: 'Regular checkup',
            status: 'Confirmed',
            consultationFee: doctors[0].consultationFee
          },
          {
            patientId: patients[1]._id,
            doctorId: doctors[1]._id,
            appointmentDate: tomorrow,
            appointmentTime: '14:00',
            reason: 'Child health checkup',
            status: 'Scheduled',
            consultationFee: doctors[1].consultationFee
          },
          {
            patientId: patients[2]._id,
            doctorId: doctors[2]._id,
            appointmentDate: today,
            appointmentTime: '15:30',
            reason: 'Neurological consultation',
            status: 'Completed',
            consultationFee: doctors[2].consultationFee
          }
        ];

        // Save each appointment individually
        const createdAppointments = [];
        for (const aptData of appointments) {
          const apt = new Appointment(aptData);
          const saved = await apt.save();
          createdAppointments.push(saved);
        }
        console.log(`✅ ${createdAppointments.length} demo appointments created`);
      }
    }
  } catch (err) {
    console.error('Error in data seeding:', err.message || err);
  }
};

// Run seeding after connection established
mongoose.connection.once('open', () => {
  ensureDefaultAdmin();
});

// Routes
app.use('/api/patients', require('./routes/patients'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/auth', require('./routes/auth'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '🏥 Hospital Management API is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});