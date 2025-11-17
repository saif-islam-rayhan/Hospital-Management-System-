const validatePatient = (req, res, next) => {
  const { name, age, gender, contact } = req.body;

  if (!name || !age || !gender || !contact || !contact.phone || !contact.email) {
    return res.status(400).json({ 
      message: 'Please provide all required fields: name, age, gender, contact.phone, contact.email' 
    });
  }

  if (age < 0 || age > 120) {
    return res.status(400).json({ 
      message: 'Age must be between 0 and 120' 
    });
  }

  next();
};

const validateAppointment = (req, res, next) => {
  const { patientId, doctorId, appointmentDate, appointmentTime, reason } = req.body;

  if (!patientId || !doctorId || !appointmentDate || !appointmentTime || !reason) {
    return res.status(400).json({ 
      message: 'Please provide all required fields: patientId, doctorId, appointmentDate, appointmentTime, reason' 
    });
  }

  next();
};

module.exports = {
  validatePatient,
  validateAppointment
};