import React, { useState, useEffect } from 'react';
import { patientService } from '../services/patientService';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import Loading from '../components/common/Loading';
import CalendarView from '../components/appointments/CalendarView';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    completedAppointments: 0,
    cancelledAppointments: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all data in parallel
      const [patientsRes, doctorsRes, appointmentsRes, todayAppointmentsRes] = await Promise.all([
        patientService.getAllPatients({ limit: 1000 }),
        doctorService.getAllDoctors({ limit: 1000 }),
        appointmentService.getAllAppointments({ limit: 100 }),
        appointmentService.getTodaysAppointments()
      ]);

      const patients = patientsRes.data.patients || patientsRes.data;
      const doctors = doctorsRes.data.doctors || doctorsRes.data;
      const appointments = appointmentsRes.data.appointments || appointmentsRes.data;
      const todayAppointments = todayAppointmentsRes.data || [];

      // Calculate metrics
      const completedCount = appointments.filter(apt => apt.status === 'Completed').length;
      const cancelledCount = appointments.filter(apt => apt.status === 'Cancelled').length;
      const revenue = appointments
        .filter(apt => apt.status === 'Completed')
        .reduce((sum, apt) => sum + (apt.consultationFee || 0), 0);

      setStats({
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        todayAppointments: todayAppointments.length,
        totalRevenue: revenue,
        completedAppointments: completedCount,
        cancelledAppointments: cancelledCount
      });

      setRecentAppointments(appointments.slice(0, 8));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading Dashboard..." />;
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>🏥 Dashboard</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>Hospital Management System Overview</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="error" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card patients" style={{ animation: 'slideIn 0.5s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h3>👥 Total Patients</h3>
              <div className="number">{stats.totalPatients}</div>
              <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 0 0' }}>Active patients</p>
            </div>
            <div style={{ fontSize: '40px' }}>👨‍⚕️</div>
          </div>
        </div>

        <div className="stat-card doctors" style={{ animation: 'slideIn 0.6s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h3>👨‍⚕️ Total Doctors</h3>
              <div className="number">{stats.totalDoctors}</div>
              <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 0 0' }}>Available doctors</p>
            </div>
            <div style={{ fontSize: '40px' }}>💊</div>
          </div>
        </div>

        <div className="stat-card appointments" style={{ animation: 'slideIn 0.7s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h3>📅 Today's Appointments</h3>
              <div className="number">{stats.todayAppointments}</div>
              <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 0 0' }}>Scheduled today</p>
            </div>
            <div style={{ fontSize: '40px' }}>📋</div>
          </div>
        </div>

        <div className="stat-card revenue" style={{ animation: 'slideIn 0.8s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h3>💰 Total Revenue</h3>
              <div className="number" style={{ fontSize: '28px' }}>₹{stats.totalRevenue.toLocaleString()}</div>
              <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 0 0' }}>From completed appointments</p>
            </div>
            <div style={{ fontSize: '40px' }}>💵</div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ borderLeft: '4px solid #28a745' }}>
          <h4 style={{ color: '#28a745', marginBottom: '10px' }}>✅ Completed Appointments</h4>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>{stats.completedAppointments}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #dc3545' }}>
          <h4 style={{ color: '#dc3545', marginBottom: '10px' }}>❌ Cancelled Appointments</h4>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>{stats.cancelledAppointments}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #17a2b8' }}>
          <h4 style={{ color: '#17a2b8', marginBottom: '10px' }}>⏱️ Success Rate</h4>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#17a2b8' }}>
            {recentAppointments.length > 0 
              ? Math.round((stats.completedAppointments / (stats.completedAppointments + stats.cancelledAppointments)) * 100) 
              : 0}%
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        {/* Recent Appointments */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>📅 Recent Appointments</h3>
            <a href="/appointments" style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px' }}>View All →</a>
          </div>
          {recentAppointments.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '30px' }}>No appointments found</p>
          ) : (
            <div className="appointment-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {recentAppointments.map((apt, idx) => (
                <div 
                  key={apt._id} 
                  className="appointment-item"
                  style={{
                    padding: '12px',
                    borderBottom: idx < recentAppointments.length - 1 ? '1px solid #eee' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ display: 'block' }}>
                      {apt.patientId?.name || 'N/A'} → Dr. {apt.doctorId?.name || 'N/A'}
                    </strong>
                    <small style={{ color: '#999' }}>
                      {new Date(apt.appointmentDate).toLocaleDateString()} @ {apt.appointmentTime}
                    </small>
                  </div>
                  <span 
                    className={`status ${apt.status.toLowerCase()}`}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3>⚡ Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={() => window.location.href = '/appointments'}
              className="btn btn-primary"
              style={{ width: '100%', textAlign: 'center' }}
            >
              📅 Book Appointment
            </button>
            <button 
              onClick={() => window.location.href = '/patients'}
              className="btn btn-info"
              style={{ width: '100%', textAlign: 'center', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', padding: '10px', cursor: 'pointer' }}
            >
              👥 Add Patient
            </button>
            <button 
              onClick={() => window.location.href = '/doctors'}
              className="btn btn-success"
              style={{ width: '100%', textAlign: 'center' }}
            >
              🩺 Add Doctor
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .appointment-item:hover {
          background: #f8f9fa;
        }

        .stat-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;