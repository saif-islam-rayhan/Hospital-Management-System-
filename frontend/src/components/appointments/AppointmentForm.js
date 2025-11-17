import React, { useState, useEffect } from 'react';
import { TIME_SLOTS } from '../../utils/constants';
import { patientService } from '../../services/patientService';
import { doctorService } from '../../services/doctorService';

const AppointmentForm = ({ appointment, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: '',
    duration: 30
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (appointment) {
      setFormData(appointment);
    }
  }, [appointment]);

  const fetchPatients = async () => {
    try {
      const response = await patientService.getAllPatients();
      setPatients(response.data.patients || response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getAllDoctors();
      setDoctors(response.data.doctors || response.data);
      setFilteredDoctors(response.data.doctors || response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If patient is selected, filter doctors by patient requirements
    if (name === 'patientId') {
      // For now, show all doctors. You can add filtering logic based on patient needs
      setFilteredDoctors(doctors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{appointment ? 'Edit Appointment' : 'Book New Appointment'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient *</label>
            <select 
              name="patientId" 
              value={formData.patientId} 
              onChange={handleChange}
              required
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} (ID: {patient.patientId})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Doctor *</label>
            <select 
              name="doctorId" 
              value={formData.doctorId} 
              onChange={handleChange}
              required
            >
              <option value="">Select Doctor</option>
              {filteredDoctors.map(doctor => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.name} - {doctor.specialization} (₹{doctor.consultationFee})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Appointment Date *</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              min={today}
              required
            />
          </div>

          <div className="form-group">
            <label>Appointment Time *</label>
            <select 
              name="appointmentTime" 
              value={formData.appointmentTime} 
              onChange={handleChange}
              required
            >
              <option value="">Select Time</option>
              {TIME_SLOTS.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <select 
              name="duration" 
              value={formData.duration} 
              onChange={handleChange}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>

          <div className="form-group">
            <label>Reason for Visit *</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the reason for the appointment..."
              required
            />
          </div>

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              placeholder="Any additional information..."
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Booking...' : (appointment ? 'Update Appointment' : 'Book Appointment')}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;