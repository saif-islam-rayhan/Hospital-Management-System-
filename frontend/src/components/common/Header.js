import React, { useState, useEffect } from 'react';

const Header = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          🏥 Hospital Management
        </div>
        <div className="user-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative' }}>
            {/* User Avatar & Dropdown */}
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                hover: { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(255,255,255,0.2)')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                {getInitials(user?.username)}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{user?.username || 'User'}</div>
                <div style={{ fontSize: '12px', color: '#ddd' }}>{user?.role || 'User'}</div>
              </div>
              <span style={{ fontSize: '12px', marginLeft: '5px' }}>▼</span>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '55px',
                  right: '0',
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                  minWidth: '200px',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}
              >
                <a
                  href="/profile"
                  onClick={() => setShowDropdown(false)}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: '#333',
                    textDecoration: 'none',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => (e.target.style.background = '#f5f5f5')}
                  onMouseLeave={(e) => (e.target.style.background = 'white')}
                >
                  👤 View Profile
                </a>
                <a
                  href="/profile"
                  onClick={() => setShowDropdown(false)}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: '#333',
                    textDecoration: 'none',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => (e.target.style.background = '#f5f5f5')}
                  onMouseLeave={(e) => (e.target.style.background = 'white')}
                >
                  ⚙️ Settings
                </a>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px 16px',
                    color: '#dc3545',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => (e.target.style.background = '#f5f5f5')}
                  onMouseLeave={(e) => (e.target.style.background = 'white')}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          padding: 0 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .logo {
          font-size: 22px;
          font-weight: bold;
          background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
      `}</style>
    </header>
  );
};

export default Header;