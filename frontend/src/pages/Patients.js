import React, { useState, useEffect } from 'react';
import { patientService } from '../services/patientService';
import PatientList from '../components/patients/PatientList';
import PatientForm from '../components/patients/PatientForm';
import Loading from '../components/common/Loading';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientService.getAllPatients();
      setPatients(response.data.patients || response.data);
    } catch (error) {
      setError('Failed to fetch patients');
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async (patientData) => {
    try {
      await patientService.createPatient(patientData);
      fetchPatients();
      setShowForm(false);
      setError('');
    } catch (error) {
      setError('Failed to create patient');
      console.error('Error creating patient:', error);
    }
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleUpdatePatient = async (patientData) => {
    try {
      await patientService.updatePatient(editingPatient._id, patientData);
      fetchPatients();
      setShowForm(false);
      setEditingPatient(null);
      setError('');
    } catch (error) {
      setError('Failed to update patient');
      console.error('Error updating patient:', error);
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.deletePatient(id);
        fetchPatients();
        setError('');
      } catch (error) {
        setError('Failed to delete patient');
        console.error('Error deleting patient:', error);
      }
    }
  };

  if (loading) {
    return <Loading message="Loading patients..." />;
  }

  return (
    <div className="patients-page">
      <div className="page-header">
        <h1>Patients Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Patient
        </button>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {showForm && (
        <PatientForm
          patient={editingPatient}
          onSubmit={editingPatient ? handleUpdatePatient : handleCreatePatient}
          onCancel={() => {
            setShowForm(false);
            setEditingPatient(null);
          }}
        />
      )}

      <PatientList
        patients={patients}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
      />
    </div>
  );
};

export default Patients;