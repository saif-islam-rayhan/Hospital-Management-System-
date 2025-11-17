import React from 'react';
import { formatDate, formatTime } from '../../utils/helpers';

const CalendarView = ({ appointments }) => {
  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="card">
      <h3>Appointment Calendar (Next 7 Days)</h3>
      <div className="calendar-grid">
        {next7Days.map(date => {
          const dayAppointments = getAppointmentsForDate(date);
          return (
            <div key={date.toISOString()} className="calendar-day">
              <div className="calendar-date">
                <strong>{formatDate(date)}</strong>
                <span>({dayAppointments.length} appointments)</span>
              </div>
              <div className="appointment-slots">
                {dayAppointments.map(apt => (
                  <div key={apt._id} className="appointment-slot">
                    <div className="slot-time">{formatTime(apt.appointmentTime)}</div>
                    <div className="slot-info">
                      <div>{apt.patientId?.name}</div>
                      <div className="slot-doctor">Dr. {apt.doctorId?.name}</div>
                    </div>
                    <div className={`slot-status ${apt.status.toLowerCase()}`}>
                      {apt.status}
                    </div>
                  </div>
                ))}
                {dayAppointments.length === 0 && (
                  <div className="no-appointments">No appointments</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .calendar-grid {
          display: grid;
          gap: 15px;
          margin-top: 15px;
        }
        .calendar-day {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
        }
        .calendar-date {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        .appointment-slots {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .appointment-slot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background: #f8f9fa;
          border-radius: 4px;
        }
        .slot-time {
          font-weight: bold;
          min-width: 80px;
        }
        .slot-info {
          flex: 1;
          margin: 0 15px;
        }
        .slot-doctor {
          font-size: 12px;
          color: #666;
        }
        .slot-status {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: bold;
        }
        .slot-status.scheduled { background: #fff3cd; color: #856404; }
        .slot-status.confirmed { background: #d1ecf1; color: #0c5460; }
        .slot-status.completed { background: #d4edda; color: #155724; }
        .slot-status.cancelled { background: #f8d7da; color: #721c24; }
        .no-appointments {
          text-align: center;
          color: #999;
          font-style: italic;
          padding: 10px;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;