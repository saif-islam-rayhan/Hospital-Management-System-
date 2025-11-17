import React from 'react';
import AppointmentCard from './AppointmentCard';

const AppointmentList = ({ appointments, onEdit, onDelete, onUpdateStatus }) => {
  if (appointments.length === 0) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', color: '#666' }}>No appointments found.</p>
      </div>
    );
  }

  return (
    <div className="appointment-list">
      {appointments.map(appointment => (
        <AppointmentCard
          key={appointment._id}
          appointment={appointment}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};

export default AppointmentList;