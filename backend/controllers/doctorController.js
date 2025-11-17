const Doctor = require('../models/Doctor');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', specialization } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { doctorId: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (specialization) {
      query.specialization = specialization;
    }

    const doctors = await Doctor.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Doctor.countDocuments(query);

    res.json({
      doctors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new doctor
// @route   POST /api/doctors
// @access  Public
const createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    const newDoctor = await doctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Doctor with this ID already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Public
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Public
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctors by specialization
// @route   GET /api/doctors/specialization/:specialization
// @access  Public
const getDoctorsBySpecialization = async (req, res) => {
  try {
    const doctors = await Doctor.find({ 
      specialization: req.params.specialization,
      isAvailable: true 
    });
    
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsBySpecialization
};