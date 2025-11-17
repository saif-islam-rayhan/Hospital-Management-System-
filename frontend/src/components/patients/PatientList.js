import React from 'react';
import PatientCard from './PatientCard';

const PatientList = ({ patients, onEdit, onDelete }) => {
  if (patients.length === 0) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', color: '#666' }}>No patients found.</p>
      </div>
    );
  }

  return (
    <div className="patient-list">
      {patients.map(patient => (
        <PatientCard
          key={patient._id}
          patient={patient}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PatientList;