import React, { useState, useEffect } from 'react';
import { SPECIALIZATION_OPTIONS, DEPARTMENT_OPTIONS } from '../../utils/constants';

const DoctorForm = ({ doctor, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    department: '',
    contact: {
      phone: '',
      email: ''
    },
    qualifications: [{ degree: '', university: '', year: '' }],
    experience: '',
    schedule: {
      days: [],
      startTime: '09:00',
      endTime: '17:00'
    },
    consultationFee: '',
    bio: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const [qualificationInput, setQualificationInput] = useState({ degree: '', university: '', year: '' });

  useEffect(() => {
    if (doctor) {
      setFormData(doctor);
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddQualification = () => {
    if (qualificationInput.degree && qualificationInput.university && qualificationInput.year) {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, { ...qualificationInput }]
      }));
      setQualificationInput({ degree: '', university: '', year: '' });
    }
  };

  const handleRemoveQualification = (index) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        days: prev.schedule.days.includes(day)
          ? prev.schedule.days.filter(d => d !== day)
          : [...prev.schedule.days, day]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{doctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Specialization *</label>
            <select name="specialization" value={formData.specialization} onChange={handleChange} required>
              <option value="">Select Specialization</option>
              {SPECIALIZATION_OPTIONS.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Department *</label>
            <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              {DEPARTMENT_OPTIONS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="contact.phone"
              value={formData.contact.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="contact.email"
              value={formData.contact.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Experience (Years) *</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              max="50"
              required
            />
          </div>

          <div className="form-group">
            <label>Consultation Fee (₹) *</label>
            <input
              type="number"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Working Days</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '5px' }}>
              {daysOfWeek.map(day => (
                <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="checkbox"
                    checked={formData.schedule.days.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Start Time</label>
              <input
                type="time"
                name="schedule.startTime"
                value={formData.schedule.startTime}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>End Time</label>
              <input
                type="time"
                name="schedule.endTime"
                value={formData.schedule.endTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Qualifications</label>
            <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Degree"
                  value={qualificationInput.degree}
                  onChange={(e) => setQualificationInput(prev => ({ ...prev, degree: e.target.value }))}
                  style={{ flex: 1 }}
                />
                <input
                  type="text"
                  placeholder="University"
                  value={qualificationInput.university}
                  onChange={(e) => setQualificationInput(prev => ({ ...prev, university: e.target.value }))}
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={qualificationInput.year}
                  onChange={(e) => setQualificationInput(prev => ({ ...prev, year: e.target.value }))}
                  style={{ width: '80px' }}
                />
                <button type="button" className="btn btn-secondary" onClick={handleAddQualification}>
                  Add
                </button>
              </div>
              {formData.qualifications.map((qual, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '5px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span>{qual.degree} - {qual.university} ({qual.year})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveQualification(index)}
                    className="btn btn-danger"
                    style={{ padding: '2px 8px', fontSize: '12px' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              placeholder="Brief description about the doctor..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {doctor ? 'Update Doctor' : 'Create Doctor'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorForm;