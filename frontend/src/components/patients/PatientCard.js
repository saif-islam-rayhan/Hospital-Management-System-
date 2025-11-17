import React from 'react';
import { formatDate } from '../../utils/helpers';

const PatientCard = ({ patient, onEdit, onDelete }) => {
  return (
    <div className="patient-card card">
      <div className="card-header">
        <div>
          <h3>{patient.name}</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>ID: {patient.patientId}</p>
        </div>
        <div className="card-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => onEdit(patient)}
          >
            Edit
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => onDelete(patient._id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="card-details">
        <div className="detail-item">
          <span className="detail-label">Age</span>
          <span className="detail-value">{patient.age} years</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Gender</span>
          <span className="detail-value">{patient.gender}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Phone</span>
          <span className="detail-value">{patient.contact.phone}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Email</span>
          <span className="detail-value">{patient.contact.email}</span>
        </div>
        {patient.bloodGroup && (
          <div className="detail-item">
            <span className="detail-label">Blood Group</span>
            <span className="detail-value">{patient.bloodGroup}</span>
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">Status</span>
          <span className={`status ${patient.status === 'Active' ? 'status-completed' : 'status-cancelled'}`}>
            {patient.status}
          </span>
        </div>
      </div>

      {patient.emergencyContact.name && (
        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
          <strong>Emergency Contact:</strong> {patient.emergencyContact.name} 
          ({patient.emergencyContact.relationship}) - {patient.emergencyContact.phone}
        </div>
      )}

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Created: {formatDate(patient.createdAt)}
      </div>
    </div>
  );
};

export default PatientCard;