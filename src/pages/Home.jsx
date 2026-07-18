// Home.jsx
import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaMinus,
  FaStar,
  FaEdit,
  FaTrash,
  FaUserFriends,
  FaCrown,
  FaSearch,
  FaChevronRight,
} from "react-icons/fa";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { deleteMember, getAllMembers } from "../database/member";

const Home = ({ setmember }) => {
  const navigate = useNavigate();
  const [childrenData, setchildrenData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadmembers = async () => {
      console.log("members loading");
      try {
        const res = await getAllMembers();
        console.log(res);
        setchildrenData(res);
      } catch (error) {
        console.error(error);
      }
    };
    loadmembers();
  }, []);

  const handleEdit = (e, child) => {
    e.stopPropagation();
    navigate(`/edit/${child.id}`);
  };

  const handleDelete = async(e, childId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this child?")) {
      console.log("Delete child with id:", childId);
    }
    try {
      const res = await deleteMember(childId);
      console.log("Child deleted:", res);
    } catch (error) {
      console.error("Error deleting child:", error);
    }

  };

  const filteredChildren = childrenData.filter(child =>
    child.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find top 3 members for leaderboard
  const topMembers = [...childrenData]
    .sort((a, b) => (b.month || 0) - (a.month || 0))
    .slice(0, 3);

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="header-top">
            <div className="brand">
              <FaStar className="brand-icon" />
              <h1>Family Points</h1>
            </div>
            <span className="month-badge">May 2024</span>
          </div>
        </div>
      </header>

      <main className="home-main">
        {/* Search Bar */}
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search children..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn add-points">
            <FaPlus />
            <span>Add Points</span>
          </button>
          <button className="quick-action-btn deduct-points">
            <FaMinus />
            <span>Deduct Points</span>
          </button>
        </div>

        {/* Leaderboard Preview */}
        {/* <div className="leaderboard-preview">
          <div className="section-header">
            <FaCrown className="section-icon" />
            <h3>Top Performers</h3>
          </div>
          <div className="leaderboard-list">
            {topMembers.map((member, idx) => (
              <div 
                key={idx} 
                className="leaderboard-item"
                onClick={() => {
                  setmember(member);
                  navigate(`/p/${member.id}`);
                }}
              >
                <span className="rank-badge">{idx + 1}</span>
                <img 
                  src={member.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                  alt={member.fullName}
                  className="leader-avatar"
                />
                <div className="leader-info">
                  <span className="leader-name">{member.fullName}</span>
                  <span className="leader-points">{member.month || 0} pts</span>
                </div>
                {idx === 0 && <FaCrown className="crown-icon" />}
              </div>
            ))}
          </div>
        </div> */}

        {/* All Members Grid */}
        <div className="members-section">
          <div className="section-header">
            <FaUserFriends className="section-icon" />
            <h3>All Members</h3>
            <span className="member-count">{filteredChildren.length}</span>
          </div>

          <div className="members-grid">
            {filteredChildren.map((child) => (
              <div
                key={child.id}
                className="member-card"
                onClick={() => {
                  setmember(child);
                  navigate(`/p/${child.id}`);
                }}
              >
                <div className="member-avatar-wrapper">
                  <img
                    src={child.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt={child.fullName}
                    className="member-avatar"
                  />
                  {child.isLeader && (
                    <div className="leader-badge">
                      <FaCrown />
                    </div>
                  )}
                </div>
                <div className="member-info">
                  <div className="member-name-row">
                    <span className="member-name">{child.fullName}</span>
                    <FaChevronRight className="chevron-icon" />
                  </div>
                  <div className="member-stats">
                    <span className="stat-tag">
                      <FaStar className="stat-icon" />
                      {child.month || 0} pts
                    </span>
                  </div>
                </div>
                <div className="member-actions">
                  <button
                    className="member-action-btn edit"
                    onClick={(e) => handleEdit(e, child)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="member-action-btn delete"
                    onClick={(e) => handleDelete(e, child.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredChildren.length === 0 && (
            <div className="empty-state">
              <FaUserFriends className="empty-icon" />
              <p>No members found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;