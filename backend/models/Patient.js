const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  contact: {
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    treatment: String,
    notes: String
  }],
  allergies: [String],
  currentMedications: [String],
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    groupNumber: String
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Discharged'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Generate patient ID before validation so required validators see it
patientSchema.pre('validate', async function(next) {
  if (!this.patientId) {
    try {
      const count = await mongoose.model('Patient').countDocuments();
      this.patientId = `PAT${String(count + 1).padStart(4, '0')}`;
    } catch (err) {
      // ignore and continue; validation will catch issues
    }
  }
  next();
});

module.exports = mongoose.model('Patient', patientSchema);