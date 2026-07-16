// AddChild.jsx
import React, { useState } from 'react';
import { 
  FaArrowLeft,
  FaUserPlus,
  FaCamera,
  FaUser,
  FaCalendar,
  FaVenusMars,
  FaMars,
  FaVenus,
  FaSave,
  FaHome,
  FaTasks,
  FaChartBar,
  FaCog,
  FaUserCircle
} from 'react-icons/fa';
import './AddChild.css';
import { addMember } from '../database/member';

const AddChild = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Boy',
    photo: null
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    try {
      const res = await addMember(formData);
      console.log(res)
      
    } catch (error) {
      console.log(error)
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
          <FaUserPlus className="header-icon" />
          <span className="header-title">Add Child</span>
        </div>
        <div className="header-placeholder"></div>
      </header>

      {/* Main Content */}
      <main className="page">
        <form onSubmit={handleSubmit} className="add-child-form">
          {/* Photo Upload Section */}
          <div className="photo-upload-section card">
            <div className="photo-upload-container">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Child profile" 
                  className="profile-photo"
                />
              ) : (
                <div className="photo-placeholder">
                  <FaUserCircle className="placeholder-icon" />
                </div>
              )}
              <label htmlFor="photo-upload" className="upload-btn">
                <FaCamera />
                <span>Upload Photo</span>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-fields card">
            <div className="form-group">
              <label htmlFor="fullName">
                <FaUser className="input-icon" />
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">
                <FaCalendar className="input-icon" />
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Enter age"
                className="input"
                min="1"
                max="18"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaVenusMars className="input-icon" />
                Gender
              </label>
              <div className="gender-options">
                <label className={`gender-option ${formData.gender === 'Boy' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="gender"
                    value="Boy"
                    checked={formData.gender === 'Boy'}
                    onChange={handleInputChange}
                  />
                  <FaMars className="gender-icon male" />
                  <span>Boy</span>
                </label>
                <label className={`gender-option ${formData.gender === 'Girl' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="gender"
                    value="Girl"
                    checked={formData.gender === 'Girl'}
                    onChange={handleInputChange}
                  />
                  <FaVenus className="gender-icon female" />
                  <span>Girl</span>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button type="submit" className="btn btn-primary save-btn">
            <FaSave /> Save Child
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
        <button className="nav-item active">
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

export default AddChild;