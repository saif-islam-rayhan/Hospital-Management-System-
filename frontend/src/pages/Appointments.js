import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import AppointmentList from '../components/appointments/AppointmentList';
import AppointmentForm from '../components/appointments/AppointmentForm';
import Loading from '../components/common/Loading';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [filterStatus]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await appointmentService.getAllAppointments(params);
      setAppointments(response.data.appointments || response.data);
    } catch (error) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (appointmentData) => {
    try {
      await appointmentService.createAppointment(appointmentData);
      fetchAppointments();
      setShowForm(false);
      setError('');
    } catch (error) {
      setError('Failed to create appointment');
      console.error('Error creating appointment:', error);
    }
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleUpdateAppointment = async (appointmentData) => {
    try {
      await appointmentService.updateAppointment(editingAppointment._id, appointmentData);
      fetchAppointments();
      setShowForm(false);
      setEditingAppointment(null);
      setError('');
    } catch (error) {
      setError('Failed to update appointment');
      console.error('Error updating appointment:', error);
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentService.deleteAppointment(id);
        fetchAppointments();
        setError('');
      } catch (error) {
        setError('Failed to delete appointment');
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentService.updateAppointmentStatus(id, status);
      fetchAppointments();
      setError('');
    } catch (error) {
      setError('Failed to update appointment status');
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <Loading message="Loading appointments..." />;
  }

  return (
    <div className="appointments-page">
      <div className="page-header">
        <h1>Appointments Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingAppointment(null);
            setShowForm(true);
          }}
        >
          Book New Appointment
        </button>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: '500' }}>Filter by Status:</label>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}
        >
          <option value="">All Appointments</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {showForm && (
        <AppointmentForm
          appointment={editingAppointment}
          onSubmit={editingAppointment ? handleUpdateAppointment : handleCreateAppointment}
          onCancel={() => {
            setShowForm(false);
            setEditingAppointment(null);
          }}
        />
      )}

      <AppointmentList
        appointments={appointments}
        onEdit={handleEditAppointment}
        onDelete={handleDeleteAppointment}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default Appointments;
