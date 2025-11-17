import React, { useState, useEffect } from 'react';
import { GENDER_OPTIONS, BLOOD_GROUP_OPTIONS } from '../../utils/constants';

const PatientForm = ({ patient, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    contact: {
      phone: '',
      email: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    bloodGroup: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    allergies: [],
    currentMedications: []
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    }
  }, [patient]);

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

  const handleAddAllergy = () => {
    if (allergyInput.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()]
      }));
      setAllergyInput('');
    }
  };

  const handleRemoveAllergy = (index) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  const handleAddMedication = () => {
    if (medicationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        currentMedications: [...prev.currentMedications, medicationInput.trim()]
      }));
      setMedicationInput('');
    }
  };

  const handleRemoveMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      currentMedications: prev.currentMedications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{patient ? 'Edit Patient' : 'Add New Patient'}</h2>
        
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
            <label>Age *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
              max="120"
              required
            />
          </div>

          <div className="form-group">
            <label>Gender *</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              {GENDER_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
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
            <label>Blood Group</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
              <option value="">Select Blood Group</option>
              {BLOOD_GROUP_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Allergies</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                placeholder="Add allergy"
                style={{ flex: 1 }}
              />
              <button type="button" className="btn btn-secondary" onClick={handleAddAllergy}>
                Add
              </button>
            </div>
            <div>
              {formData.allergies.map((allergy, index) => (
                <span key={index} className="tag" style={{
                  background: '#e3f2fd',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  margin: '2px',
                  display: 'inline-block',
                  fontSize: '12px'
                }}>
                  {allergy}
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergy(index)}
                    style={{ marginLeft: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <h3>Emergency Contact</h3>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="emergencyContact.name"
              value={formData.emergencyContact.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Relationship</label>
            <input
              type="text"
              name="emergencyContact.relationship"
              value={formData.emergencyContact.relationship}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="emergencyContact.phone"
              value={formData.emergencyContact.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {patient ? 'Update Patient' : 'Create Patient'}
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

export default PatientForm;