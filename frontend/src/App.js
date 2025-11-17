import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AppProvider } from './context/AppContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Profile from './pages/Profile';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// Layout Component
const MainLayout = ({ children }) => (
  <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    <div style={{ display: 'flex', flex: 1 }}>
      <Sidebar />
      <div className="content">
        {children}
      </div>
    </div>
    <Footer />
  </div>
);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Patients />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/doctors"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Doctors />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Appointments />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;