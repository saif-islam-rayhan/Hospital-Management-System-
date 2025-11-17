const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    }
  },
  qualifications: [{
    degree: String,
    university: String,
    year: Number
  }],
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  schedule: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    startTime: String,
    endTime: String
  },
  consultationFee: {
    type: Number,
    required: true,
    min: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  bio: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'OnLeave'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Generate doctor ID before validation so required validators see it
doctorSchema.pre('validate', async function(next) {
  if (!this.doctorId) {
    try {
      const count = await mongoose.model('Doctor').countDocuments();
      this.doctorId = `DOC${String(count + 1).padStart(4, '0')}`;
    } catch (err) {
      // ignore
    }
  }
  next();
});

module.exports = mongoose.model('Doctor', doctorSchema);