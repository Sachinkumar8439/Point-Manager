// ChildProfile.jsx
import React, { useEffect, useState,useMemo } from 'react';
import { 
  FaArrowLeft,
  FaUserCircle,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaPlus,
  FaMinus,
  FaHome,
  FaTasks,
  FaUserPlus,
  FaChartBar,
  FaCog,
  FaEllipsisV,
  FaTrophy,
  FaCalendarAlt,
  FaAward,
  FaFire,
  FaEdit,
  FaTrash,
  FaChevronRight
} from 'react-icons/fa';
import './ChildProfile.css';
import { createTodayRecord, toggleTask } from '../database/dailyRecord';
import { formatTimeRange } from './ManageCommonTasks';
import { getMember } from '../database/member';
import { getCurrentMonthReport } from '../database/report';

const ChildProfile = ({ member, setmember }) => {
  const [report, setReport] = useState(null);
  const [commonTasks, setCommonTasks] = useState([]);
  const [extraTasks, setExtraTasks] = useState([]);
  const [showExtraTaskInput, setShowExtraTaskInput] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState('');
  const [activeTab, setActiveTab] = useState('today'); // 'today' or 'all'
  // const [stats,setStats] = useState({todayPoints:0,monthPoints:0,totalPoints:0,completionRate:0});

  const toggleTaskStatus = async (taskId, isExtra = false) => {
    if (isExtra) {
      setExtraTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, done: !task.done } : task
        )
      );
    } else {
      try {
        const res = await toggleTask(member.id, taskId);
        console.log("task status changed ", res);
        setCommonTasks(prev =>
          prev.map(task =>
            task.id === taskId ? { ...task, done: !task.done } : task
          )
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAddExtraTask = (e) => {
    e.preventDefault();
    if (newTaskName.trim() && newTaskPoints) {
      setExtraTasks(prev => [
        ...prev,
        {
          id: Date.now(),
          name: newTaskName,
          points: parseInt(newTaskPoints),
          done: false
        }
      ]);
      setNewTaskName('');
      setNewTaskPoints('');
      setShowExtraTaskInput(false);
    }
  };

  const handleDeleteExtraTask = (taskId) => {
    setExtraTasks(prev => prev.filter(task => task.id !== taskId));
  };

  useEffect(() => {
    const fetchmember = async () => {
      try {
        console.log("pathname", window.location.pathname);
        const res = await getMember(window.location.pathname.split("/")[2]);
        console.log("response", res);
        if (!res) console.log("not valid id for member");
        setmember(res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchmember();
  }, []);

  useEffect(() => {
    const loadOrCreateRecord = async () => {
      try {
        if (!member) return;
        console.log("member1", member);
        const res = await createTodayRecord(member);
        const res2 = await getCurrentMonthReport(member.id);
        setReport(res2);
        setReport(res2);
        console.log("current month report", res2);
        console.log(res);
        setCommonTasks(res.tasks.map(task => ({
          id: task.taskId,
          name: task.name,
          time: formatTimeRange(task.startTime, task.endTime, task.hasTimeRange),
          points: task.points,
          done: task.status === "done"
        })));
      } catch (error) {
        console.log(error);
      }
    };
    loadOrCreateRecord();
  }, [member]);

 const stats = useMemo(() => {
  const allTasks = [...commonTasks, ...extraTasks];

  let todayPoints = 0;
  let completedCount = 0;

  for (const task of allTasks) {
    const isDone = task.done || task.status === "done";

    if (isDone) {
      completedCount++;
      todayPoints += Number(task.points || 0);
    }
  }
 console.log("report", report);
  return {
  todayPoints,
  monthPoints: report?.monthPoints +  todayPoints || 0,
  totalPoints: report?.totalPoints + todayPoints || 0,
  completedTasks: completedCount,
  totalTasks: allTasks.length,
  completionRate:
    allTasks.length === 0
      ? 0
      : Math.round((completedCount / allTasks.length) * 100),
};
}, [commonTasks, extraTasks, member]);


  return (
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <button className="back-btn" onClick={() => window.history.back()}>
          <FaArrowLeft />
        </button>
        <div className="header-user">
          <img 
            src={member?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
            alt={member?.fullName}
            className="header-avatar"
          />
          <div className="header-user-info">
            <span className="header-name">{member?.fullName || 'User'}</span>
            {member?.isLeader && (
              <span className="leader-tag">
                <FaTrophy /> Leader
              </span>
            )}
          </div>
        </div>
        <button className="header-menu-btn">
          <FaEllipsisV />
        </button>
      </header>

      <main className="profile-main">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card today-points">
            <div className="stat-icon-wrapper">
              <FaStar className="stat-icon" />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.todayPoints}</span>
              <span className="stat-label">Today's Points</span>
            </div>
          </div>
          <div className="stat-card month-points">
            <div className="stat-icon-wrapper">
              <FaCalendarAlt className="stat-icon" />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.monthPoints}</span>
              <span className="stat-label">This Month</span>
            </div>
          </div>
          <div className="stat-card total-points">
            <div className="stat-icon-wrapper">
              <FaAward className="stat-icon" />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalPoints}</span>
              <span className="stat-label">Total Points</span>
            </div>
          </div>
          <div className="stat-card completion-rate">
            <div className="stat-icon-wrapper">
              <FaFire className="stat-icon" />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.completionRate}%</span>
              <span className="stat-label">Completion Rate</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {/* <div className="progress-section">
          <div className="progress-header">
            <span>Daily Progress</span>
            <span>{stats.completedTasks}/{stats.totalTasks} tasks done</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
        </div> */}

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            Today's Tasks
          </button>
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Tasks
          </button>
        </div>

        {/* Common Tasks */}
        <div className="tasks-section">
          <div className="section-header">
            <h3>Common Tasks</h3>
            <span className="task-count">{commonTasks.length} tasks</span>
          </div>
          <div className="tasks-list">
            {commonTasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks for today</p>
              </div>
            ) : (
              commonTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`task-item ${task.done ? 'task-done' : ''}`}
                  onClick={() => toggleTaskStatus(task.id)}
                >
                  <div className="task-left">
                    <div className="task-check">
                      {task.done ? (
                        <FaCheckCircle className="check-icon done" />
                      ) : (
                        <div className="check-circle pending"></div>
                      )}
                    </div>
                    <div className="task-content">
                      <span className="task-name">{task.name}</span>
                      <span className="task-time">
                        <FaClock className="time-icon" />
                        {task.time}
                      </span>
                    </div>
                  </div>
                  <div className="task-right">
                    <span className="task-points">+{task.points}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Extra Tasks */}
        <div className="tasks-section">
          <div className="section-header">
            <h3>Extra Tasks</h3>
            <span className="task-count">{extraTasks.length} tasks</span>
          </div>
          <div className="tasks-list">
            {extraTasks.length === 0 ? (
              <div className="empty-state">
                <p>No extra tasks added</p>
              </div>
            ) : (
              extraTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`task-item ${task.done ? 'task-done' : ''}`}
                >
                  <div className="task-left">
                    <div 
                      className="task-check"
                      onClick={() => toggleTaskStatus(task.id, true)}
                    >
                      {task.done ? (
                        <FaCheckCircle className="check-icon done" />
                      ) : (
                        <div className="check-circle pending"></div>
                      )}
                    </div>
                    <div className="task-content">
                      <span className="task-name">{task.name}</span>
                    </div>
                  </div>
                  <div className="task-right">
                    <span className="task-points">+{task.points}</span>
                    <button 
                      className="delete-task-btn"
                      onClick={() => handleDeleteExtraTask(task.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Extra Task Button */}
        {!showExtraTaskInput ? (
          <button 
            className="add-extra-task-btn"
            onClick={() => setShowExtraTaskInput(true)}
          >
            <FaPlus /> Add Extra Task
          </button>
        ) : (
          <form onSubmit={handleAddExtraTask} className="add-task-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="Task name"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                className="form-input"
                required
              />
              <input
                type="number"
                placeholder="Points"
                value={newTaskPoints}
                onChange={(e) => setNewTaskPoints(e.target.value)}
                className="form-input points-input"
                required
                min="1"
              />
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowExtraTaskInput(false)}
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                <FaPlus /> Add Task
              </button>
            </div>
          </form>
        )}

        {/* Spacer */}
        <div className="bottom-spacer"></div>
      </main>

      {/* Bottom Action Bar */}
      <div className="bottom-action-bar">
        <button className="action-btn add-points">
          <FaPlus />
          <span>Add Points</span>
        </button>
        <button className="action-btn deduct-points">
          <FaMinus />
          <span>Deduct Points</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className="nav-item">
          <FaHome className="nav-icon" />
          <span>Home</span>
        </button>
        <button className="nav-item active">
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
        <button className="nav-item">
          <FaCog className="nav-icon" />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default ChildProfile;