import React from 'react';
import { formatDate, formatTime, getStatusColor } from '../../utils/helpers';

const AppointmentCard = ({ appointment, onEdit, onDelete, onUpdateStatus }) => {
  const handleStatusChange = (newStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(appointment._id, newStatus);
    }
  };

  return (
    <div className="appointment-card card">
      <div className="card-header">
        <div>
          <h3>Appointment #{appointment.appointmentId}</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>
            {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentTime)}
          </p>
        </div>
        <div className="card-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => onEdit(appointment)}
          >
            Edit
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => onDelete(appointment._id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="card-details">
        <div className="detail-item">
          <span className="detail-label">Patient</span>
          <span className="detail-value">
            {appointment.patientId?.name} (ID: {appointment.patientId?.patientId})
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Doctor</span>
          <span className="detail-value">
            Dr. {appointment.doctorId?.name} - {appointment.doctorId?.specialization}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Duration</span>
          <span className="detail-value">{appointment.duration} minutes</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Fee</span>
          <span className="detail-value">₹{appointment.consultationFee}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Status</span>
          <span className={`status ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Payment</span>
          <span className={`status ${appointment.paymentStatus === 'Paid' ? 'status-completed' : 'status-scheduled'}`}>
            {appointment.paymentStatus}
          </span>
        </div>
      </div>

      <div style={{ marginTop: '15px' }}>
        <strong>Reason:</strong> {appointment.reason}
      </div>

      {appointment.notes && (
        <div style={{ marginTop: '10px' }}>
          <strong>Notes:</strong> {appointment.notes}
        </div>
      )}

      <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {appointment.status === 'Scheduled' && (
          <>
            <button 
              className="btn btn-success"
              onClick={() => handleStatusChange('Confirmed')}
            >
              Confirm
            </button>
            <button 
              className="btn btn-warning"
              onClick={() => handleStatusChange('Cancelled')}
            >
              Cancel
            </button>
          </>
        )}
        {appointment.status === 'Confirmed' && (
          <button 
            className="btn btn-success"
            onClick={() => handleStatusChange('Completed')}
          >
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;