import React from 'react';
import DoctorCard from './DoctorCard';

const DoctorList = ({ doctors, onEdit, onDelete }) => {
  if (doctors.length === 0) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', color: '#666' }}>No doctors found.</p>
      </div>
    );
  }

  return (
    <div className="doctor-list">
      {doctors.map(doctor => (
        <DoctorCard
          key={doctor._id}
          doctor={doctor}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DoctorList;