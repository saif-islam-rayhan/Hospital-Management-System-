import API from './api';

export const appointmentService = {
  getAllAppointments: (params = {}) => API.get('/appointments', { params }),
  getAppointmentById: (id) => API.get(`/appointments/${id}`),
  createAppointment: (appointmentData) => API.post('/appointments', appointmentData),
  updateAppointment: (id, appointmentData) => API.put(`/appointments/${id}`, appointmentData),
  updateAppointmentStatus: (id, status) => 
    API.patch(`/appointments/${id}/status`, { status }),
  deleteAppointment: (id) => API.delete(`/appointments/${id}`),
  getAppointmentsByPatient: (patientId) => 
    API.get(`/appointments/patient/${patientId}`),
  getAppointmentsByDoctor: (doctorId, params = {}) => 
    API.get(`/appointments/doctor/${doctorId}`, { params }),
  getTodaysAppointments: () => API.get('/appointments/today'),
};