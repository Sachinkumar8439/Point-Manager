// Reports.jsx
import React, { useState } from 'react';
import { 
  FaHome,
  FaTasks,
  FaUserPlus,
  FaChartBar,
  FaCog,
  FaTrophy,
  FaMedal,
  FaStar,
  FaUserCircle,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import './Reports.css';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('month'); // 'month' or 'alltime'

  const childrenData = [
    { name: 'Priya', points: 410, rank: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
    { name: 'Aman', points: 520, rank: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aman' },
    { name: 'Anjali', points: 280, rank: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali' },
    { name: 'Mohit', points: 240, rank: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohit' },
    { name: 'Rohan', points: 350, rank: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan' },
  ];

  // Sort by points (highest first)
  const sortedData = [...childrenData].sort((a, b) => b.points - a.points);

  // Assign ranks based on sorted order
  const rankedData = sortedData.map((child, index) => ({
    ...child,
    rank: index + 1
  }));

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="rank-icon gold" />;
    if (rank === 2) return <FaMedal className="rank-icon silver" />;
    if (rank === 3) return <FaMedal className="rank-icon bronze" />;
    return <span className="rank-number">#{rank}</span>;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return '';
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <FaChartBar className="header-icon" />
          <span className="header-title">Reports</span>
        </div>
        <div className="header-right">
          <div className="tab-switcher">
            <button
              className={`tab-btn ${activeTab === 'month' ? 'active' : ''}`}
              onClick={() => setActiveTab('month')}
            >
              This Month
            </button>
            <button
              className={`tab-btn ${activeTab === 'alltime' ? 'active' : ''}`}
              onClick={() => setActiveTab('alltime')}
            >
              All Time
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="page">
        <div className="reports-container">
          {/* Leaderboard Card */}
          <div className="leaderboard-card card">
            <div className="leaderboard-header">
              <h2 className="leaderboard-title">
                {activeTab === 'month' ? 'This Month' : 'All Time'} Leaderboard
              </h2>
              <span className="leaderboard-count">{rankedData.length} Children</span>
            </div>

            <div className="leaderboard-list">
              {rankedData.map((child) => (
                <div 
                  key={child.name} 
                  className={`leaderboard-item ${getRankClass(child.rank)}`}
                >
                  <div className="rank-section">
                    {getRankIcon(child.rank)}
                  </div>
                  
                  <div className="child-section">
                    <img 
                      src={child.avatar} 
                      alt={child.name}
                      className="child-avatar"
                    />
                    <span className="child-name">{child.name}</span>
                  </div>
                  
                  <div className="points-section">
                    <FaStar className="points-star" />
                    <span className="points-value">{child.points}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="stats-summary">
            <div className="stat-card card">
              <div className="stat-icon-wrapper">
                <FaTrophy className="stat-icon gold" />
              </div>
              <div className="stat-info">
                <span className="stat-label">Top Performer</span>
                <span className="stat-value">{rankedData[0]?.name}</span>
              </div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon-wrapper">
                <FaArrowUp className="stat-icon success" />
              </div>
              <div className="stat-info">
                <span className="stat-label">Highest Points</span>
                <span className="stat-value">{rankedData[0]?.points}</span>
              </div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon-wrapper">
                <FaArrowDown className="stat-icon danger" />
              </div>
              <div className="stat-info">
                <span className="stat-label">Lowest Points</span>
                <span className="stat-value">{rankedData[rankedData.length - 1]?.points}</span>
              </div>
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

export default Reports;