// AddPointsToAll.jsx
import React, { useState } from 'react';
import { 
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaHome,
  FaTasks,
  FaUserPlus,
  FaChartBar,
  FaCog,
  FaSave,
  FaUsers
} from 'react-icons/fa';
import './AddPointsToAll.css';

const AddPointsToAll = () => {
  const [activeTab, setActiveTab] = useState('deduct'); // 'add' or 'deduct'
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');
  const [reasonLength, setReasonLength] = useState(0);

  const quickPoints = activeTab === 'add' 
    ? [5, 10, 20, 50, 100]
    : [-5, -10, -20, -50, -100];

  const handlePointsChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      setPoints(value);
    }
  };

  const handleReasonChange = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setReason(value);
      setReasonLength(value.length);
    }
  };

  const handleQuickPointClick = (point) => {
    setPoints(Math.abs(point).toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      type: activeTab,
      points: parseInt(points),
      reason: reason
    };
    console.log('Points Data:', data);
    // Handle form submission here
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <button className="back-btn" onClick={() => window.history.back()}>
          <FaArrowLeft />
        </button>
        <div className="header-center">
          <span className="header-title">Add Points to All</span>
        </div>
        <div className="header-placeholder"></div>
      </header>

      {/* Main Content */}
      <main className="page">
        <form onSubmit={handleSubmit} className="points-form">
          {/* Tab Switcher */}
          <div className="tab-switcher card">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'add' ? 'active-add' : ''}`}
              onClick={() => setActiveTab('add')}
            >
              <FaPlus /> Add Points
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'deduct' ? 'active-deduct' : ''}`}
              onClick={() => setActiveTab('deduct')}
            >
              <FaMinus /> Deduct Points
            </button>
          </div>

          {/* Points Section */}
          <div className="form-section card">
            <h2 className="section-title">Points</h2>
            
            <div className="form-group">
              <label>Enter points</label>
              <div className="points-input-wrapper">
                <div className="quick-points">
                  {quickPoints.map((point, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`quick-point-btn ${activeTab === 'add' ? 'add-point' : 'deduct-point'}`}
                      onClick={() => handleQuickPointClick(point)}
                    >
                      {point > 0 ? '+' : ''}{point}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={points}
                  onChange={handlePointsChange}
                  placeholder="Enter points"
                  className="input points-main-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Reason Section */}
          <div className="form-section card">
            <h2 className="section-title">Reason</h2>
            
            <div className="form-group">
              <label>Enter reason</label>
              <input
                type="text"
                value={reason}
                onChange={handleReasonChange}
                placeholder="Enter reason"
                className="input"
                required
              />
              <div className="char-counter">{reasonLength}/100</div>
            </div>
          </div>

          {/* Action Button */}
          <button type="submit" className={`btn submit-btn ${activeTab === 'add' ? 'btn-success' : 'btn-danger'}`}>
            {activeTab === 'add' ? (
              <>
                <FaPlus /> Add Points to All Children
              </>
            ) : (
              <>
                <FaMinus /> Deduct Points from All Children
              </>
            )}
          </button>
        </form>
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
        <button className="nav-item active">
          <FaChartBar className="nav-icon" />
          <span>Reports</span>
        </button>
        <button className="nav-item">
          <FaCog className="nav-icon" />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default AddPointsToAll;