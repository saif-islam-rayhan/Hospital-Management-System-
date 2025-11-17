import React from 'react';

const DoctorCard = ({ doctor, onEdit, onDelete }) => {
  return (
    <div className="doctor-card card">
      <div className="card-header">
        <div>
          <h3>Dr. {doctor.name}</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>ID: {doctor.doctorId}</p>
        </div>
        <div className="card-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => onEdit(doctor)}
          >
            Edit
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => onDelete(doctor._id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="card-details">
        <div className="detail-item">
          <span className="detail-label">Specialization</span>
          <span className="detail-value">{doctor.specialization}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Department</span>
          <span className="detail-value">{doctor.department}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Experience</span>
          <span className="detail-value">{doctor.experience} years</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Phone</span>
          <span className="detail-value">{doctor.contact.phone}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Email</span>
          <span className="detail-value">{doctor.contact.email}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Fee</span>
          <span className="detail-value">₹{doctor.consultationFee}</span>
        </div>
      </div>

      {doctor.schedule.days.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <strong>Availability:</strong> {doctor.schedule.days.join(', ')} 
          <br />
          <strong>Timing:</strong> {doctor.schedule.startTime} - {doctor.schedule.endTime}
        </div>
      )}

      {doctor.qualifications.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <strong>Qualifications:</strong>
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            {doctor.qualifications.map((qual, index) => (
              <li key={index}>
                {qual.degree} - {qual.university} ({qual.year})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Status: <span className={`status ${doctor.isAvailable ? 'status-completed' : 'status-cancelled'}`}>
          {doctor.isAvailable ? 'Available' : 'Not Available'}
        </span>
      </div>
    </div>
  );
};

export default DoctorCard;