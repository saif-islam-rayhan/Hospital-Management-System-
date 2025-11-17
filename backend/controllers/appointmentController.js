const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Public
const getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, date, status, doctorId } = req.query;
    
    const query = {};
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }
    
    if (status) {
      query.status = status;
    }
    
    if (doctorId) {
      query.doctorId = doctorId;
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name patientId contact phone age gender')
      .populate('doctorId', 'name doctorId specialization department consultationFee')
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Public
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
const createAppointment = async (req, res) => {
  try {
    // Check if patient exists
    const patient = await Patient.findById(req.body.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(req.body.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctorId: req.body.doctorId,
      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,
      status: { $in: ['Scheduled', 'Confirmed'] }
    });

    if (conflictingAppointment) {
      return res.status(400).json({ 
        message: 'Time slot already booked. Please choose a different time.' 
      });
    }

    const appointment = new Appointment({
      ...req.body,
      consultationFee: doctor.consultationFee
    });

    const newAppointment = await appointment.save();
    await newAppointment.populate(['patientId', 'doctorId']);

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Public
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate(['patientId', 'doctorId']);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Public
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate(['patientId', 'doctorId']);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Public
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointments by patient
// @route   GET /api/appointments/patient/:patientId
// @access  Public
const getAppointmentsByPatient = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name specialization department')
      .sort({ appointmentDate: -1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointments by doctor
// @route   GET /api/appointments/doctor/:doctorId
// @access  Public
const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { date } = req.query;
    
    const query = { doctorId: req.params.doctorId };
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name patientId contact phone age gender')
      .sort({ appointmentDate: 1, appointmentTime: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's appointments
// @route   GET /api/appointments/today
// @access  Public
const getTodaysAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      appointmentDate: { $gte: today, $lt: tomorrow }
    })
    .populate('patientId', 'name patientId contact phone')
    .populate('doctorId', 'name specialization department')
    .sort({ appointmentTime: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  getTodaysAppointments
};