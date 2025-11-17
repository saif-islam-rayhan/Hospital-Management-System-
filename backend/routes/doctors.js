const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsBySpecialization
} = require('../controllers/doctorController');

router.route('/')
  .get(getAllDoctors)
  .post(createDoctor);

router.route('/:id')
  .get(getDoctorById)
  .put(updateDoctor)
  .delete(deleteDoctor);

router.route('/specialization/:specialization')
  .get(getDoctorsBySpecialization);

module.exports = router;