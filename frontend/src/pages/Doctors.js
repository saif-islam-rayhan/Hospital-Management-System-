import React, { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';
import DoctorList from '../components/doctors/DoctorList';
import DoctorForm from '../components/doctors/DoctorForm';
import Loading from '../components/common/Loading';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getAllDoctors();
      setDoctors(response.data.doctors || response.data);
    } catch (error) {
      setError('Failed to fetch doctors');
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoctor = async (doctorData) => {
    try {
      await doctorService.createDoctor(doctorData);
      fetchDoctors();
      setShowForm(false);
      setError('');
    } catch (error) {
      setError('Failed to create doctor');
      console.error('Error creating doctor:', error);
    }
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  const handleUpdateDoctor = async (doctorData) => {
    try {
      await doctorService.updateDoctor(editingDoctor._id, doctorData);
      fetchDoctors();
      setShowForm(false);
      setEditingDoctor(null);
      setError('');
    } catch (error) {
      setError('Failed to update doctor');
      console.error('Error updating doctor:', error);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await doctorService.deleteDoctor(id);
        fetchDoctors();
        setError('');
      } catch (error) {
        setError('Failed to delete doctor');
        console.error('Error deleting doctor:', error);
      }
    }
  };

  if (loading) {
    return <Loading message="Loading doctors..." />;
  }

  return (
    <div className="doctors-page">
      <div className="page-header">
        <h1>Doctors Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Doctor
        </button>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {showForm && (
        <DoctorForm
          doctor={editingDoctor}
          onSubmit={editingDoctor ? handleUpdateDoctor : handleCreateDoctor}
          onCancel={() => {
            setShowForm(false);
            setEditingDoctor(null);
          }}
        />
      )}

      <DoctorList
        doctors={doctors}
        onEdit={handleEditDoctor}
        onDelete={handleDeleteDoctor}
      />
    </div>
  );
};

export default Doctors;