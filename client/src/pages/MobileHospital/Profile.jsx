import React, { useState, useEffect } from "react";
import MobileHospitalNav from "../../components/MobileHospitalNav";

import {
  FaUser,
  FaIdCard,
  FaAmbulance,
  FaCalendarAlt,
  FaShieldAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaEdit,
  FaClock,
  FaSignOutAlt,
  FaQuestionCircle,
  FaToggleOn,
  FaToggleOff,
  FaTools,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHistory,
  FaCarAlt,
  FaKey,
  FaGasPump,
  FaChartLine,
  FaHospital,
  FaFirstAid,
} from "react-icons/fa";

import { GiMedicines } from "react-icons/gi";
import { MdMedicalServices } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");

  const [profileData, setProfileData] = useState({
    name: "John Carter",
    employeeId: "PARA-2023-0789",
    role: "Senior Paramedic",
    certification: "EMT-P",
    hospital: "Metropolitan Medical Center",
    experience: "7 years",
    certifications: ["ACLS", "PALS", "BTLS", "NREMT-P"],
    contact: "+1 (555) 123-4567",
    email: "j.carter@metromedical.com",
    address: "456 Emergency Lane, Suite 101, Boston, MA 02115",
    workingHours: "Rotating Shifts (12hr)",
    emergencyContact: "+1 (555) 987-6543",
    bio: "Experienced paramedic with specialization in trauma care and emergency response. Committed to providing the highest level of pre-hospital care.",
  });

  const [vehicleData, setVehicleData] = useState({
    vehicleId: "AMB-2022-0456",
    type: "Type III Ambulance",
    make: "Ford",
    model: "F-450",
    year: "2022",
    mileage: "45,678",
    lastService: "2023-05-15",
    nextService: "2023-08-15",
    fuelType: "Diesel",
    licensePlate: "EMS-7890",
    status: "Operational",
    equipment: [
      { name: "Defibrillator", status: "operational", lastCheck: "2023-06-01" },
      { name: "Oxygen Tank", status: "needs_refill", lastCheck: "2023-06-10" },
      { name: "Stretcher", status: "operational", lastCheck: "2023-06-05" },
      {
        name: "First Aid Kit",
        status: "needs_restock",
        lastCheck: "2023-06-12",
      },
      { name: "IV Supplies", status: "operational", lastCheck: "2023-06-08" },
    ],
    dutyLog: [
      { date: "2023-06-15", start: "07:00", end: "19:00", incidents: 5 },
      { date: "2023-06-14", start: "19:00", end: "07:00", incidents: 3 },
      { date: "2023-06-13", start: "07:00", end: "19:00", incidents: 7 },
    ],
  });

  const stats = {
    totalMissions: 345,
    responseTime: "8.2 mins",
    patientOutcomes: "92% positive",
    avgMissionsPerShift: "4.5",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEquipmentStatusChange = (index, status) => {
    const updatedEquipment = [...vehicleData.equipment];
    updatedEquipment[index].status = status;
    updatedEquipment[index].lastCheck = new Date().toISOString().split("T")[0];
    setVehicleData((prev) => ({
      ...prev,
      equipment: updatedEquipment,
    }));
  };

  const handleSave = () => {
    setEditMode(false);
    // API call to save data would go here
  };

  const toggleDutyStatus = () => {
    setIsOnDuty(!isOnDuty);
    // API call to update duty status would go here
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    // API call to submit support request
    alert(`Support request submitted: ${supportMessage}`);
    setSupportMessage("");
    setShowSupportModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "operational":
        return "green";
      case "needs_repair":
        return "orange";
      case "needs_refill":
      case "needs_restock":
        return "blue";
      case "out_of_service":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "operational":
        return <FaCheckCircle />;
      case "needs_repair":
        return <FaTools />;
      case "needs_refill":
        return <FaGasPump />;
      case "needs_restock":
        return <GiMedicines />;
      case "out_of_service":
        return <FaExclamationTriangle />;
      default:
        return null;
    }
  };

  return (
    <>
      <MobileHospitalNav />
      <div className="profile-container">
        {/* Header Section */}
        <div className="profile-header">
          <div className="avatar">JC</div>
          <div className="header-info">
            <h1>{profileData.name}</h1>
            <p className="role">{profileData.role}</p>
            <div className="badges">
              <span className="badge certified">
                <FaShieldAlt /> {profileData.certification}
              </span>
              <span
                className={`badge status ${isOnDuty ? "on-duty" : "off-duty"}`}
              >
                {isOnDuty ? <FaToggleOn /> : <FaToggleOff />}
                {isOnDuty ? "On Duty" : "Off Duty"}
              </span>
            </div>
          </div>
          <div className="header-actions">
            <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
              <FaEdit /> {editMode ? "Cancel" : "Edit Profile"}
            </button>
            <button
              className="support-btn"
              onClick={() => setShowSupportModal(true)}
            >
              <FaQuestionCircle /> Support
            </button>
            <button className="logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser /> Profile
          </button>
          <button
            className={`tab ${activeTab === "vehicle" ? "active" : ""}`}
            onClick={() => setActiveTab("vehicle")}
          >
            <FaAmbulance /> Vehicle
          </button>
          <button
            className={`tab ${activeTab === "duty" ? "active" : ""}`}
            onClick={() => setActiveTab("duty")}
          >
            <FaHistory /> Duty Log
          </button>
        </div>

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="profile-content">
            {/* Personal Information Section */}
            <div className="profile-section">
              <h2>
                <FaUser /> Personal Information
              </h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Employee ID</label>
                  <div className="info-value">{profileData.employeeId}</div>
                </div>
                <div className="info-item">
                  <label>Certification</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="certification"
                      value={profileData.certification}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="info-value">
                      {profileData.certification}
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <label>Hospital/Base</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="hospital"
                      value={profileData.hospital}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="info-value">
                      <FaHospital /> {profileData.hospital}
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <label>Experience</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="experience"
                      value={profileData.experience}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="info-value">{profileData.experience}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="profile-section">
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
                    />
                  ) : (
                    <div className="info-value">
                      <FaMapMarkerAlt /> {profileData.address}
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
                    />
                  ) : (
                    <div className="info-value">
                      <FaPhone /> {profileData.emergencyContact}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Details Section */}
            <div className="profile-section">
              <h2>
                <FaIdCard /> Professional Details
              </h2>
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
                  />
                ) : (
                  <div className="info-value">
                    <ul className="certification-list">
                      {profileData.certifications.map((cert, index) => (
                        <li key={index}>
                          <FaShieldAlt /> {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="info-item">
                <label>Working Hours</label>
                {editMode ? (
                  <input
                    type="text"
                    name="workingHours"
                    value={profileData.workingHours}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="info-value">
                    <FaClock /> {profileData.workingHours}
                  </div>
                )}
              </div>

              <div className="info-item">
                <label>Bio</label>
                {editMode ? (
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="info-value bio">{profileData.bio}</div>
                )}
              </div>
            </div>

            {/* Performance Statistics */}
            <div className="profile-section">
              <h2>
                <FaChartLine /> Performance Statistics
              </h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.totalMissions}</div>
                  <div className="stat-label">Total Missions</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.responseTime}</div>
                  <div className="stat-label">Avg. Response Time</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.patientOutcomes}</div>
                  <div className="stat-label">Positive Outcomes</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.avgMissionsPerShift}</div>
                  <div className="stat-label">Missions/Shift</div>
                </div>
              </div>
            </div>

            {editMode && (
              <div className="action-buttons">
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}

        {/* Vehicle Tab Content */}
        {activeTab === "vehicle" && (
          <div className="profile-content">
            {/* Vehicle Information Section */}
            <div className="profile-section">
              <h2>
                <FaCarAlt /> Vehicle Information
              </h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Vehicle ID</label>
                  <div className="info-value">
                    <FaKey /> {vehicleData.vehicleId}
                  </div>
                </div>
                <div className="info-item">
                  <label>Type</label>
                  <div className="info-value">{vehicleData.type}</div>
                </div>
                <div className="info-item">
                  <label>Make/Model</label>
                  <div className="info-value">
                    {vehicleData.make} {vehicleData.model}
                  </div>
                </div>
                <div className="info-item">
                  <label>Year</label>
                  <div className="info-value">{vehicleData.year}</div>
                </div>
                <div className="info-item">
                  <label>Mileage</label>
                  <div className="info-value">{vehicleData.mileage}</div>
                </div>
                <div className="info-item">
                  <label>Last Service</label>
                  <div className="info-value">{vehicleData.lastService}</div>
                </div>
                <div className="info-item">
                  <label>Next Service</label>
                  <div className="info-value">{vehicleData.nextService}</div>
                </div>
                <div className="info-item">
                  <label>Fuel Type</label>
                  <div className="info-value">
                    <FaGasPump /> {vehicleData.fuelType}
                  </div>
                </div>
                <div className="info-item">
                  <label>License Plate</label>
                  <div className="info-value">{vehicleData.licensePlate}</div>
                </div>
                <div className="info-item">
                  <label>Status</label>
                  <div className="info-value">
                    <span
                      className={`status-badge ${vehicleData.status.toLowerCase()}`}
                    >
                      {vehicleData.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Equipment Status Section */}
            <div className="profile-section">
              <h2>
                <MdMedicalServices /> Equipment Status
              </h2>
              <div className="equipment-grid">
                {vehicleData.equipment.map((item, index) => (
                  <div key={index} className="equipment-item">
                    <div className="equipment-name">{item.name}</div>
                    <div className="equipment-status">
                      <span className={`status-indicator ${item.status}`}>
                        {getStatusIcon(item.status)}
                        {item.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="equipment-actions">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleEquipmentStatusChange(index, e.target.value)
                        }
                      >
                        <option value="operational">Operational</option>
                        <option value="needs_repair">Needs Repair</option>
                        <option value="needs_refill">Needs Refill</option>
                        <option value="needs_restock">Needs Restock</option>
                        <option value="out_of_service">Out of Service</option>
                      </select>
                    </div>
                    <div className="equipment-last-check">
                      Last checked: {item.lastCheck}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="profile-section">
              <h2>
                <IoMdSettings /> Quick Actions
              </h2>
              <div className="quick-actions">
                <button className="action-btn">
                  <FaTools /> Report Maintenance Issue
                </button>
                <button className="action-btn">
                  <FaFirstAid /> Request Equipment Restock
                </button>
                <button className="action-btn">
                  <FaGasPump /> Log Fuel Refill
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Duty Log Tab Content */}
        {activeTab === "duty" && (
          <div className="profile-content">
            {/* Duty Status Toggle */}
            <div className="profile-section">
              <h2>
                <FaClock /> Duty Status
              </h2>
              <div className="duty-status-toggle">
                <p>Current Status: {isOnDuty ? "On Duty" : "Off Duty"}</p>
                <button
                  className={`toggle-btn ${isOnDuty ? "on" : "off"}`}
                  onClick={toggleDutyStatus}
                >
                  {isOnDuty ? <FaToggleOn /> : <FaToggleOff />}
                  {isOnDuty ? "Go Off Duty" : "Go On Duty"}
                </button>
              </div>
            </div>

            {/* Recent Duty Log */}
            <div className="profile-section">
              <h2>
                <FaHistory /> Recent Shifts
              </h2>
              <div className="duty-log">
                <div className="log-header">
                  <div>Date</div>
                  <div>Start Time</div>
                  <div>End Time</div>
                  <div>Incidents</div>
                </div>
                {vehicleData.dutyLog.map((log, index) => (
                  <div key={index} className="log-entry">
                    <div>{log.date}</div>
                    <div>{log.start}</div>
                    <div>{log.end}</div>
                    <div>{log.incidents}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shift Statistics */}
            <div className="profile-section">
              <h2>
                <FaChartLine /> Shift Statistics
              </h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Shifts This Month</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">48</div>
                  <div className="stat-label">Total Incidents</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">4.0</div>
                  <div className="stat-label">Avg. Incidents/Shift</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">92%</div>
                  <div className="stat-label">On Time Response</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Support Modal */}
        {showSupportModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="modal-close"
                onClick={() => setShowSupportModal(false)}
              >
                <IoMdClose />
              </button>
              <h2>
                <FaQuestionCircle /> Support Request
              </h2>
              <form onSubmit={handleSupportSubmit}>
                <div className="form-group">
                  <label>Describe your issue</label>
                  <textarea
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Please describe your issue in detail..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Urgency</label>
                  <select>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowSupportModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="confirm-btn">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <style jsx>{`
          /* Color Variables */
          :root {
            --primary-color: #2563eb;
            --primary-light: #dbeafe;
            --primary-dark: #1e40af;
            --secondary-color: #10b981;
            --warning-color: #f59e0b;
            --danger-color: #dc2626;
            --info-color: #3b82f6;
            --text-dark: #1e293b;
            --text-medium: #334155;
            --text-light: #64748b;
            --border-radius: 12px;
            --border-radius-sm: 8px;
            --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            --transition: all 0.3s ease;
          }

          /* Base Styles */
          .profile-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px 16px;
            font-family: "Inter", sans-serif;
            color: var(--text-dark);
          }

          /* Header Section */
          .profile-header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 30px;
            flex-wrap: wrap;
            padding-bottom: 20px;
            border-bottom: 1px solid #e2e8f0;
          }

          .avatar {
            width: 80px;
            height: 80px;
            background-color: var(--primary-color);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: bold;
          }

          .header-info {
            flex: 1;
            min-width: 250px;
          }

          .header-info h1 {
            margin: 0;
            font-size: 28px;
          }

          .role {
            margin: 5px 0;
            color: var(--text-medium);
            font-size: 16px;
          }

          .badges {
            display: flex;
            gap: 10px;
            margin-top: 10px;
            flex-wrap: wrap;
          }

          .badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .certified {
            background-color: #e6f7ff;
            color: var(--info-color);
          }

          .status {
            background-color: #f0fdf4;
            color: var(--secondary-color);
          }

          .status.on-duty {
            background-color: #fef2f2;
            color: var(--danger-color);
          }

          .status.off-duty {
            background-color: #f0fdf4;
            color: var(--secondary-color);
          }

          .header-actions {
            display: flex;
            gap: 10px;
            margin-left: auto;
            flex-wrap: wrap;
          }

          .edit-btn,
          .support-btn,
          .logout-btn {
            padding: 10px 15px;
            border-radius: var(--border-radius-sm);
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: var(--transition);
            font-size: 14px;
          }

          .edit-btn {
            background-color: white;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
          }

          .edit-btn:hover {
            background-color: var(--primary-light);
          }

          .support-btn {
            background-color: white;
            color: var(--warning-color);
            border: 1px solid var(--warning-color);
          }

          .support-btn:hover {
            background-color: #fef3c7;
          }

          .logout-btn {
            background-color: white;
            color: var(--danger-color);
            border: 1px solid var(--danger-color);
          }

          .logout-btn:hover {
            background-color: #fee2e2;
          }

          /* Navigation Tabs */
          .profile-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 10px;
          }

          .tab {
            padding: 10px 20px;
            border: none;
            background: none;
            cursor: pointer;
            font-weight: 600;
            color: var(--text-light);
            display: flex;
            align-items: center;
            gap: 8px;
            border-radius: var(--border-radius-sm);
            transition: var(--transition);
          }

          .tab:hover {
            color: var(--primary-color);
            background: var(--primary-light);
          }

          .tab.active {
            color: var(--primary-color);
            background: var(--primary-light);
            position: relative;
          }

          .tab.active:after {
            content: "";
            position: absolute;
            bottom: -11px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--primary-color);
          }

          /* Profile Sections */
          .profile-section {
            background: white;
            border-radius: var(--border-radius);
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: var(--box-shadow);
          }

          .profile-section h2 {
            font-size: 20px;
            margin-top: 0;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--primary-color);
          }

          /* Information Grid */
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }

          .info-item {
            margin-bottom: 15px;
          }

          .info-item label {
            display: block;
            font-size: 14px;
            color: var(--text-light);
            margin-bottom: 5px;
            font-weight: 500;
          }

          .info-value {
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .info-value svg {
            color: var(--primary-color);
          }

          .bio {
            line-height: 1.6;
          }

          .status-badge {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
          }

          .status-badge.operational {
            background: #dcfce7;
            color: #166534;
          }

          .status-badge.maintenance {
            background: #fef3c7;
            color: #92400e;
          }

          /* Equipment Grid */
          .equipment-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
          }

          .equipment-item {
            background: white;
            border-radius: var(--border-radius-sm);
            padding: 15px;
            box-shadow: var(--box-shadow);
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .equipment-name {
            font-weight: 600;
            font-size: 16px;
          }

          .equipment-status {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .status-indicator {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .status-indicator.operational {
            background: #dcfce7;
            color: #166534;
          }

          .status-indicator.needs_repair {
            background: #fef3c7;
            color: #92400e;
          }

          .status-indicator.needs_refill {
            background: #dbeafe;
            color: #1e40af;
          }

          .status-indicator.needs_restock {
            background: #e9d5ff;
            color: #6b21a8;
          }

          .status-indicator.out_of_service {
            background: #fee2e2;
            color: #991b1b;
          }

          .equipment-last-check {
            font-size: 12px;
            color: var(--text-light);
          }

          .equipment-actions select {
            width: 100%;
            padding: 8px;
            border-radius: var(--border-radius-sm);
            border: 1px solid #e2e8f0;
            font-size: 14px;
          }

          /* Quick Actions */
          .quick-actions {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
          }

          .action-btn {
            padding: 12px;
            border-radius: var(--border-radius-sm);
            background: white;
            border: 1px solid #e2e8f0;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            transition: var(--transition);
          }

          .action-btn:hover {
            background: #f8fafc;
            border-color: var(--primary-color);
            color: var(--primary-color);
          }

          /* Duty Log */
          .duty-status-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
          }

          .toggle-btn {
            padding: 10px 20px;
            border-radius: var(--border-radius-sm);
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: var(--transition);
            border: none;
          }

          .toggle-btn.on {
            background: #fee2e2;
            color: var(--danger-color);
          }

          .toggle-btn.off {
            background: #dcfce7;
            color: var(--secondary-color);
          }

          .duty-log {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .log-header,
          .log-entry {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 15px;
            padding: 10px;
            align-items: center;
          }

          .log-header {
            font-weight: 600;
            border-bottom: 1px solid #e2e8f0;
          }

          .log-entry {
            transition: var(--transition);
          }

          .log-entry:hover {
            background: #f8fafc;
          }

          /* Stats Grid */
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
          }

          .stat-card {
            background: white;
            border-radius: var(--border-radius-sm);
            padding: 15px;
            text-align: center;
            box-shadow: var(--box-shadow);
          }

          .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 5px;
          }

          .stat-label {
            font-size: 14px;
            color: var(--text-medium);
          }

          /* Input Fields */
          input,
          textarea,
          select {
            width: 100%;
            padding: 10px;
            border: 1px solid #e2e8f0;
            border-radius: var(--border-radius-sm);
            font-family: "Inter", sans-serif;
            font-size: 16px;
            transition: var(--transition);
          }

          input:focus,
          textarea:focus,
          select:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px var(--primary-light);
          }

          textarea {
            min-height: 100px;
            resize: vertical;
          }

          /* Certification List */
          .certification-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .certification-list li {
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .certification-list svg {
            color: var(--secondary-color);
          }

          /* Action Buttons */
          .action-buttons {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
          }

          .save-btn {
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: var(--border-radius-sm);
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
          }

          .save-btn:hover {
            background-color: var(--primary-dark);
          }

          /* Modal Styles */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
            padding: 20px;
          }

          .modal-content {
            background: white;
            border-radius: var(--border-radius);
            padding: 24px;
            width: 100%;
            max-width: 500px;
            box-shadow: var(--box-shadow-lg);
            position: relative;
          }

          .modal-content h2 {
            margin-top: 0;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .modal-close {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            font-size: 24px;
            color: var(--text-light);
            cursor: pointer;
            transition: var(--transition);
            padding: 4px;
            border-radius: 4px;
          }

          .modal-close:hover {
            color: var(--text-dark);
            background: #f1f5f9;
          }

          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 20px;
          }

          .cancel-btn,
          .confirm-btn {
            padding: 10px 20px;
            border: none;
            border-radius: var(--border-radius-sm);
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
          }

          .cancel-btn {
            background-color: #f1f5f9;
            color: var(--text-dark);
          }

          .cancel-btn:hover {
            background-color: #e2e8f0;
          }

          .confirm-btn {
            background-color: var(--primary-color);
            color: white;
          }

          .confirm-btn:hover {
            background-color: var(--primary-dark);
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .profile-header {
              flex-direction: column;
              text-align: center;
            }

            .header-info {
              text-align: center;
            }

            .badges {
              justify-content: center;
            }

            .header-actions {
              width: 100%;
              justify-content: center;
            }

            .profile-tabs {
              overflow-x: auto;
              padding-bottom: 5px;
            }

            .tab {
              white-space: nowrap;
            }

            .info-grid,
            .equipment-grid,
            .quick-actions {
              grid-template-columns: 1fr;
            }

            .log-header,
            .log-entry {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 480px) {
            .stats-grid {
              grid-template-columns: 1fr 1fr;
            }

            .edit-btn,
            .support-btn,
            .logout-btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Profile;
