import React, { useState } from "react";
import {
  FaUser,
  FaIdCard,
  FaHospital,
  FaChartLine,
  FaCertificate,
  FaShieldAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaEdit,
  FaClock,
  FaStethoscope,
  FaHeartbeat,
  FaUserMd,
  FaRegCalendarAlt,
  FaClinicMedical,
  FaProcedures,
  FaBookMedical,
} from "react-icons/fa";
import { RiHeartPulseFill } from "react-icons/ri";
import DoctorNav from "../../components/DoctorNav";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState({
    name: "Dr. Michael Chen",
    employeeId: "DOC-2023-0789",
    specialization: "Cardiology & Internal Medicine",
    hospital: "Prestige Medical Center",
    experience: "12 years",
    certifications: ["Board Certified Cardiologist", "ACLS", "FACP"],
    contact: "+1 (555) 789-0123",
    email: "m.chen@prestigemed.com",
    address: "456 Health Avenue, Suite 1200, New York, NY 10001",
    workingHours: "Mon-Thu: 8:00 AM - 5:00 PM, Fri: 8:00 AM - 12:00 PM",
    emergencyContact: "+1 (555) 456-7890",
    bio: "Specialized in cardiovascular diseases and preventive cardiology. Committed to providing personalized care with evidence-based medicine. Passionate about patient education and heart health awareness.",
  });

  const stats = {
    totalPatients: "3,245",
    successRate: "99.2%",
    patientSatisfaction: "4.8",
    avgConsultationTime: "15",
    yearsExperience: "12",
  };

  const specializations = [
    {
      title: "Cardiac Care",
      icon: <FaHeartbeat />,
      description:
        "Specialized in diagnosis and treatment of heart conditions, including coronary artery disease, heart failure, and arrhythmias.",
    },
    {
      title: "Preventive Cardiology",
      icon: <RiHeartPulseFill />,
      description:
        "Focused on risk assessment and prevention of cardiovascular diseases through lifestyle modifications and medical management.",
    },
    {
      title: "Non-Invasive Procedures",
      icon: <FaProcedures />,
      description:
        "Expertise in echocardiography, stress testing, and Holter monitoring for comprehensive cardiac evaluation.",
    },
    {
      title: "Patient Education",
      icon: <FaBookMedical />,
      description:
        "Committed to educating patients about heart health, medication management, and long-term wellness strategies.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setEditMode(false);
    // API call to save data would go here
  };

  return (
    <div className="profile-container">
      {/* Profile Header with Hero Section */}
      <div className="profile-hero">
        <div className="hero-overlay"></div>
        <div className="profile-header">
          <div className="avatar-container">
            <div className="avatar">MC</div>
            <div className="online-status"></div>
          </div>
          <div className="header-info">
            <h1>{profileData.name}</h1>
            <p className="role">Senior Cardiologist</p>
            <div className="badges">
              <span className="badge certified">
                <FaCertificate /> Board Certified
              </span>
              <span className="badge verified">
                <FaShieldAlt /> Verified
              </span>
            </div>
          </div>
          <button
            className={`edit-btn ${editMode ? "cancel" : ""}`}
            onClick={() => setEditMode(!editMode)}
          >
            <FaEdit /> {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "professional" ? "active" : ""}`}
          onClick={() => setActiveTab("professional")}
        >
          Professional
        </button>
        <button
          className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          Statistics
        </button>
        <button
          className={`tab-btn ${
            activeTab === "specializations" ? "active" : ""
          }`}
          onClick={() => setActiveTab("specializations")}
        >
          Specializations
        </button>
      </div>

      <div className="profile-content">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="tab-content">
            <div className="profile-section card">
              <h2>
                <FaUserMd /> Professional Summary
              </h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Specialization</label>
                  <div className="info-value">
                    <FaStethoscope /> {profileData.specialization}
                  </div>
                </div>
                <div className="info-item">
                  <label>Hospital/Clinic</label>
                  <div className="info-value">
                    <FaHospital /> {profileData.hospital}
                  </div>
                </div>
                <div className="info-item">
                  <label>Experience</label>
                  <div className="info-value">
                    <FaRegCalendarAlt /> {profileData.experience}
                  </div>
                </div>
              </div>

              <div className="info-item">
                <label>Bio</label>
                {editMode ? (
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="modern-input"
                  />
                ) : (
                  <div className="info-value bio">{profileData.bio}</div>
                )}
              </div>
            </div>

            <div className="profile-section card">
              <h2>
                <FaPhone /> Contact Information
              </h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Phone</label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="contact"
                      value={profileData.contact}
                      onChange={handleInputChange}
                      className="modern-input"
                    />
                  ) : (
                    <div className="info-value">
                      <FaPhone /> {profileData.contact}
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <label>Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="modern-input"
                    />
                  ) : (
                    <div className="info-value">
                      <FaEnvelope /> {profileData.email}
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <label>Address</label>
                  {editMode ? (
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      className="modern-input"
                    />
                  ) : (
                    <div className="info-value">
                      <FaMapMarkerAlt /> {profileData.address}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Professional Tab */}
        {activeTab === "professional" && (
          <div className="tab-content">
            <div className="profile-section card">
              <h2>
                <FaIdCard /> Professional Details
              </h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Doctor ID</label>
                  <div className="info-value">{profileData.employeeId}</div>
                </div>
                <div className="info-item">
                  <label>Working Hours</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="workingHours"
                      value={profileData.workingHours}
                      onChange={handleInputChange}
                      className="modern-input"
                    />
                  ) : (
                    <div className="info-value">
                      <FaClock /> {profileData.workingHours}
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <label>Emergency Contact</label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={handleInputChange}
                      className="modern-input"
                    />
                  ) : (
                    <div className="info-value">
                      <FaPhone /> {profileData.emergencyContact}
                    </div>
                  )}
                </div>
              </div>

              <div className="info-item">
                <label>Certifications</label>
                {editMode ? (
                  <textarea
                    name="certifications"
                    value={profileData.certifications.join(", ")}
                    onChange={(e) => {
                      setProfileData((prev) => ({
                        ...prev,
                        certifications: e.target.value.split(", "),
                      }));
                    }}
                    className="modern-input"
                  />
                ) : (
                  <div className="info-value">
                    <ul className="certification-list">
                      {profileData.certifications.map((cert, index) => (
                        <li key={index}>
                          <FaCertificate /> {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === "stats" && (
          <div className="tab-content">
            <div className="profile-section card">
              <h2>
                <FaChartLine /> Practice Statistics
              </h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaUser />
                  </div>
                  <div className="stat-value">{stats.totalPatients}</div>
                  <div className="stat-label">Total Patients</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaHeartbeat />
                  </div>
                  <div className="stat-value">{stats.successRate}</div>
                  <div className="stat-label">Success Rate</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaUserMd />
                  </div>
                  <div className="stat-value">{stats.patientSatisfaction}</div>
                  <div className="stat-label">Satisfaction</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaClock />
                  </div>
                  <div className="stat-value">{stats.avgConsultationTime}</div>
                  <div className="stat-label">Avg. Time (mins)</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaRegCalendarAlt />
                  </div>
                  <div className="stat-value">{stats.yearsExperience}</div>
                  <div className="stat-label">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Specializations Tab */}
        {activeTab === "specializations" && (
          <div className="tab-content">
            <div className="profile-section card">
              <h2>Medical Specializations</h2>
              <div className="specializations-grid">
                {specializations.map((spec, index) => (
                  <div className="specialization-card" key={index}>
                    <div className="spec-icon">{spec.icon}</div>
                    <h3>{spec.title}</h3>
                    <p>{spec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {editMode && (
          <div className="action-buttons">
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        )}
      </div>

      <DoctorNav />

      <style jsx="true">{`
        /* Modern Color Variables */
        :root {
          --primary-color: #3a7ca5;
          --primary-dark: #2f6690;
          --primary-light: #d9e9f5;
          --secondary-color: #5cb85c;
          --accent-color: #f0ad4e;
          --text-dark: #2c3e50;
          --text-medium: #495057;
          --text-light: #6c757d;
          --bg-light: #f8f9fa;
          --border-radius: 10px;
          --border-radius-lg: 15px;
          --box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          --box-shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.12);
          --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        /* Base Styles */
        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px 100px;
          font-family: "Poppins", "Outfit", sans-serif;
          color: var(--text-dark);
          background-color: var(--bg-light);
        }

        /* Hero Section */
        .profile-hero {
          position: relative;
          background: linear-gradient(
            135deg,
            var(--primary-color),
            var(--primary-dark)
          );
          padding: 40px 20px 60px;
          margin-bottom: 30px;
          border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==");
          opacity: 0.6;
        }

        /* Header Section */
        .profile-header {
          position: relative;
          display: flex;
          align-items: flex-end;
          gap: 30px;
          flex-wrap: wrap;
          z-index: 2;
        }

        .avatar-container {
          position: relative;
        }

        .avatar {
          width: 100px;
          height: 100px;
          background-color: white;
          color: var(--primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: bold;
          border: 4px solid white;
          box-shadow: var(--box-shadow);
        }

        .online-status {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 20px;
          height: 20px;
          background-color: var(--secondary-color);
          border-radius: 50%;
          border: 3px solid white;
        }

        .header-info {
          flex: 1;
          min-width: 250px;
          color: white;
        }

        .header-info h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 600;
        }

        .role {
          margin: 5px 0;
          font-size: 18px;
          opacity: 0.9;
        }

        .badges {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(5px);
        }

        .edit-btn {
          background-color: white;
          color: var(--primary-color);
          border: none;
          padding: 12px 20px;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: var(--transition);
          margin-left: auto;
          box-shadow: var(--box-shadow);
        }

        .edit-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--box-shadow-hover);
        }

        .edit-btn.cancel {
          background-color: #f8f9fa;
          color: var(--danger-color);
        }

        /* Profile Tabs */
        .profile-tabs {
          display: flex;
          margin-bottom: 30px;
          border-bottom: 1px solid #e0e0e0;
        }

        .tab-btn {
          padding: 12px 24px;
          background: none;
          border: none;
          font-size: 16px;
          font-weight: 500;
          color: var(--text-light);
          cursor: pointer;
          position: relative;
          transition: var(--transition);
        }

        .tab-btn:hover {
          color: var(--primary-color);
        }

        .tab-btn.active {
          color: var(--primary-color);
          font-weight: 600;
        }

        .tab-btn.active::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: var(--primary-color);
          border-radius: 3px 3px 0 0;
        }

        /* Profile Content */
        .profile-content {
          padding: 0 10px;
        }

        .tab-content {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0.5;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Profile Sections */
        .profile-section.card {
          background: white;
          border-radius: var(--border-radius-lg);
          padding: 25px;
          margin-bottom: 25px;
          box-shadow: var(--box-shadow);
          transition: var(--transition);
        }

        .profile-section.card:hover {
          transform: translateY(-3px);
          box-shadow: var(--box-shadow-hover);
        }

        .profile-section h2 {
          font-size: 22px;
          margin-top: 0;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--primary-color);
        }

        .profile-section h2 svg {
          font-size: 24px;
        }

        /* Information Grid */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
          margin-bottom: 20px;
        }

        .info-item {
          margin-bottom: 20px;
        }

        .info-item label {
          display: block;
          font-size: 14px;
          color: var(--text-light);
          margin-bottom: 8px;
          font-weight: 500;
        }

        .info-value {
          font-size: 16px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          line-height: 1.5;
        }

        .info-value svg {
          color: var(--primary-color);
          margin-top: 3px;
          flex-shrink: 0;
        }

        .bio {
          line-height: 1.7;
          color: var(--text-medium);
        }

        /* Input Fields */
        .modern-input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-family: "Poppins", sans-serif;
          font-size: 15px;
          transition: var(--transition);
          background-color: #f9f9f9;
        }

        .modern-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(58, 124, 165, 0.1);
          background-color: white;
        }

        textarea.modern-input {
          min-height: 100px;
          resize: vertical;
        }

        /* Certification List */
        .certification-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .certification-list li {
          margin-bottom: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--primary-light);
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
        }

        .certification-list svg {
          color: var(--primary-color);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          border-radius: var(--border-radius);
          padding: 20px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #f0f0f0;
          transition: var(--transition);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          font-size: 24px;
          color: var(--primary-color);
          margin-bottom: 10px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-light);
          font-weight: 500;
        }

        /* Specializations Grid */
        .specializations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .specialization-card {
          background: white;
          border-radius: var(--border-radius);
          padding: 25px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #f0f0f0;
          transition: var(--transition);
        }

        .specialization-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .spec-icon {
          font-size: 28px;
          color: var(--primary-color);
          margin-bottom: 15px;
        }

        .specialization-card h3 {
          margin: 0 0 10px 0;
          color: var(--primary-color);
          font-size: 18px;
        }

        .specialization-card p {
          margin: 0;
          color: var(--text-medium);
          line-height: 1.6;
          font-size: 14px;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          justify-content: flex-end;
          margin-top: 30px;
        }

        .save-btn {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 14px 30px;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(58, 124, 165, 0.2);
        }

        .save-btn:hover {
          background-color: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(58, 124, 165, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .profile-header {
            gap: 20px;
          }

          .avatar {
            width: 90px;
            height: 90px;
            font-size: 32px;
          }

          .header-info h1 {
            font-size: 28px;
          }
        }

        @media (max-width: 768px) {
          .profile-hero {
            padding: 30px 15px 50px;
          }

          .profile-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 15px;
          }

          .header-info {
            text-align: center;
          }

          .badges {
            justify-content: center;
          }

          .edit-btn {
            margin: 10px auto 0;
          }

          .profile-tabs {
            overflow-x: auto;
            padding-bottom: 5px;
          }

          .tab-btn {
            padding: 10px 15px;
            font-size: 14px;
          }
        }

        @media (max-width: 576px) {
          .info-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid,
          .specializations-grid {
            grid-template-columns: 1fr;
          }

          .profile-section.card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
