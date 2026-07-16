// Settings.jsx
import React from 'react';
import { 
  FaArrowLeft,
  FaUsers,
  FaTasks,
  FaPlusCircle,
  FaDownload,
  FaUpload,
  FaTrash,
  FaChevronRight,
  FaHome,
  FaUserPlus,
  FaChartBar,
  FaCog
} from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
  const settingsItems = [
    { icon: FaUsers, label: 'Manage Children', color: '#4F7CFF' },
    { icon: FaTasks, label: 'Manage Common Tasks', color: '#22C55E' },
    { icon: FaPlusCircle, label: 'Global Add / Deduct Points', color: '#F59E0B' },
    { icon: FaDownload, label: 'Backup / Export Data', color: '#06B6D4' },
    { icon: FaUpload, label: 'Import Data', color: '#8B5CF6' },
    { icon: FaTrash, label: 'Clear All Data', color: '#EF4444' },
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <button className="back-btn" onClick={() => window.history.back()}>
          <FaArrowLeft />
        </button>
        <div className="header-center">
          <FaCog className="header-icon" />
          <span className="header-title">Settings</span>
        </div>
        <div className="header-placeholder"></div>
      </header>

      {/* Main Content */}
      <main className="page">
        <div className="settings-container">
          {/* General Section */}
          <div className="settings-section">
            <h2 className="section-title">General</h2>
            <div className="settings-card card">
              {settingsItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={index} 
                    className={`settings-item ${index === settingsItems.length - 1 ? 'last' : ''}`}
                  >
                    <div className="settings-item-left">
                      <div className="settings-icon-wrapper" style={{ color: item.color }}>
                        <Icon />
                      </div>
                      <span className="settings-label">{item.label}</span>
                    </div>
                    <FaChevronRight className="settings-arrow" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className="nav-item">
          <FaHome className="nav-icon" />
          <span>Home</span>
        </button>
        <button className="nav-item">
          <FaTasks className="nav-icon" />
          <span>Tasks</span>
        </button>
        <button className="nav-item">
          <FaUserPlus className="nav-icon" />
          <span>Add Child</span>
        </button>
        <button className="nav-item">
          <FaChartBar className="nav-icon" />
          <span>Reports</span>
        </button>
        <button className="nav-item active">
          <FaCog className="nav-icon" />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default Settings;