import API from './api';

export const patientService = {
  getAllPatients: (params = {}) => API.get('/patients', { params }),
  getPatientById: (id) => API.get(`/patients/${id}`),
  createPatient: (patientData) => API.post('/patients', patientData),
  updatePatient: (id, patientData) => API.put(`/patients/${id}`, patientData),
  deletePatient: (id) => API.delete(`/patients/${id}`),
  addMedicalHistory: (id, medicalData) => 
    API.post(`/patients/${id}/medical-history`, medicalData),
};