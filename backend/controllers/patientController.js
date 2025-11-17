const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Public
const getAllPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'contact.phone': { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } }
      ];
    }

    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Patient.countDocuments(query);

    res.json({
      patients,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Public
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new patient
// @route   POST /api/patients
// @access  Public
const createPatient = async (req, res) => {
  try {
    // Ensure patientId exists (fallback if schema hooks didn't run)
    if (!req.body.patientId) {
      // Generate a mostly-unique patientId using timestamp + random suffix
      const generateId = () => `PAT${String(Date.now()).slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
      let pid = generateId();
      let tries = 0;
      while (tries < 5) {
        const exists = await Patient.findOne({ patientId: pid });
        if (!exists) break;
        pid = generateId();
        tries++;
      }
      req.body.patientId = pid;
    }

    const patient = new Patient(req.body);
    const newPatient = await patient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Patient with this ID already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Public
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Public
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add medical history
// @route   POST /api/patients/:id/medical-history
// @access  Public
const addMedicalHistory = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    patient.medicalHistory.push(req.body);
    await patient.save();
    
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  addMedicalHistory
};