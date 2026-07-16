// ManageCommonTasks.jsx
import React, { useEffect, useState } from 'react';
import { 
  FaArrowLeft,
  FaClock,
  FaStar,
  FaEdit,
  FaTrash,
  FaPlus,
  FaHome,
  FaTasks,
  FaUserPlus,
  FaChartBar,
  FaCog
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './ManageCommonTasks.css';
import { getCommonTasks } from '../database/task';

export function formatTimeRange(startTime, endTime, hasTimeRange = true) {
  if (!hasTimeRange || !startTime) return "";

  const formatTime = (time) => {
    let [hours, minutes] = time.split(":").map(Number);

    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )} ${period}`;
  };

  if (!endTime) {
    return formatTime(startTime);
  }

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

const ManageCommonTasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Wake Up Early', time: '06:00 AM - 07:00 AM', points: 5 },
    { id: 2, name: 'Brush Teeth', time: '07:00 AM - 07:30 AM', points: 3 },
    { id: 3, name: 'Homework', time: '04:00 PM - 05:00 PM', points: 10 },
    { id: 4, name: 'Reading', time: '07:00 PM - 08:00 PM', points: 5 },
    { id: 5, name: 'Drink Water', time: 'No Time Range', points: 2 },
    { id: 6, name: 'Exercise', time: '06:00 PM - 07:00 PM', points: 10 },
  ]);
  useEffect(()=>{
    const fetchTasks = async () => {
        try {
          const res = await getCommonTasks();
          console.log(res)
          setTasks(res);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
    }
    fetchTasks();
  },[])

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <button className="back-btn" onClick={() => window.history.back()}>
          <FaArrowLeft />
        </button>
        <div className="header-center">
          <span className="header-title">Manage Common Tasks</span>
        </div>
        <Link to="/add-task" className="add-task-btn-header">
          <FaPlus />
        </Link>
      </header>

      {/* Main Content */}
      <main className="page">
        <div className="tasks-container">
          {tasks.map((task) => (
            <div key={task.id} className="task-item card">
              <div className="task-content">
                <div className="task-info">
                  <h3 className="task-name">{task.name}</h3>
                  <div className="task-time">
                    <FaClock className="clock-icon" />
                    <span>{formatTimeRange(task.startTime, task.endTime, task.hasTimeRange)}</span>
                  </div>
                </div>
                <div className="task-points">
                  <FaStar className="points-icon" />
                  <span>+{task.points}</span>
                </div>
              </div>
              <div className="task-actions">
                <button className="action-btn edit-btn">
                  <FaEdit />
                </button>
                <button className="action-btn delete-btn">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ManageCommonTasks;