import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import Loading from '../components/common/Loading';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        password: ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile(formData);
      setMessage('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      setMessage('Error updating profile');
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <Loading message="Loading profile..." />;
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>User Profile</h1>
      </div>

      <div className="card">
        {message && (
          <div className={message.includes('Error') ? 'error' : 'success'}>
            {message}
          </div>
        )}

        {!editing ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#3498db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                marginRight: '20px'
              }}>
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2>{user.username}</h2>
                <p style={{ color: '#666' }}>{user.email}</p>
                <p>Role: <strong>{user.role}</strong></p>
              </div>
            </div>

            <div className="card-details">
              <div className="detail-item">
                <span className="detail-label">User ID</span>
                <span className="detail-value">{user._id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Account Created</span>
                <span className="detail-value">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className={`status ${user.isActive ? 'status-completed' : 'status-cancelled'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              onClick={() => setEditing(true)}
              style={{ marginTop: '20px' }}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <h3>Edit Profile</h3>
            
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password (leave blank to keep current)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Update Profile
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    username: user.username,
                    email: user.email,
                    password: ''
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;