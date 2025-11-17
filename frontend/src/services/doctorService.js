import API from './api';

export const doctorService = {
  getAllDoctors: (params = {}) => API.get('/doctors', { params }),
  getDoctorById: (id) => API.get(`/doctors/${id}`),
  createDoctor: (doctorData) => API.post('/doctors', doctorData),
  updateDoctor: (id, doctorData) => API.put(`/doctors/${id}`, doctorData),
  deleteDoctor: (id) => API.delete(`/doctors/${id}`),
  getDoctorsBySpecialization: (specialization) => 
    API.get(`/doctors/specialization/${specialization}`),
};