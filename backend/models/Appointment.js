const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    unique: true,
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-Show'],
    default: 'Scheduled'
  },
  reason: {
    type: String,
    required: true
  },
  notes: String,
  duration: {
    type: Number,
    default: 30, // minutes
    min: 15,
    max: 120
  },
  consultationFee: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending'
  },
  symptoms: [String],
  diagnosis: String,
  prescription: String,
  followUpDate: Date
}, {
  timestamps: true
});

// Generate appointment ID before validation so required validators see it
appointmentSchema.pre('validate', async function(next) {
  if (!this.appointmentId) {
    try {
      const count = await mongoose.model('Appointment').countDocuments();
      this.appointmentId = `APT${String(count + 1).padStart(4, '0')}`;
    } catch (err) {
      // ignore
    }
  }
  next();
});

// Virtual for populated data
appointmentSchema.virtual('patient', {
  ref: 'Patient',
  localField: 'patientId',
  foreignField: '_id',
  justOne: true
});

appointmentSchema.virtual('doctor', {
  ref: 'Doctor',
  localField: 'doctorId',
  foreignField: '_id',
  justOne: true
});

appointmentSchema.set('toJSON', { virtuals: true });
appointmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Appointment', appointmentSchema);