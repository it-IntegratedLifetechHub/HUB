import React, { useState } from "react";
import LabNav from "../../components/LabNav";
import {
  FaUserCircle,
  FaEdit,
  FaSave,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaShieldAlt,
  FaPlus,
  FaTrash,
  FaCheck,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  MdMedicalServices,
  MdWorkHistory,
  MdVerifiedUser,
} from "react-icons/md";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Dr. Sarah Johnson",
    role: "Senior Lab Technician",
    email: "s.johnson@labmed.org",
    phone: "+1 (555) 123-4567",
    address: "123 Medical Drive, Lab Complex B, Boston, MA 02115",
    joinDate: "June 15, 2018",
    specialization: "Hematology & Clinical Chemistry",
    certifications: [
      { id: 1, name: "MLS(ASCP)", expiry: "2025-12-31" },
      { id: 2, name: "SH(ASCP)", expiry: "2024-06-30" },
    ],
    department: "Clinical Pathology",
    emergencyContact: "Michael Johnson (Spouse) +1 (555) 987-6543",
    bio: "Experienced laboratory professional with 8+ years in clinical diagnostics. Specialized in hematology and clinical chemistry with a focus on quality control and process improvement.",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordLastChanged: "March 15, 2023",
    loginAlerts: true,
    activeSessions: [
      {
        id: 1,
        device: "MacBook Pro",
        location: "Boston, MA",
        lastActive: "2 hours ago",
      },
      {
        id: 2,
        device: "iPhone 13",
        location: "Boston, MA",
        lastActive: "30 minutes ago",
      },
    ],
  });

  const [workHistory, setWorkHistory] = useState([
    {
      id: 1,
      position: "Senior Lab Technician",
      facility: "Boston Medical Diagnostics",
      duration: "2018 - Present",
      responsibilities: [
        "Perform complex laboratory tests",
        "Train junior technicians",
        "Quality control management",
        "Implement new testing protocols",
      ],
      expanded: false,
    },
    {
      id: 2,
      position: "Lab Technician",
      facility: "Cambridge Clinical Labs",
      duration: "2015 - 2018",
      responsibilities: [
        "Routine laboratory testing",
        "Sample processing",
        "Equipment maintenance",
        "Data entry and reporting",
      ],
      expanded: false,
    },
  ]);

  const [newCertification, setNewCertification] = useState({
    name: "",
    expiry: "",
  });
  const [newWorkExperience, setNewWorkExperience] = useState({
    position: "",
    facility: "",
    startDate: "",
    endDate: "",
    responsibilities: [""],
  });
  const [showAddCertification, setShowAddCertification] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCertificationChange = (e) => {
    const { name, value } = e.target;
    setNewCertification((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkExperienceChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "responsibilities") {
      const newResponsibilities = [...newWorkExperience.responsibilities];
      newResponsibilities[index] = value;
      setNewWorkExperience((prev) => ({
        ...prev,
        responsibilities: newResponsibilities,
      }));
    } else {
      setNewWorkExperience((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addResponsibility = () => {
    setNewWorkExperience((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }));
  };

  const removeResponsibility = (index) => {
    const newResponsibilities = [...newWorkExperience.responsibilities];
    newResponsibilities.splice(index, 1);
    setNewWorkExperience((prev) => ({
      ...prev,
      responsibilities: newResponsibilities,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would save to backend here
    console.log("Profile saved:", profileData);
  };

  const toggleTwoFactorAuth = () => {
    setSecuritySettings((prev) => ({
      ...prev,
      twoFactorAuth: !prev.twoFactorAuth,
    }));
  };

  const toggleLoginAlerts = () => {
    setSecuritySettings((prev) => ({
      ...prev,
      loginAlerts: !prev.loginAlerts,
    }));
  };

  const addCertification = () => {
    if (newCertification.name.trim()) {
      setProfileData((prev) => ({
        ...prev,
        certifications: [
          ...prev.certifications,
          {
            id: Date.now(),
            name: newCertification.name,
            expiry: newCertification.expiry,
          },
        ],
      }));
      setNewCertification({ name: "", expiry: "" });
      setShowAddCertification(false);
    }
  };

  const removeCertification = (id) => {
    setProfileData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }));
  };

  const addWorkExperience = () => {
    if (
      newWorkExperience.position.trim() &&
      newWorkExperience.facility.trim()
    ) {
      setWorkHistory((prev) => [
        {
          id: Date.now(),
          position: newWorkExperience.position,
          facility: newWorkExperience.facility,
          duration: `${newWorkExperience.startDate} - ${
            newWorkExperience.endDate || "Present"
          }`,
          responsibilities: newWorkExperience.responsibilities.filter((r) =>
            r.trim()
          ),
          expanded: false,
        },
        ...prev,
      ]);
      setNewWorkExperience({
        position: "",
        facility: "",
        startDate: "",
        endDate: "",
        responsibilities: [""],
      });
      setShowAddExperience(false);
    }
  };

  const removeWorkExperience = (id) => {
    setWorkHistory((prev) => prev.filter((exp) => exp.id !== id));
  };

  const toggleWorkExperience = (id) => {
    setWorkHistory((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, expanded: !exp.expanded } : exp
      )
    );
  };

  const terminateSession = (id) => {
    setSecuritySettings((prev) => ({
      ...prev,
      activeSessions: prev.activeSessions.filter(
        (session) => session.id !== id
      ),
    }));
  };

  return (
    <div className="lab-profile">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="avatar-section">
          <div className="avatar-container">
            <FaUserCircle size={120} className="profile-avatar" />
            {isEditing && (
              <button className="edit-avatar-btn">
                <FaEdit size={18} />
              </button>
            )}
          </div>
          <div className="verification-badge">
            <MdVerifiedUser /> Verified Employee
          </div>
        </div>
        <div className="profile-info">
          <div className="name-role">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <h1>{profileData.name}</h1>
            )}
            {isEditing ? (
              <input
                type="text"
                name="role"
                value={profileData.role}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <h2>{profileData.role}</h2>
            )}
          </div>
          <div className="department-specialization">
            <MdMedicalServices />
            <span>{profileData.department}</span>
            <span>•</span>
            <span>{profileData.specialization}</span>
          </div>
          {profileData.bio && (
            <div className="profile-bio">
              <p>{profileData.bio}</p>
              {isEditing && (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className="edit-input bio-edit"
                  rows="3"
                />
              )}
            </div>
          )}
        </div>
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>
                <FaSave /> Save Profile
              </button>
              <button
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="profile-content">
        {/* Personal Information Section */}
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div>
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  <p>{profileData.email}</p>
                )}
              </div>
            </div>
            <div className="info-item">
              <FaPhone className="info-icon" />
              <div>
                <label>Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  <p>{profileData.phone}</p>
                )}
              </div>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <label>Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    className="edit-input"
                    rows="2"
                  />
                ) : (
                  <p>{profileData.address}</p>
                )}
              </div>
            </div>
            <div className="info-item">
              <FaCalendarAlt className="info-icon" />
              <div>
                <label>Join Date</label>
                <p>{profileData.joinDate}</p>
              </div>
            </div>
            <div className="info-item">
              <FaShieldAlt className="info-icon" />
              <div>
                <label>Emergency Contact</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergencyContact"
                    value={profileData.emergencyContact}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  <p>{profileData.emergencyContact}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Certifications Section */}
        <div className="profile-section">
          <div className="section-header">
            <h3>Certifications</h3>
            {isEditing && (
              <button
                className="add-btn"
                onClick={() => setShowAddCertification(!showAddCertification)}
              >
                <FaPlus />{" "}
                {showAddCertification ? "Cancel" : "Add Certification"}
              </button>
            )}
          </div>

          {showAddCertification && (
            <div className="add-certification-form">
              <div className="form-group">
                <label>Certification Name</label>
                <input
                  type="text"
                  name="name"
                  value={newCertification.name}
                  onChange={handleCertificationChange}
                  placeholder="e.g., MLS(ASCP)"
                />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiry"
                  value={newCertification.expiry}
                  onChange={handleCertificationChange}
                />
              </div>
              <button className="confirm-add-btn" onClick={addCertification}>
                <FaCheck /> Add Certification
              </button>
            </div>
          )}

          <div className="certifications-grid">
            {profileData.certifications.map((cert) => (
              <div key={cert.id} className="certification-badge">
                <span>{cert.name}</span>
                {cert.expiry && (
                  <span className="expiry">Exp: {cert.expiry}</span>
                )}
                {isEditing && (
                  <button
                    className="remove-cert-btn"
                    onClick={() => removeCertification(cert.id)}
                  >
                    <FaTrash size={12} />
                  </button>
                )}
              </div>
            ))}
            {profileData.certifications.length === 0 && !isEditing && (
              <p className="no-items">No certifications added</p>
            )}
          </div>
        </div>

        {/* Work History Section */}
        <div className="profile-section">
          <div className="section-header">
            <h3>Work History</h3>
            {isEditing && (
              <button
                className="add-btn"
                onClick={() => setShowAddExperience(!showAddExperience)}
              >
                <FaPlus /> {showAddExperience ? "Cancel" : "Add Experience"}
              </button>
            )}
          </div>

          {showAddExperience && (
            <div className="add-experience-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    name="position"
                    value={newWorkExperience.position}
                    onChange={(e) => handleWorkExperienceChange(e)}
                    placeholder="e.g., Senior Lab Technician"
                  />
                </div>
                <div className="form-group">
                  <label>Facility</label>
                  <input
                    type="text"
                    name="facility"
                    value={newWorkExperience.facility}
                    onChange={(e) => handleWorkExperienceChange(e)}
                    placeholder="e.g., Boston Medical Center"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={newWorkExperience.startDate}
                    onChange={(e) => handleWorkExperienceChange(e)}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={newWorkExperience.endDate}
                    onChange={(e) => handleWorkExperienceChange(e)}
                    placeholder="Leave empty if current"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Responsibilities</label>
                {newWorkExperience.responsibilities.map((resp, index) => (
                  <div key={index} className="responsibility-input">
                    <input
                      type="text"
                      name="responsibilities"
                      value={resp}
                      onChange={(e) => handleWorkExperienceChange(e, index)}
                      placeholder="Describe responsibility"
                    />
                    {index > 0 && (
                      <button
                        className="remove-resp-btn"
                        onClick={() => removeResponsibility(index)}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
                <button className="add-resp-btn" onClick={addResponsibility}>
                  <FaPlus /> Add Responsibility
                </button>
              </div>
              <button className="confirm-add-btn" onClick={addWorkExperience}>
                <FaCheck /> Add Experience
              </button>
            </div>
          )}

          <div className="work-history">
            {workHistory.map((job) => (
              <div key={job.id} className="work-item">
                <div
                  className="work-header"
                  onClick={() => toggleWorkExperience(job.id)}
                >
                  <MdWorkHistory size={24} />
                  <div className="work-info">
                    <h4>{job.position}</h4>
                    <p className="facility">{job.facility}</p>
                    <p className="duration">{job.duration}</p>
                  </div>
                  <div className="work-actions">
                    {isEditing && (
                      <button
                        className="remove-work-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeWorkExperience(job.id);
                        }}
                      >
                        <FaTrash />
                      </button>
                    )}
                    <span className="toggle-icon">
                      {job.expanded ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </div>
                </div>
                {job.expanded && (
                  <ul className="responsibilities">
                    {job.responsibilities.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {workHistory.length === 0 && !isEditing && (
              <p className="no-items">No work history added</p>
            )}
          </div>
        </div>

        {/* Security Settings Section */}
        <div className="profile-section">
          <h3>Security Settings</h3>
          <div className="security-settings">
            <div className="security-item">
              <div className="security-info">
                <h4>Two-Factor Authentication</h4>
                <p>Extra layer of security for your account</p>
                {securitySettings.twoFactorAuth && (
                  <span className="security-status active">
                    <FaCheck /> Currently active
                  </span>
                )}
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securitySettings.twoFactorAuth}
                  onChange={toggleTwoFactorAuth}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="security-item">
              <div className="security-info">
                <h4>Login Alerts</h4>
                <p>Get notified of new logins to your account</p>
                {securitySettings.loginAlerts && (
                  <span className="security-status active">
                    <FaCheck /> Notifications enabled
                  </span>
                )}
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securitySettings.loginAlerts}
                  onChange={toggleLoginAlerts}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="security-item">
              <div className="security-info">
                <h4>Password</h4>
                <p>Last changed: {securitySettings.passwordLastChanged}</p>
              </div>
              <button className="change-password-btn">
                <FaLock /> Change Password
              </button>
            </div>

            <div className="active-sessions">
              <h4>Active Sessions</h4>
              {securitySettings.activeSessions.map((session) => (
                <div key={session.id} className="session-item">
                  <div className="session-info">
                    <span className="session-device">{session.device}</span>
                    <span className="session-location">{session.location}</span>
                    <span className="session-time">{session.lastActive}</span>
                  </div>
                  <button
                    className="terminate-btn"
                    onClick={() => terminateSession(session.id)}
                  >
                    Terminate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <LabNav />

      <style jsx>{`
        .lab-profile {
          padding: 2rem;
          padding-bottom: 6rem;
          max-width: 1200px;
          margin: 0 auto;
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        /* Profile Header */
        .profile-header {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .avatar-section {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .avatar-container {
          position: relative;
        }

        .profile-avatar {
          color: #5e0d97;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .verification-badge {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .edit-avatar-btn {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: #5e0d97;
          color: white;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .edit-avatar-btn:hover {
          background: #7b00cc;
          transform: scale(1.1);
        }

        .profile-info {
          flex: 1;
          min-width: 300px;
        }

        .name-role h1 {
          font-size: 2rem;
          color: #2b2d42;
          margin-bottom: 0.5rem;
        }

        .name-role h2 {
          font-size: 1.2rem;
          color: #5e0d97;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .department-specialization {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6c757d;
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }

        .profile-bio {
          color: #495057;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-top: 1rem;
        }

        .bio-edit {
          width: 100%;
          margin-top: 0.5rem;
        }

        .profile-actions {
          align-self: flex-start;
          display: flex;
          gap: 1rem;
        }

        .edit-btn,
        .save-btn,
        .cancel-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .edit-btn {
          background: #5e0d97;
          color: white;
        }

        .edit-btn:hover {
          background: #7b00cc;
          transform: translateY(-2px);
        }

        .save-btn {
          background: #28a745;
          color: white;
        }

        .save-btn:hover {
          background: #218838;
          transform: translateY(-2px);
        }

        .cancel-btn {
          background: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
        }

        .cancel-btn:hover {
          background: #e9ecef;
        }

        /* Profile Content */
        .profile-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .profile-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .profile-section h3 {
          color: #2b2d42;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e9ecef;
          font-size: 1.3rem;
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8f9fa;
          color: #5e0d97;
          border: 1px solid #5e0d97;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-btn:hover {
          background: #f0e5ff;
        }

        /* Personal Information */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .info-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .info-icon {
          color: #5e0d97;
          margin-top: 0.3rem;
          font-size: 1.2rem;
        }

        .info-item label {
          font-size: 0.8rem;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.3rem;
          display: block;
        }

        .info-item p {
          color: #2b2d42;
          font-size: 0.95rem;
          margin: 0;
        }

        .edit-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 0.95rem;
        }

        .edit-input:focus {
          outline: none;
          border-color: #5e0d97;
          box-shadow: 0 0 0 3px rgba(94, 13, 151, 0.1);
        }

        /* Certifications */
        .add-certification-form {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.3rem;
          font-size: 0.9rem;
          color: #495057;
        }

        .form-group input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
        }

        .form-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-row .form-group {
          flex: 1;
          margin-bottom: 0;
        }

        .confirm-add-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #5e0d97;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .confirm-add-btn:hover {
          background: #7b00cc;
        }

        .certifications-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
        }

        .certification-badge {
          background: #f0e5ff;
          color: #5e0d97;
          padding: 0.7rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          position: relative;
        }

        .expiry {
          font-size: 0.75rem;
          color: #6c757d;
        }

        .remove-cert-btn {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          padding: 0.2rem;
          display: flex;
          align-items: center;
        }

        .no-items {
          color: #6c757d;
          font-style: italic;
        }

        /* Work History */
        .add-experience-form {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .responsibility-input {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .responsibility-input input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
        }

        .remove-resp-btn {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          padding: 0 0.5rem;
          display: flex;
          align-items: center;
        }

        .add-resp-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: none;
          border: none;
          color: #5e0d97;
          cursor: pointer;
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        .work-history {
          display: grid;
          gap: 1.5rem;
        }

        .work-item {
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e9ecef;
        }

        .work-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .work-header {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1rem;
          cursor: pointer;
        }

        .work-info {
          flex: 1;
        }

        .work-info h4 {
          color: #2b2d42;
          margin: 0;
          font-size: 1.1rem;
        }

        .facility {
          color: #5e0d97;
          font-size: 0.9rem;
          margin: 0.2rem 0;
        }

        .duration {
          color: #6c757d;
          font-size: 0.85rem;
          margin: 0;
        }

        .work-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .remove-work-btn {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
        }

        .toggle-icon {
          color: #6c757d;
        }

        .responsibilities {
          padding-left: 1.5rem;
          margin: 1rem 0 0;
        }

        .responsibilities li {
          color: #495057;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        /* Security Settings */
        .security-settings {
          display: grid;
          gap: 1.5rem;
        }

        .security-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e9ecef;
        }

        .security-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .security-info {
          flex: 1;
        }

        .security-item h4 {
          color: #2b2d42;
          margin: 0 0 0.3rem;
          font-size: 1rem;
        }

        .security-item p {
          color: #6c757d;
          font-size: 0.85rem;
          margin: 0;
        }

        .security-status {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.8rem;
          margin-top: 0.5rem;
          color: #28a745;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ced4da;
          transition: 0.4s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #5e0d97;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .change-password-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8f9fa;
          color: #2b2d42;
          border: 1px solid #dee2e6;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .change-password-btn:hover {
          background: #e9ecef;
        }

        /* Active Sessions */
        .active-sessions {
          margin-top: 2rem;
        }

        .active-sessions h4 {
          color: #2b2d42;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .session-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 0;
          border-bottom: 1px solid #e9ecef;
        }

        .session-info {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .session-device {
          font-weight: 500;
          color: #2b2d42;
        }

        .session-location {
          font-size: 0.85rem;
          color: #6c757d;
        }

        .session-time {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .terminate-btn {
          background: none;
          border: 1px solid #dc3545;
          color: #dc3545;
          padding: 0.3rem 0.8rem;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .terminate-btn:hover {
          background: #f8d7da;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .profile-info {
            text-align: center;
          }

          .department-specialization {
            justify-content: center;
          }

          .profile-actions {
            align-self: center;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            flex-direction: column;
            gap: 1rem;
          }
        }

        @media (max-width: 576px) {
          .lab-profile {
            padding: 1.5rem;
            padding-bottom: 5rem;
          }

          .security-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .session-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .terminate-btn {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
