import React, { useState, useEffect } from "react";
import DoctorNav from "../../components/DoctorNav";
import {
  FaCalendarAlt,
  FaUserInjured,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaExclamationTriangle,
  FaSpinner,
  FaEllipsisV,
  FaCalendarPlus,
  FaFileExport,
  FaFilter,
  FaTimes,
  FaUserMd,
  FaStethoscope,
  FaNotesMedical,
  FaProcedures,
} from "react-icons/fa";
import { MdEmergency, MdOutlineMedicalServices } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { GiMedicines } from "react-icons/gi";

const Appointments = () => {
  // State management
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    dateRange: "all",
  });
  const [showNotification, setShowNotification] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Combined appointments data with status
  const allAppointments = [
    {
      id: 1,
      patient: "John Doe",
      date: "2025-06-25",
      time: "09:30 AM",
      type: "Follow-up",
      reason: "Diabetes management",
      contact: "+1 (555) 123-4567",
      status: "pending",
      diagnosis: "",
      treatment: "",
      priority: "normal",
      age: 45,
      gender: "Male",
      lastVisit: "2025-05-15",
    },
    {
      id: 2,
      patient: "Sarah Smith",
      date: "2025-06-25",
      time: "11:15 AM",
      type: "New Patient",
      reason: "Annual physical",
      contact: "+1 (555) 987-6543",
      status: "in progress",
      diagnosis: "",
      treatment: "",
      priority: "high",
      age: 32,
      gender: "Female",
      lastVisit: null,
    },
    {
      id: 3,
      patient: "Michael Johnson",
      date: "2025-06-25",
      time: "02:00 PM",
      type: "Consultation",
      reason: "Hypertension follow-up",
      contact: "+1 (555) 456-7890",
      status: "completed",
      diagnosis: "Hypertension Stage 1",
      treatment: "Prescribed Lisinopril 5mg daily, lifestyle modifications",
      priority: "normal",
      age: 58,
      gender: "Male",
      lastVisit: "2025-05-20",
    },
    {
      id: 4,
      patient: "Emily Davis",
      date: "2025-06-24",
      time: "10:00 AM",
      type: "Follow-up",
      reason: "Diabetes management",
      contact: "+1 (555) 789-0123",
      status: "completed",
      diagnosis: "Type 2 Diabetes",
      treatment: "Adjusted Metformin dosage, dietary recommendations",
      priority: "normal",
      age: 52,
      gender: "Female",
      lastVisit: "2025-04-10",
    },
    {
      id: 5,
      patient: "Robert Brown",
      date: "2025-06-23",
      time: "03:30 PM",
      type: "Consultation",
      reason: "New symptoms",
      contact: "+1 (555) 321-6547",
      status: "completed",
      diagnosis: "Upper respiratory infection",
      treatment: "Prescribed Amoxicillin 500mg TID for 7 days",
      priority: "normal",
      age: 28,
      gender: "Male",
      lastVisit: "2025-01-15",
    },
    {
      id: 6,
      patient: "Lisa Wilson",
      date: "2025-06-26",
      time: "09:00 AM",
      type: "Emergency",
      reason: "Severe abdominal pain",
      contact: "+1 (555) 111-2222",
      status: "pending",
      diagnosis: "",
      treatment: "",
      priority: "high",
      age: 35,
      gender: "Female",
      lastVisit: "2025-03-22",
    },
  ];

  // Filter appointments based on search term, status and additional filters
  const filteredAppointments = allAppointments.filter((appt) => {
    const matchesSearch =
      appt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appt.diagnosis &&
        appt.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      activeStatus === "all" || appt.status === activeStatus;

    const matchesType =
      selectedFilters.type.length === 0 ||
      selectedFilters.type.includes(appt.type);

    // Date range filtering would be more complex in a real app
    const matchesDateRange = true; // Simplified for this example

    return matchesSearch && matchesStatus && matchesType && matchesDateRange;
  });

  const handleEmergencyConsultation = () => {
    setShowEmergencyModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="status-icon" />;
      case "in progress":
        return <FaSpinner className="status-icon spin" />;
      case "completed":
        return <FaCheckCircle className="status-icon" />;
      default:
        return null;
    }
  };

  const updateAppointmentStatus = (id, newStatus) => {
    // In a real app, this would update the appointment status in your backend
    console.log(`Updating appointment ${id} to status: ${newStatus}`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    setIsMenuOpen(null); // Close any open menus
  };

  const toggleFilter = (filterType, value) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (filterType === "type") {
        if (newFilters.type.includes(value)) {
          newFilters.type = newFilters.type.filter((item) => item !== value);
        } else {
          newFilters.type = [...newFilters.type, value];
        }
      } else {
        newFilters[filterType] = value;
      }
      return newFilters;
    });
  };

  const getPriorityBadge = (priority) => {
    if (priority === "high") {
      return <span className="priority-badge high">High Priority</span>;
    }
    return null;
  };

  const toggleMenu = (id) => {
    setIsMenuOpen(isMenuOpen === id ? null : id);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Follow-up":
        return <FaUserMd className="type-icon" />;
      case "New Patient":
        return <FaUserInjured className="type-icon" />;
      case "Consultation":
        return <FaStethoscope className="type-icon" />;
      case "Emergency":
        return <MdEmergency className="type-icon" />;
      default:
        return <MdOutlineMedicalServices className="type-icon" />;
    }
  };

  return (
    <div className="doctor-appointments">
      <DoctorNav />

      <div className="appointments-container">
        {/* Notification */}
        {showNotification && (
          <div className="notification">
            <FaCheckCircle /> Appointment status updated successfully!
          </div>
        )}

        <header className="appointments-header">
          <div className="header-left">
            <div className="header-title">
              <h1>
                <FaCalendarAlt /> Appointments
              </h1>
              <div className="current-time">
                {formatTime(currentTime)} • {currentTime.toLocaleDateString()}
              </div>
            </div>
            <div className="stats-summary">
              <div className="stat-card">
                <div className="stat-value">{allAppointments.length}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {allAppointments.filter((a) => a.status === "pending").length}
                </div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {
                    allAppointments.filter((a) => a.status === "in progress")
                      .length
                  }
                </div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {
                    allAppointments.filter((a) => a.status === "completed")
                      .length
                  }
                </div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button className="action-icon-btn notification-btn">
              <IoMdNotificationsOutline />
              <span className="notification-badge">3</span>
            </button>
            <button className="action-icon-btn" title="Add New Appointment">
              <FaCalendarPlus />
            </button>
            <button className="action-icon-btn" title="Export Data">
              <FaFileExport />
            </button>
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search patients, reasons, diagnoses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
                aria-label="Toggle filters"
              >
                <FaFilter />
              </button>
            </div>
            <button
              className="emergency-btn"
              onClick={handleEmergencyConsultation}
            >
              <MdEmergency /> Emergency
            </button>
          </div>
        </header>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="advanced-filters">
            <div className="filter-header">
              <h3>Filter Appointments</h3>
              <button
                className="close-filters"
                onClick={() => setShowFilters(false)}
                aria-label="Close filters"
              >
                <FaTimes />
              </button>
            </div>
            <div className="filter-group">
              <h4>Appointment Type</h4>
              <div className="filter-options">
                {["Follow-up", "New Patient", "Consultation", "Emergency"].map(
                  (type) => (
                    <button
                      key={type}
                      className={`filter-option ${
                        selectedFilters.type.includes(type) ? "active" : ""
                      }`}
                      onClick={() => toggleFilter("type", type)}
                    >
                      {getTypeIcon(type)} {type}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="filter-group">
              <h4>Date Range</h4>
              <div className="filter-options">
                {["Today", "This Week", "This Month", "All"].map((range) => (
                  <button
                    key={range}
                    className={`filter-option ${
                      selectedFilters.dateRange === range.toLowerCase()
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      toggleFilter("dateRange", range.toLowerCase())
                    }
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-actions">
              <button
                className="action-btn secondary-btn"
                onClick={() => {
                  setSelectedFilters({
                    type: [],
                    dateRange: "all",
                  });
                }}
              >
                Clear All
              </button>
              <button
                className="action-btn primary-btn"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        <div className="status-filters">
          <button
            className={`status-btn ${activeStatus === "all" ? "active" : ""}`}
            onClick={() => setActiveStatus("all")}
          >
            All Appointments
          </button>
          <button
            className={`status-btn ${
              activeStatus === "pending" ? "active" : ""
            }`}
            onClick={() => setActiveStatus("pending")}
          >
            <FaClock /> Pending
          </button>
          <button
            className={`status-btn ${
              activeStatus === "in progress" ? "active" : ""
            }`}
            onClick={() => setActiveStatus("in progress")}
          >
            <FaSpinner className="spin" /> In Progress
          </button>
          <button
            className={`status-btn ${
              activeStatus === "completed" ? "active" : ""
            }`}
            onClick={() => setActiveStatus("completed")}
          >
            <FaCheckCircle /> Completed
          </button>
        </div>

        <div className="appointments-list-container">
          {filteredAppointments.length > 0 ? (
            <ul className="appointments-list">
              {filteredAppointments.map((appt) => (
                <li
                  key={appt.id}
                  className={`appointment-card ${appt.status} ${appt.priority}`}
                >
                  <div className="appointment-header">
                    <div className="patient-info">
                      <div className="patient-avatar">
                        {appt.patient.charAt(0)}
                        {appt.priority === "high" && (
                          <span className="emergency-indicator"></span>
                        )}
                      </div>
                      <div>
                        <h3>
                          {appt.patient}
                          {getPriorityBadge(appt.priority)}
                        </h3>
                        <div className="patient-meta">
                          <span>
                            {appt.age} years • {appt.gender}
                          </span>
                          {appt.lastVisit && (
                            <span>
                              Last visit: {formatDate(appt.lastVisit)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="appointment-time">
                      <span className="time">{appt.time}</span>
                      <span className="date">
                        {new Date(appt.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="appointment-actions-menu">
                      <button
                        className="menu-btn"
                        onClick={() => toggleMenu(appt.id)}
                        aria-label="More options"
                      >
                        <FaEllipsisV />
                      </button>
                      {isMenuOpen === appt.id && (
                        <div className="dropdown-menu">
                          <button className="dropdown-item">
                            <FaUserMd /> View Patient Profile
                          </button>
                          <button className="dropdown-item">
                            <FaNotesMedical /> View Medical History
                          </button>
                          <button className="dropdown-item">
                            <GiMedicines /> Prescription History
                          </button>
                          <button className="dropdown-item">
                            <FaProcedures /> Treatment Plans
                          </button>
                        </div>
                      )}
                    </div>
                    <div className={`status-badge ${appt.status}`}>
                      {getStatusIcon(appt.status)}
                      {appt.status.replace(/-/g, " ")}
                    </div>
                  </div>

                  <div className="appointment-details">
                    <div className="appointment-type">
                      {getTypeIcon(appt.type)} {appt.type}
                    </div>
                    <p className="appointment-reason">
                      <strong>Reason:</strong> {appt.reason}
                    </p>
                    {appt.contact && (
                      <p className="appointment-contact">
                        <strong>Contact:</strong> {appt.contact}
                      </p>
                    )}

                    {appt.status === "completed" && appt.diagnosis && (
                      <div className="completed-details">
                        <div className="detail-section">
                          <h4>Diagnosis</h4>
                          <p>{appt.diagnosis}</p>
                        </div>
                        <div className="detail-section">
                          <h4>Treatment</h4>
                          <p>{appt.treatment}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="appointment-actions">
                    {appt.status === "pending" && (
                      <>
                        <button
                          className="action-btn start-btn"
                          onClick={() =>
                            updateAppointmentStatus(appt.id, "in progress")
                          }
                        >
                          Start Consultation
                        </button>
                        <button className="action-btn reschedule-btn">
                          Reschedule
                        </button>
                        <button className="action-btn cancel-btn">
                          Cancel
                        </button>
                      </>
                    )}

                    {appt.status === "in progress" && (
                      <>
                        <button
                          className="action-btn complete-btn"
                          onClick={() =>
                            updateAppointmentStatus(appt.id, "completed")
                          }
                        >
                          Complete Consultation
                        </button>
                        <button className="action-btn notes-btn">
                          Add Notes
                        </button>
                        <button className="action-btn prescription-btn">
                          Add Prescription
                        </button>
                      </>
                    )}

                    {appt.status === "completed" && (
                      <>
                        <button className="action-btn view-btn">
                          View Full Notes
                        </button>
                        <button className="action-btn followup-btn">
                          Schedule Follow-up
                        </button>
                        <button className="action-btn prescription-btn">
                          View Prescription
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-results">
              <div className="no-results-content">
                <img
                  src="/images/no-appointments.svg"
                  alt="No appointments found"
                />
                <h3>No appointments found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button
                  className="action-btn primary-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveStatus("all");
                    setSelectedFilters({
                      type: [],
                      dateRange: "all",
                    });
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Consultation Modal */}
      {showEmergencyModal && (
        <div className="emergency-modal">
          <div
            className="modal-overlay"
            onClick={() => setShowEmergencyModal(false)}
          ></div>
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-header-icon">
                <MdEmergency className="emergency-icon" />
              </div>
              <h2>Emergency Consultation</h2>
              <button
                className="close-btn"
                onClick={() => setShowEmergencyModal(false)}
                aria-label="Close emergency modal"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="alert-message">
                <FaExclamationTriangle className="alert-icon" />
                <div>
                  <h4>Emergency Protocol Activated</h4>
                  <p>
                    This will initiate an emergency consultation protocol with
                    priority routing and notifications.
                  </p>
                </div>
              </div>
              <div className="form-group">
                <label>Select Patient</label>
                <select className="form-control">
                  <option value="">-- Select Patient --</option>
                  {allAppointments.map((appt) => (
                    <option key={appt.id} value={appt.id}>
                      {appt.patient} ({appt.contact})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Emergency Reason</label>
                <textarea
                  className="form-control"
                  placeholder="Briefly describe the emergency (e.g., symptoms, severity, duration)..."
                  rows="4"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Emergency Level</label>
                <div className="emergency-levels">
                  <label className="emergency-level">
                    <input type="radio" name="emergencyLevel" value="high" />
                    <span className="level-indicator high"></span>
                    <span>High (Life-threatening)</span>
                  </label>
                  <label className="emergency-level">
                    <input
                      type="radio"
                      name="emergencyLevel"
                      value="medium"
                      defaultChecked
                    />
                    <span className="level-indicator medium"></span>
                    <span>Medium (Urgent)</span>
                  </label>
                  <label className="emergency-level">
                    <input type="radio" name="emergencyLevel" value="low" />
                    <span className="level-indicator low"></span>
                    <span>Low (Needs attention)</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="action-btn danger-btn"
                onClick={() => {
                  // Implement emergency call functionality
                  setShowEmergencyModal(false);
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 3000);
                }}
              >
                Initiate Emergency Protocol
              </button>
              <button
                className="action-btn secondary-btn"
                onClick={() => setShowEmergencyModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :root {
          --primary-color: #4361ee;
          --primary-light: #e6f0fd;
          --primary-dark: #3a56d4;
          --secondary-color: #3f37c9;
          --success-color: #4cc9f0;
          --success-dark: #3ab7e0;
          --danger-color: #f72585;
          --danger-dark: #e5177a;
          --warning-color: #f8961e;
          --warning-dark: #e68a19;
          --info-color: #4895ef;
          --info-dark: #3a89e0;
          --followup-color: #7209b7;
          --followup-dark: #5e08a0;
          --prescription-color: #38b000;
          --prescription-dark: #2e9200;
          --dark-color: #212529;
          --dark-gray: #495057;
          --medium-gray: #6c757d;
          --light-gray: #adb5bd;
          --light-color: #f8f9fa;
          --lighter-gray: #e9ecef;
          --border-radius: 12px;
          --border-radius-sm: 8px;
          --box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          --box-shadow-md: 0 8px 30px rgba(0, 0, 0, 0.12);
          --box-shadow-lg: 0 15px 50px rgba(0, 0, 0, 0.15);
          --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: var(--dark-color);
          background-color: #f5f7fa;
          -webkit-font-smoothing: antialiased;
        }

        .doctor-appointments {
          display: flex;
          min-height: 100vh;
          background-color: #f5f7fa;
        }

        .appointments-container {
          flex: 1;
          padding: 1rem;
          background-color: #f5f7fa;
          width: 100%;
        }

        /* Header Styles */
        .appointments-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
          background-color: white;
          padding: 1rem;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
          min-width: 100%;
        }

        .header-title {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .appointments-header h1 {
          font-size: 1.5rem;
          color: var(--dark-color);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          font-weight: 700;
        }

        .current-time {
          font-size: 0.85rem;
          color: var(--medium-gray);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stats-summary {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .stat-card {
          background-color: var(--lighter-gray);
          padding: 0.5rem 0.75rem;
          border-radius: var(--border-radius-sm);
          min-width: 80px;
          text-align: center;
          transition: var(--transition);
          flex: 1;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--box-shadow);
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--medium-gray);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          width: 100%;
        }

        .action-icon-btn {
          background: none;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--medium-gray);
          font-size: 1.1rem;
          position: relative;
          transition: var(--transition);
          background-color: var(--lighter-gray);
        }

        .action-icon-btn:hover {
          background-color: var(--primary-light);
          color: var(--primary-color);
          transform: translateY(-1px);
        }

        .notification-btn {
          background-color: rgba(247, 37, 133, 0.1);
          color: var(--danger-color);
        }

        .notification-btn:hover {
          background-color: rgba(247, 37, 133, 0.2);
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: var(--danger-color);
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 0.65rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }

        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 100%;
        }

        .search-bar input {
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          font-size: 0.95rem;
          width: 100%;
          transition: var(--transition);
          background-color: #f8f9fa;
          font-family: inherit;
        }

        .search-bar input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
          background-color: white;
        }

        .search-bar input::placeholder {
          color: var(--light-gray);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--light-gray);
          font-size: 0.95rem;
        }

        .filter-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: var(--light-gray);
          cursor: pointer;
          font-size: 0.95rem;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
        }

        .filter-toggle:hover {
          color: var(--primary-color);
          transform: scale(1.1);
        }

        .emergency-btn {
          background-color: var(--danger-color);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--border-radius);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: var(--transition);
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(247, 37, 133, 0.3);
          font-family: inherit;
          width: 100%;
          justify-content: center;
        }

        .emergency-btn:hover {
          background-color: var(--danger-dark);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(247, 37, 133, 0.4);
        }

        /* Advanced Filters */
        .advanced-filters {
          background-color: white;
          border-radius: var(--border-radius);
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: var(--box-shadow-md);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .filter-header h3 {
          font-size: 1.1rem;
          color: var(--dark-color);
        }

        .close-filters {
          background: none;
          border: none;
          color: var(--medium-gray);
          font-size: 1.1rem;
          cursor: pointer;
          transition: var(--transition);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .close-filters:hover {
          background-color: var(--lighter-gray);
          color: var(--danger-color);
        }

        .filter-group {
          flex: 1;
          min-width: 100%;
        }

        .filter-group h4 {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--dark-gray);
          font-weight: 600;
        }

        .filter-options {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-option {
          padding: 0.5rem 1rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius-sm);
          background-color: white;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          min-width: calc(50% - 0.5rem);
          justify-content: center;
        }

        .filter-option:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
          transform: translateY(-1px);
        }

        .filter-option.active {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .filter-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--lighter-gray);
          flex-wrap: wrap;
        }

        .type-icon {
          font-size: 0.95rem;
        }

        /* Status Filters */
        .status-filters {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .status-btn {
          padding: 0.75rem 1rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          background-color: white;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.85rem;
          flex: 1;
          min-width: calc(50% - 0.5rem);
          justify-content: center;
        }

        .status-btn:hover {
          background-color: var(--lighter-gray);
          transform: translateY(-1px);
        }

        .status-btn.active {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .status-btn.active:hover {
          background-color: var(--primary-dark);
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Appointments List */
        .appointments-list-container {
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
        }

        .appointments-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
          background-color: var(--lighter-gray);
        }

        .appointment-card {
          background: white;
          padding: 1.25rem;
          transition: var(--transition);
          position: relative;
        }

        .appointment-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--box-shadow-md);
          z-index: 1;
        }

        .appointment-card.high {
          border-left: 4px solid var(--danger-color);
        }

        .appointment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
          position: relative;
          flex-wrap: wrap;
        }

        .patient-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          min-width: 100%;
        }

        .patient-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 600;
          position: relative;
          flex-shrink: 0;
        }

        .emergency-indicator {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 14px;
          height: 14px;
          background-color: var(--danger-color);
          border-radius: 50%;
          border: 2px solid white;
        }

        .patient-info h3 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--dark-color);
        }

        .patient-meta {
          display: flex;
          gap: 0.75rem;
          font-size: 0.8rem;
          color: var(--medium-gray);
          flex-wrap: wrap;
        }

        .appointment-time {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 100%;
          margin-top: 0.5rem;
        }

        .appointment-time .time {
          font-size: 1rem;
          font-weight: 600;
          color: var(--dark-color);
        }

        .appointment-time .date {
          font-size: 0.8rem;
          color: var(--medium-gray);
        }

        .status-badge {
          position: static;
          padding: 0.3rem 0.6rem;
          border-radius: var(--border-radius-sm);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--lighter-gray);
          color: var(--medium-gray);
          margin-top: 0.5rem;
          width: fit-content;
        }

        .status-badge.pending {
          background-color: rgba(248, 150, 30, 0.1);
          color: var(--warning-color);
        }

        .status-badge.in-progress {
          background-color: rgba(67, 97, 238, 0.1);
          color: var(--primary-color);
        }

        .status-badge.completed {
          background-color: rgba(76, 201, 240, 0.1);
          color: var(--success-color);
        }

        .status-icon {
          font-size: 0.85rem;
        }

        .appointment-details {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--lighter-gray);
        }

        .appointment-type {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: var(--dark-gray);
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .appointment-reason,
        .appointment-contact {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .completed-details {
          margin-top: 0.75rem;
          background-color: var(--lighter-gray);
          padding: 0.75rem;
          border-radius: var(--border-radius-sm);
        }

        .detail-section {
          margin-bottom: 0.75rem;
        }

        .detail-section h4 {
          font-size: 0.9rem;
          color: var(--dark-gray);
          margin-bottom: 0.25rem;
        }

        .detail-section p {
          font-size: 0.85rem;
          color: var(--dark-color);
        }

        .appointment-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 0.6rem 1rem;
          border-radius: var(--border-radius-sm);
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition);
          border: 1px solid transparent;
          flex: 1;
          min-width: calc(50% - 0.5rem);
          text-align: center;
        }

        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .start-btn {
          background-color: var(--primary-color);
          color: white;
        }

        .start-btn:hover {
          background-color: var(--primary-dark);
        }

        .complete-btn {
          background-color: var(--success-color);
          color: white;
        }

        .complete-btn:hover {
          background-color: var(--success-dark);
        }

        .reschedule-btn {
          background-color: var(--warning-color);
          color: white;
        }

        .reschedule-btn:hover {
          background-color: var(--warning-dark);
        }

        .cancel-btn {
          background-color: var(--danger-color);
          color: white;
        }

        .cancel-btn:hover {
          background-color: var(--danger-dark);
        }

        .notes-btn {
          background-color: var(--info-color);
          color: white;
        }

        .notes-btn:hover {
          background-color: var(--info-dark);
        }

        .prescription-btn {
          background-color: var(--prescription-color);
          color: white;
        }

        .prescription-btn:hover {
          background-color: var(--prescription-dark);
        }

        .followup-btn {
          background-color: var(--followup-color);
          color: white;
        }

        .followup-btn:hover {
          background-color: var(--followup-dark);
        }

        .view-btn {
          background-color: var(--light-gray);
          color: var(--dark-color);
        }

        .view-btn:hover {
          background-color: var(--medium-gray);
          color: white;
        }

        .primary-btn {
          background-color: var(--primary-color);
          color: white;
        }

        .primary-btn:hover {
          background-color: var(--primary-dark);
        }

        .secondary-btn {
          background-color: white;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
        }

        .secondary-btn:hover {
          background-color: var(--primary-light);
        }

        .danger-btn {
          background-color: var(--danger-color);
          color: white;
        }

        .danger-btn:hover {
          background-color: var(--danger-dark);
        }

        .priority-badge {
          font-size: 0.65rem;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .priority-badge.high {
          background-color: rgba(247, 37, 133, 0.1);
          color: var(--danger-color);
        }

        .appointment-actions-menu {
          position: relative;
          width: 100%;
          margin-top: 0.5rem;
        }

        .menu-btn {
          background: none;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--medium-gray);
          transition: var(--transition);
        }

        .menu-btn:hover {
          background-color: var(--lighter-gray);
          color: var(--primary-color);
        }

        .dropdown-menu {
          position: absolute;
          right: 0;
          top: 100%;
          background-color: white;
          border-radius: var(--border-radius-sm);
          box-shadow: var(--box-shadow-md);
          z-index: 10;
          min-width: 200px;
          padding: 0.5rem 0;
          width: 100%;
        }

        .dropdown-item {
          width: 100%;
          padding: 0.6rem 1rem;
          text-align: left;
          background: none;
          border: none;
          color: var(--dark-color);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .dropdown-item:hover {
          background-color: var(--primary-light);
          color: var(--primary-color);
        }

        .no-results {
          padding: 2rem 1rem;
          text-align: center;
          background-color: white;
        }

        .no-results-content {
          max-width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .no-results img {
          width: 150px;
          height: auto;
          margin-bottom: 0.75rem;
        }

        .no-results h3 {
          font-size: 1.25rem;
          color: var(--dark-color);
        }

        .no-results p {
          color: var(--medium-gray);
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .notification {
          position: fixed;
          top: 1rem;
          right: 1rem;
          background-color: var(--success-color);
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: var(--border-radius);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: var(--box-shadow-lg);
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
          max-width: calc(100% - 2rem);
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .emergency-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
        }

        .modal-content {
          position: relative;
          background-color: white;
          border-radius: var(--border-radius);
          width: 95%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--box-shadow-lg);
          animation: modalFadeIn 0.3s ease-out;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          padding: 1.25rem;
          border-bottom: 1px solid var(--lighter-gray);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .modal-header h2 {
          font-size: 1.25rem;
          color: var(--danger-color);
          margin: 0;
        }

        .modal-header-icon {
          width: 40px;
          height: 40px;
          background-color: rgba(247, 37, 133, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .emergency-icon {
          font-size: 1.25rem;
          color: var(--danger-color);
        }

        .close-btn {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 1.25rem;
          color: var(--medium-gray);
          cursor: pointer;
          transition: var(--transition);
        }

        .close-btn:hover {
          color: var(--danger-color);
        }

        .modal-body {
          padding: 1.25rem;
        }

        .alert-message {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          background-color: rgba(248, 150, 30, 0.1);
          border-radius: var(--border-radius-sm);
          margin-bottom: 1.25rem;
        }

        .alert-icon {
          font-size: 1.25rem;
          color: var(--warning-color);
          flex-shrink: 0;
        }

        .alert-message h4 {
          color: var(--warning-color);
          margin-bottom: 0.25rem;
          font-size: 0.95rem;
        }

        .alert-message p {
          color: var(--dark-gray);
          font-size: 0.85rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--dark-gray);
          font-size: 0.9rem;
        }

        .form-control {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--light-gray);
          border-radius: var(--border-radius-sm);
          font-size: 0.95rem;
          transition: var(--transition);
          font-family: inherit;
        }

        .form-control:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
        }

        .form-control::placeholder {
          color: var(--light-gray);
        }

        textarea.form-control {
          min-height: 80px;
          resize: vertical;
        }

        .emergency-levels {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .emergency-level {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .level-indicator {
          width: 14px;
          height: 14px;
          border-radius: 50%;
        }

        .level-indicator.high {
          background-color: var(--danger-color);
        }

        .level-indicator.medium {
          background-color: var(--warning-color);
        }

        .level-indicator.low {
          background-color: var(--info-color);
        }

        .modal-actions {
          padding: 1.25rem;
          border-top: 1px solid var(--lighter-gray);
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        /* Medium screens (tablets) */
        @media (min-width: 600px) {
          .appointments-container {
            padding: 1.5rem;
          }

          .header-left {
            min-width: auto;
          }

          .search-bar {
            min-width: 300px;
          }

          .emergency-btn {
            width: auto;
          }

          .filter-option {
            min-width: auto;
            flex: none;
          }

          .status-btn {
            min-width: auto;
            flex: none;
          }

          .action-btn {
            min-width: auto;
            flex: none;
          }

          .patient-info {
            min-width: auto;
          }

          .appointment-time {
            min-width: 100px;
            align-items: flex-end;
          }

          .status-badge {
            position: absolute;
            top: 1.25rem;
            right: 1.25rem;
            margin-top: 0;
          }

          .appointment-actions-menu {
            width: auto;
            margin-top: 0;
          }

          .dropdown-menu {
            width: auto;
          }
        }

        /* Large screens (desktops) */
        @media (min-width: 900px) {
          .appointments-container {
            padding: 2rem;
          }

          .appointments-header {
            padding: 1.5rem;
          }

          .appointments-header h1 {
            font-size: 1.8rem;
          }

          .stat-card {
            min-width: 100px;
          }

          .patient-avatar {
            width: 56px;
            height: 56px;
            font-size: 1.5rem;
          }

          .patient-info h3 {
            font-size: 1.2rem;
          }

          .appointment-card {
            padding: 1.75rem;
          }

          .modal-content {
            width: 90%;
            max-width: 600px;
          }

          .modal-header h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Appointments;
