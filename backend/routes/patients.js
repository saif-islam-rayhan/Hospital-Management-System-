const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  addMedicalHistory
} = require('../controllers/patientController');

router.route('/')
  .get(getAllPatients)
  .post(createPatient);

router.route('/:id')
  .get(getPatientById)
  .put(updatePatient)
  .delete(deletePatient);

router.route('/:id/medical-history')
  .post(addMedicalHistory);

module.exports = router;