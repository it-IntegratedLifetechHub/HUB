import React, { useState } from "react";
import DoctorNav from "../../components/DoctorNav";
import {
  FaCalendarAlt,
  FaUserInjured,
  FaClipboardCheck,
  FaFlask,
  FaBell,
  FaClock,
  FaExclamationTriangle,
  FaChevronRight,
  FaCheck,
} from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";

const Dashboard = () => {
  // Sample data state
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: "John Doe",
      time: "09:30 AM",
      type: "Follow-up",
      status: "upcoming",
      avatarColor: "#4E79A7",
    },
    {
      id: 2,
      patient: "Sarah Smith",
      time: "11:15 AM",
      type: "New Patient",
      status: "upcoming",
      avatarColor: "#E15759",
    },
    {
      id: 3,
      patient: "Michael Johnson",
      time: "02:00 PM",
      type: "Consultation",
      status: "completed",
      avatarColor: "#76B7B2",
    },
  ]);

  const [pendingConsultations, setPendingConsultations] = useState([
    {
      id: 4,
      patient: "Emily Davis",
      time: "Yesterday 3:45 PM",
      notes: "Lab results pending",
      priority: "medium",
      avatarColor: "#F28E2B",
    },
    {
      id: 5,
      patient: "Robert Brown",
      time: "Today 10:00 AM",
      notes: "Needs prescription review",
      priority: "high",
      avatarColor: "#59A14F",
    },
  ]);

  const [stats, setStats] = useState({
    totalPatients: 42,
    completedConsultations: 28,
    testsOrdered: 15,
    canceledAppointments: 3,
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New lab results available for Patient #1234",
      time: "30 mins ago",
      read: false,
      type: "lab",
    },
    {
      id: 2,
      message: "System maintenance scheduled for tonight",
      time: "2 hours ago",
      read: true,
      type: "system",
    },
    {
      id: 3,
      message: "New message from Dr. Smith regarding Patient #5678",
      time: "1 day ago",
      read: true,
      type: "message",
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const completeAppointment = (id) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: "completed" }
          : appointment
      )
    );
  };

  return (
    <div className="doctor-dashboard">
      <DoctorNav />

      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <h1>Welcome back, Dr. Smith</h1>
            <p className="dashboard-subtitle">Here's what's happening today</p>
          </div>
          <div className="header-right">
            <div className="date-display">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="notification-bell">
              <FaBell />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="notification-alert"></span>
              )}
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          {/* Today's Appointments */}
          <section className="dashboard-card appointments-card">
            <div className="card-header">
              <div className="card-header-left">
                <div className="card-icon-container">
                  <FaCalendarAlt className="card-icon" />
                </div>
                <h2>Today's Appointments</h2>
              </div>
              <span className="badge">{appointments.length}</span>
            </div>
            <div className="card-content">
              {appointments.length > 0 ? (
                <ul className="appointments-list">
                  {appointments.map((appointment) => (
                    <li
                      key={appointment.id}
                      className={`appointment-item ${appointment.status}`}
                    >
                      <div
                        className="patient-avatar"
                        style={{ backgroundColor: appointment.avatarColor }}
                      >
                        {appointment.patient.charAt(0)}
                      </div>
                      <div className="appointment-details">
                        <div className="appointment-time">
                          {appointment.time}
                        </div>
                        <div className="patient-name">
                          {appointment.patient}
                        </div>
                        <div className="appointment-type">
                          {appointment.type}
                        </div>
                      </div>
                      <div className="appointment-actions">
                      
                        <span className="status-badge">
                          {appointment.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-data">
                  <p>No appointments scheduled for today</p>
                  <button className="secondary-btn">Schedule New</button>
                </div>
              )}
            </div>
          </section>

          {/* Pending Consultations */}
          <section className="dashboard-card pending-card">
            <div className="card-header">
              <div className="card-header-left">
                <div className="card-icon-container">
                  <MdPendingActions className="card-icon" />
                </div>
                <h2>Pending Consultations</h2>
              </div>
              <span className="badge">{pendingConsultations.length}</span>
            </div>
            <div className="card-content">
              {pendingConsultations.length > 0 ? (
                <ul className="pending-list">
                  {pendingConsultations.map((consultation) => (
                    <li
                      key={consultation.id}
                      className={`pending-item ${consultation.priority}`}
                    >
                      <div
                        className="patient-avatar"
                        style={{ backgroundColor: consultation.avatarColor }}
                      >
                        {consultation.patient.charAt(0)}
                      </div>
                      <div className="pending-details">
                        <div className="patient-name-time">
                          <span className="patient-name">
                            {consultation.patient}
                          </span>
                          <span className="pending-time">
                            <FaClock /> {consultation.time}
                          </span>
                        </div>
                        <div className="consultation-notes">
                          {consultation.notes}
                        </div>
                      </div>
                      <FaChevronRight className="arrow-icon" />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-data">
                  <p>No pending consultations</p>
                </div>
              )}
            </div>
          </section>

          {/* Quick Stats */}
          <section className="dashboard-card stats-card">
            <div className="card-header">
              <h2>Quick Stats</h2>
            </div>
            <div className="card-content">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon patients">
                    <FaUserInjured />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.totalPatients}</div>
                    <div className="stat-label">Total Patients</div>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon completed">
                    <FaClipboardCheck />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">
                      {stats.completedConsultations}
                    </div>
                    <div className="stat-label">Completed</div>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon tests">
                    <FaFlask />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.testsOrdered}</div>
                    <div className="stat-label">Tests Ordered</div>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon canceled">
                    <FaExclamationTriangle />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">
                      {stats.canceledAppointments}
                    </div>
                    <div className="stat-label">Canceled</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications & Alerts */}
          <section className="dashboard-card notifications-card">
            <div className="card-header">
              <div className="card-header-left">
                <div className="card-icon-container">
                  <FaBell className="card-icon" />
                </div>
                <h2>Notifications & Alerts</h2>
              </div>
              <span className="badge">
                {notifications.filter((n) => !n.read).length}
              </span>
            </div>
            <div className="card-content">
              {notifications.length > 0 ? (
                <ul className="notifications-list">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`notification-item ${
                        notification.read ? "read" : "unread"
                      } ${notification.type}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="notification-icon">
                        {notification.type === "lab" && <FaFlask />}
                        {notification.type === "system" && (
                          <FaExclamationTriangle />
                        )}
                        {notification.type === "message" && <FaUserInjured />}
                      </div>
                      <div className="notification-content">
                        <div className="notification-message">
                          {notification.message}
                        </div>
                        <div className="notification-time">
                          {notification.time}
                        </div>
                      </div>
                      {!notification.read && <div className="unread-dot"></div>}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-data">
                  <p>No new notifications</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      <style jsx="true">{`
        /* Dashboard Styles */
        :root {
          --primary: #4361ee;
          --primary-light: #eef2ff;
          --secondary: #3f37c9;
          --success: #4cc9f0;
          --danger: #f72585;
          --warning: #f8961e;
          --info: #4895ef;
          --dark: #212529;
          --light: #f8f9fa;
          --gray: #6c757d;
          --gray-light: #e9ecef;
          --white: #ffffff;
          --border-radius: 12px;
          --box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          --transition: all 0.3s ease;
        }

        .doctor-dashboard {
          display: flex;
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .dashboard-container {
          flex: 1;
          padding: 2rem 3rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .dashboard-header h1 {
          font-size: 1.8rem;
          color: var(--dark);
          margin: 0;
          font-weight: 700;
        }

        .dashboard-subtitle {
          font-size: 1rem;
          color: var(--gray);
          margin: 0.5rem 0 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .date-display {
          font-size: 0.95rem;
          color: var(--gray);
          font-weight: 500;
        }

        .notification-bell {
          position: relative;
          color: var(--gray);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.5rem;
        }

        .notification-alert {
          position: absolute;
          top: 3px;
          right: 3px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--danger);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.8rem;
        }

        .dashboard-card {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
          transition: var(--transition);
        }

        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 1.5rem;
          border-bottom: 1px solid var(--gray-light);
          background-color: var(--white);
        }

        .card-header-left {
          display: flex;
          align-items: center;
        }

        .card-icon-container {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background-color: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.8rem;
        }

        .card-icon {
          font-size: 1rem;
          color: var(--primary);
        }

        .card-header h2 {
          font-size: 1.1rem;
          margin: 0;
          color: var(--dark);
          font-weight: 600;
        }

        .badge {
          background-color: var(--danger);
          color: white;
          border-radius: 20px;
          padding: 0.25rem 0.6rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .card-content {
          padding: 1.5rem;
        }

        .no-data {
          color: var(--gray);
          text-align: center;
          padding: 1.5rem 0;
        }

        .no-data p {
          margin-bottom: 1rem;
        }

        .secondary-btn {
          background-color: var(--primary-light);
          color: var(--primary);
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }

        .secondary-btn:hover {
          background-color: #e0e7ff;
        }

        /* Appointments List */
        .appointments-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .appointment-item {
          display: flex;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid var(--gray-light);
        }

        .appointment-item:last-child {
          border-bottom: none;
        }

        .patient-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .appointment-details {
          flex: 1;
        }

        .appointment-time {
          font-size: 0.75rem;
          color: var(--gray);
          margin-bottom: 0.2rem;
        }

        .patient-name {
          font-weight: 600;
          color: var(--dark);
          margin-bottom: 0.2rem;
        }

        .appointment-type {
          font-size: 0.8rem;
          color: var(--gray);
        }

        .appointment-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-left: 1rem;
        }

        .status-badge {
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
          border-radius: 20px;
          text-transform: capitalize;
          font-weight: 500;
          margin-top: 0.5rem;
        }

        .appointment-item .status-badge {
          background-color: #fef3c7;
          color: #d97706;
        }

        .appointment-item.completed .status-badge {
          background-color: #dcfce7;
          color: #16a34a;
        }

        .complete-btn {
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          transition: var(--transition);
        }

        .complete-btn:hover {
          background-color: var(--secondary);
        }

        .complete-btn svg {
          font-size: 0.7rem;
        }

        /* Pending Consultations */
        .pending-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .pending-item {
          display: flex;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid var(--gray-light);
          cursor: pointer;
          transition: var(--transition);
        }

        .pending-item:last-child {
          border-bottom: none;
        }

        .pending-item:hover {
          background-color: var(--light);
        }

        .pending-details {
          flex: 1;
        }

        .patient-name-time {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.3rem;
        }

        .patient-name {
          font-weight: 600;
          color: var(--dark);
        }

        .pending-time {
          display: flex;
          align-items: center;
          font-size: 0.7rem;
          color: var(--gray);
          gap: 0.3rem;
        }

        .consultation-notes {
          font-size: 0.8rem;
          color: var(--danger);
          margin-top: 0.25rem;
        }

        .pending-item.high .consultation-notes {
          color: var(--danger);
        }

        .pending-item.medium .consultation-notes {
          color: var(--warning);
        }

        .arrow-icon {
          color: var(--gray-light);
          margin-left: 1rem;
          transition: var(--transition);
        }

        .pending-item:hover .arrow-icon {
          color: var(--primary);
          transform: translateX(3px);
        }

        /* Stats Card */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .stat-icon.patients {
          background-color: rgba(67, 97, 238, 0.1);
          color: var(--primary);
        }

        .stat-icon.completed {
          background-color: rgba(76, 201, 240, 0.1);
          color: var(--success);
        }

        .stat-icon.tests {
          background-color: rgba(72, 149, 239, 0.1);
          color: var(--info);
        }

        .stat-icon.canceled {
          background-color: rgba(247, 37, 133, 0.1);
          color: var(--danger);
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--dark);
          line-height: 1.2;
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--gray);
        }

        /* Notifications */
        .notifications-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          padding: 1rem 0;
          border-bottom: 1px solid var(--gray-light);
          cursor: pointer;
          position: relative;
          gap: 1rem;
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 0.9rem;
        }

        .notification-item.lab .notification-icon {
          background-color: rgba(72, 149, 239, 0.1);
          color: var(--info);
        }

        .notification-item.system .notification-icon {
          background-color: rgba(248, 150, 30, 0.1);
          color: var(--warning);
        }

        .notification-item.message .notification-icon {
          background-color: rgba(67, 97, 238, 0.1);
          color: var(--primary);
        }

        .notification-content {
          flex: 1;
        }

        .notification-message {
          color: var(--dark);
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .notification-item.unread .notification-message {
          font-weight: 600;
        }

        .notification-time {
          font-size: 0.75rem;
          color: var(--gray);
        }

        .unread-dot {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--danger);
        }

        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 992px) {
          .dashboard-container {
            padding: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-right {
            width: 100%;
            justify-content: space-between;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .dashboard-container {
            padding: 1rem;
          }

          .appointment-item {
            flex-wrap: wrap;
          }

          .appointment-actions {
            flex-direction: row;
            width: 100%;
            justify-content: space-between;
            margin-top: 0.5rem;
            margin-left: 0;
            padding-left: calc(40px + 1rem);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
