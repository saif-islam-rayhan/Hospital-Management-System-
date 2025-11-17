const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  getTodaysAppointments
} = require('../controllers/appointmentController');

router.route('/')
  .get(getAllAppointments)
  .post(createAppointment);

router.route('/:id')
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);

router.route('/:id/status')
  .patch(updateAppointmentStatus);

router.route('/patient/:patientId')
  .get(getAppointmentsByPatient);

router.route('/doctor/:doctorId')
  .get(getAppointmentsByDoctor);

router.route('/today')
  .get(getTodaysAppointments);

module.exports = router;