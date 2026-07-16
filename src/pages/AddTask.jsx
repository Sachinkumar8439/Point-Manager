// AddTask.jsx
import React, { useState } from 'react';
import { 
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaClock,
  FaHome,
  FaTasks,
  FaUserPlus,
  FaChartBar,
  FaCog,
  FaSave,
  FaRegClock
} from 'react-icons/fa';
import './AddTask.css';
import { addTask } from '../database/task';

const AddTask = () => {
  const [taskName, setTaskName] = useState('');
  const [taskNameLength, setTaskNameLength] = useState(0);
  const [hasTimeRange, setHasTimeRange] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [points, setPoints] = useState('');
  const [pointType, setPointType] = useState('add'); // 'add' or 'deduct'

  const handleTaskNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setTaskName(value);
      setTaskNameLength(value.length);
    }
  };

  const handlePointsChange = (e) => {
    const value = e.target.value;
    // Only allow positive numbers
    if (value === '' || /^[0-9]+$/.test(value)) {
      setPoints(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      name:taskName,
      hasTimeRange,
      startTime: hasTimeRange ? startTime : null,
      endTime: hasTimeRange ? endTime : null,
      points: pointType === 'add' ? parseInt(points) : -parseInt(points),
      isCommon:true,
    };
    console.log('Task Data:', taskData);
    try {
      const res = await addTask(taskData);
      console.log(res)
      
    } catch (error) {
      console.error('Error saving task:', error);
    }
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
          <span className="header-title">Add Task</span>
        </div>
        <div className="header-placeholder"></div>
      </header>

      {/* Main Content */}
      <main className="page">
        <form onSubmit={handleSubmit} className="add-task-form">
          {/* Common Task Section */}
          <div className="form-section card">
            <h2 className="section-title">Common Task</h2>
            
            <div className="form-group">
              <label htmlFor="taskName">Task Name</label>
              <input
                id="taskName"
                type="text"
                value={taskName}
                onChange={handleTaskNameChange}
                placeholder="Enter task name"
                className="input"
                required
              />
              <div className="char-counter">{taskNameLength}/50</div>
            </div>
          </div>

          {/* Time Range Section */}
          <div className="form-section card">
            <h2 className="section-title">Time Range (Optional)</h2>
            
            <div className="time-range-toggle">
              <label className={`toggle-option ${!hasTimeRange ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="timeRange"
                  checked={!hasTimeRange}
                  onChange={() => setHasTimeRange(false)}
                />
                <FaRegClock />
                <span>No Time Range</span>
              </label>
              <label className={`toggle-option ${hasTimeRange ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="timeRange"
                  checked={hasTimeRange}
                  onChange={() => setHasTimeRange(true)}
                />
                <FaClock />
                <span>Set Time Range</span>
              </label>
            </div>

            {hasTimeRange && (
              <div className="time-range-fields">
                <div className="form-group">
                  <label htmlFor="startTime">Start Time</label>
                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="input"
                    required={hasTimeRange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endTime">End Time</label>
                  <input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="input"
                    required={hasTimeRange}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Points Section */}
          <div className="form-section card">
            <h2 className="section-title">Points</h2>
            
            <div className="form-group">
              <label htmlFor="points">Enter points</label>
              <div className="points-input-wrapper">
                <button
                  type="button"
                  className={`points-type-btn ${pointType === 'add' ? 'active-add' : ''}`}
                  onClick={() => setPointType('add')}
                >
                  <FaPlus /> Add
                </button>
                <input
                  id="points"
                  type="text"
                  value={points}
                  onChange={handlePointsChange}
                  placeholder="Enter points"
                  className="input points-input"
                  required
                />
                <button
                  type="button"
                  className={`points-type-btn ${pointType === 'deduct' ? 'active-deduct' : ''}`}
                  onClick={() => setPointType('deduct')}
                >
                  <FaMinus /> Deduct
                </button>
              </div>
              <p className="points-hint">Use + for add points, - for deduct points</p>
            </div>
          </div>

          {/* Save Button */}
          <button type="submit" className="btn btn-primary save-task-btn">
            <FaSave /> Save Task
          </button>
        </form>
      </main>

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

export default AddTask;