import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const menuItems = [
    { path: '/', label: '📊 Dashboard', icon: '📊' },
    { path: '/patients', label: '👥 Patients', icon: '👥' },
    { path: '/doctors', label: '🩺 Doctors', icon: '🩺' },
    { path: '/appointments', label: '📅 Appointments', icon: '📅' },
    { path: '/profile', label: '👤 Profile', icon: '👤' }
  ];

  const filteredItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="sidebar">
      {/* Search Box */}
      <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <input
          type="text"
          placeholder="🔍 Search menu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '13px',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            outline: 'none'
          }}
          onFocus={(e) => (e.target.style.background = 'rgba(255,255,255,0.2)')}
          onBlur={(e) => (e.target.style.background = 'rgba(255,255,255,0.1)')}
        />
      </div>

      <nav>
        <ul className="sidebar-nav">
          {filteredItems.map(item => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <style jsx>{`
        .sidebar {
          width: 250px;
          background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
          color: white;
          padding: 0;
          height: 100vh;
          overflow-y: auto;
          box-shadow: 2px 0 8px rgba(0,0,0,0.15);
        }

        .sidebar-nav {
          list-style: none;
          padding: 15px 0;
          margin: 0;
        }

        .sidebar-nav li {
          margin: 0;
        }

        .sidebar-nav a {
          display: flex;
          align-items: center;
          padding: 14px 20px;
          color: #bdc3c7;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 15px;
          border-left: 3px solid transparent;
        }

        .sidebar-nav a:hover {
          background-color: rgba(255,255,255,0.1);
          color: white;
          border-left-color: #3498db;
        }

        .sidebar-nav a.active {
          background-color: rgba(52, 152, 219, 0.2);
          color: #3498db;
          border-left-color: #3498db;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: auto;
            box-shadow: none;
            border-bottom: 2px solid rgba(255,255,255,0.2);
          }

          .sidebar-nav {
            display: flex;
            overflow-x: auto;
            padding: 10px 0;
          }

          .sidebar-nav li {
            flex-shrink: 0;
          }

          .sidebar-nav a {
            padding: 10px 15px;
            font-size: 13px;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;