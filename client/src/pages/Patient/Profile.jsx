import React, { useState } from "react";
import {
  FaUserCircle,
  FaEdit,
  FaHistory,
  FaFileMedicalAlt,
  FaHeartbeat,
} from "react-icons/fa";
import { MdPersonalInjury, MdWorkOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../../components/BottomNav";

const Profile = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const profileData = {
    personal: {
      Name: "John Doe",
      "Contact Number": "+1 234 567 890",
      "Email ID": "johndoe@example.com",
      Gender: "Male",
      DOB: "Jan 1, 1990",
      "Blood Group": "O+",
      "Marital Status": "Single",
      Height: "5'9\"",
      Weight: "70kg",
      "Emergency Contact": "+1 987 654 321",
      Location: "New York, USA",
    },
    medical: {
      Allergies: "Peanuts, Shellfish",
      "Current Medications": "None",
      "Past Medications": "Antibiotics (2023), Antihistamines (2022)",
      Injuries: "Fractured wrist (2018)",
      Surgeries: "Appendectomy (2015)",
      "Chronic Conditions": "None",
      "Family History": "Diabetes, Hypertension",
    },
    lifestyle: {
      "Smoking Habits": "Non-Smoker",
      "Alcohol Consumption": "Occasional",
      "Activity Level": "Active (3-4x/week)",
      "Food Preference": "Vegetarian",
      Occupation: "Software Engineer",
      "Sleep Pattern": "7-8 hours/night",
      "Stress Level": "Moderate",
    },
  };

  const sectionIcons = {
    personal: <FaUserCircle className="section-icon" />,
    medical: <FaHeartbeat className="section-icon" />,
    lifestyle: <MdWorkOutline className="section-icon" />,
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData(profileData[activeSection]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send the updated data to your backend
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar-container">
            <FaUserCircle size={100} className="profile-icon" />
            <button className="edit-avatar-btn">
              <FaEdit size={18} />
            </button>
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{profileData.personal.Name}</h2>
            <p className="profile-email">{profileData.personal["Email ID"]}</p>
            <p className="profile-meta">
              {profileData.personal["Blood Group"]} •{" "}
              {profileData.personal.Age || "34"} yrs
            </p>
          </div>
        </div>

        {/* Toggle Section */}
        <div className="toggle-container">
          {Object.keys(profileData).map((section) => (
            <button
              key={section}
              className={`toggle-btn ${
                activeSection === section ? "active" : ""
              }`}
              onClick={() => setActiveSection(section)}
            >
              {sectionIcons[section]}
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Profile Details Section */}
        <div className="profile-section">
          <div className="section-header">
            <h3 className="section-title">
              {sectionIcons[activeSection]}
              {activeSection.charAt(0).toUpperCase() +
                activeSection.slice(1)}{" "}
              Information
            </h3>
            {!isEditing && (
              <button className="edit-btn" onClick={handleEditClick}>
                <FaEdit /> Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="edit-form">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="form-group">
                  <label className="form-label">{key}</label>
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              ))}
              <div className="form-actions">
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-details">
              {Object.entries(profileData[activeSection]).map(
                ([key, value]) => (
                  <div key={key} className="profile-row">
                    <span className="profile-label">{key}:</span>
                    <span className="profile-value">
                      {value || "Not specified"}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />

      <style jsx="true">{`
        /* Main Profile Container */
        .profile-container {
          max-width: 800px;
          margin: 20px auto 100px;
          padding: 20px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        /* Profile Header */
        .profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px 0;
          margin-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .avatar-container {
          position: relative;
        }

        .profile-icon {
          color: #5e0d97;
          transition: transform 0.3s ease;
        }

        .edit-avatar-btn {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background: #9900ff;
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .edit-avatar-btn:hover {
          background: #7b00cc;
          transform: scale(1.1);
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin: 0 0 5px;
        }

        .profile-email {
          font-size: 14px;
          color: #666;
          margin: 0 0 8px;
        }

        .profile-meta {
          font-size: 14px;
          color: #9900ff;
          background: #f0e5ff;
          padding: 4px 10px;
          border-radius: 20px;
          display: inline-block;
        }

        /* Toggle Section */
        .toggle-container {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: 2px solid #9900ff;
          border-radius: 30px;
          background: transparent;
          color: #9900ff;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .toggle-btn.active {
          background: #9900ff;
          color: white;
          box-shadow: 0 4px 15px rgba(153, 0, 255, 0.2);
        }

        .toggle-btn:hover:not(.active) {
          background: rgba(153, 0, 255, 0.1);
        }

        .section-icon {
          font-size: 18px;
        }

        /* Profile Section */
        .profile-section {
          background: linear-gradient(135deg, #ffffff, #f3f6ff);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          color: #5e0d97;
          margin: 0;
        }

        .edit-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #9900ff;
          color: white;
          border: none;
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .edit-btn:hover {
          background: #7b00cc;
          transform: translateY(-2px);
        }

        /* Profile Details */
        .profile-details {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }

        .profile-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
        }

        .profile-row:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .profile-label {
          font-weight: 600;
          color: #333;
        }

        .profile-value {
          color: #555;
          text-align: right;
        }

        /* Edit Form */
        .edit-form {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-label {
          display: block;
          font-weight: 600;
          margin-bottom: 6px;
          color: #333;
          font-size: 14px;
        }

        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s;
        }

        .form-input:focus {
          border-color: #9900ff;
          box-shadow: 0 0 0 3px rgba(153, 0, 255, 0.1);
          outline: none;
        }

        .form-actions {
          grid-column: 1 / -1;
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .save-btn {
          background: #5e0d97;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .save-btn:hover {
          background: #7a24b8;
          transform: translateY(-2px);
        }

        .cancel-btn {
          background: #f0f0f0;
          color: #666;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .cancel-btn:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .profile-details,
          .edit-form {
            grid-template-columns: 1fr;
          }

          .toggle-container {
            flex-direction: column;
            align-items: stretch;
          }

          .toggle-btn {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .profile-container {
            padding: 15px;
            margin: 10px auto 80px;
          }

          .form-actions {
            flex-direction: column;
          }

          .save-btn,
          .cancel-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default Profile;
