import React, { useState, useEffect } from "react";
import PhlebotomistBottomNavigation from "../../components/PhlebotomistNav";
import {
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiDroplet,
} from "react-icons/fi";

// Enhanced Mock JSON data for the tasks
const taskData = [
  {
    id: 1,
    testName: "Complete Blood Count (CBC)",
    status: "Pending",
    patient: {
      name: "John Doe",
      contact: "+91 9876543210",
      address: "123 Green Street, Delhi - 110001",
    },
    booking: {
      date: "10 January 2025",
      time: "8:30 AM",
      timeWindow: "8:30 AM - 9:30 AM",
    },
    testDetails: {
      type: "CBC (Complete Blood Count)",
      notes:
        "Fasting required for 8 hours before the test. Bring your Aadhaar card and doctor's prescription.",
      priority: "High",
    },
  },
  {
    id: 2,
    testName: "Lipid Profile",
    status: "Completed",
    patient: {
      name: "Jane Smith",
      contact: "+91 8765432109",
      address: "456 Blue Lane, Mumbai - 400001",
    },
    booking: {
      date: "8 February 2025",
      time: "9:00 AM",
      timeWindow: "9:00 AM - 10:00 AM",
    },
    testDetails: {
      type: "Lipid Profile Test",
      notes:
        "Avoid fatty foods 24 hours before the test. Water intake is allowed.",
      priority: "Medium",
    },
  },
  {
    id: 3,
    testName: "Thyroid Function Test (TFT)",
    status: "In Progress",
    patient: {
      name: "Rahul Verma",
      contact: "+91 9988776655",
      address: "789 Yellow Road, Bangalore - 560001",
    },
    booking: {
      date: "12 March 2025",
      time: "7:45 AM",
      timeWindow: "7:45 AM - 8:45 AM",
    },
    testDetails: {
      type: "Thyroid Function Test",
      notes:
        "Take test on an empty stomach. Medication should be taken only after the test.",
      priority: "High",
    },
  },
  {
    id: 4,
    testName: "Blood Sugar Test",
    status: "Pending",
    patient: {
      name: "Anita Sharma",
      contact: "+91 9898989898",
      address: "101 Red Street, Kolkata - 700001",
    },
    booking: {
      date: "15 April 2025",
      time: "10:15 AM",
      timeWindow: "10:15 AM - 11:15 AM",
    },
    testDetails: {
      type: "Fasting Blood Sugar Test",
      notes:
        "No food intake for at least 12 hours before the test. Diabetic patients should carry their medication.",
      priority: "Medium",
    },
  },
  {
    id: 5,
    testName: "Vitamin D Test",
    status: "Completed",
    patient: {
      name: "Vikram Singh",
      contact: "+91 9090909090",
      address: "222 White Avenue, Chennai - 600001",
    },
    booking: {
      date: "5 May 2025",
      time: "8:00 AM",
      timeWindow: "8:00 AM - 9:00 AM",
    },
    testDetails: {
      type: "Vitamin D (25-Hydroxy) Test",
      notes:
        "No specific fasting required. Report will be available in 24 hours.",
      priority: "Low",
    },
  },
];

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Simulate API fetch
    setTasks(taskData);
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <FiClock className="icon" />;
      case "completed":
        return <FiCheckCircle className="icon" />;
      case "in progress":
        return <FiAlertCircle className="icon" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <span className="priority-badge high">High Priority</span>;
      case "medium":
        return <span className="priority-badge medium">Medium Priority</span>;
      case "low":
        return <span className="priority-badge low">Low Priority</span>;
      default:
        return null;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <>
      <div className="task-list-container">
        <div className="task-list-header">
          <h1 className="page-title">My Tasks</h1>
          <div className="filter-controls">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`filter-btn ${
                filter === "in progress" ? "active" : ""
              }`}
              onClick={() => setFilter("in progress")}
            >
              In Progress
            </button>
            <button
              className={`filter-btn ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks found for the selected filter.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`task-container ${task.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              <div className="task-header">
                <div className="task-title-wrapper">
                  <FiDroplet className="test-icon" />
                  <h2>{task.testName}</h2>
                </div>
                <div className="status-wrapper">
                  {getPriorityBadge(task.testDetails.priority)}
                  <span
                    className={`status-badge ${task.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {getStatusIcon(task.status)}
                    {task.status}
                  </span>
                </div>
              </div>

              <div className="patient-info">
                <h3>
                  <span className="info-label">Patient:</span>
                  <span className="patient-name">{task.patient.name}</span>
                </h3>
              </div>

              <div className="task-details-grid">
                <div className="detail-item">
                  <FiCalendar className="detail-icon" />
                  <div>
                    <p className="detail-label">Appointment Date</p>
                    <p className="detail-value">{task.booking.date}</p>
                    <p className="detail-subvalue">{task.booking.timeWindow}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <FiPhone className="detail-icon" />
                  <div>
                    <p className="detail-label">Contact Number</p>
                    <p className="detail-value">{task.patient.contact}</p>
                    <button className="contact-btn">Call Now</button>
                  </div>
                </div>

                <div className="detail-item">
                  <FiMapPin className="detail-icon" />
                  <div>
                    <p className="detail-label">Address</p>
                    <p className="detail-value">{task.patient.address}</p>
                    <button className="map-btn">View on Map</button>
                  </div>
                </div>
              </div>

              <div className="important-notes">
                <h4 className="notes-title">
                  <span className="notes-icon">📝</span> Important Notes
                </h4>
                <p className="notes-content">{task.testDetails.notes}</p>
              </div>

              <div className="task-actions">
                {task.status === "Pending" && (
                  <button className="btn-primary start-btn">
                    Start Collection
                  </button>
                )}
                {task.status === "In Progress" && (
                  <button className="btn-primary complete-btn">
                    Mark as Completed
                  </button>
                )}

                <button className="btn-tertiary">Contact Support</button>
              </div>
            </div>
          ))
        )}
      </div>

      <PhlebotomistBottomNavigation />

      <style jsx="true">{`
        /* Base Styles */
        .task-list-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px 16px 80px;
        }

        .task-list-header {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0;
        }

        .filter-controls {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .filter-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 20px;
          background-color: #e5e7eb;
          color: var(--text-medium);
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: var(--transition);
        }

        .filter-btn.active {
          background-color: var(--primary-color);
          color: white;
        }

        .filter-btn:hover {
          background-color: #d1d5db;
        }

        .filter-btn.active:hover {
          background-color: var(--primary-hover);
        }

        /* Task Container */
        .task-container {
          background: white;
          padding: 24px;
          margin-bottom: 20px;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          transition: var(--transition);
          border-left: 4px solid var(--primary-color);
        }

        .task-container.pending {
          border-left-color: var(--warning-color);
        }

        .task-container.in-progress {
          border-left-color: var(--primary-color);
        }

        .task-container.completed {
          border-left-color: var(--secondary-color);
        }

        .task-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }

        /* Task Header */
        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .task-title-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .test-icon {
          color: var(--primary-color);
          font-size: 20px;
        }

        .task-header h2 {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0;
        }

        .status-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Status Badge */
        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-badge.pending {
          background-color: #fef3c7;
          color: #d97706;
        }

        .status-badge.in-progress {
          background-color: var(--primary-light);
          color: var(--primary-color);
        }

        .status-badge.completed {
          background-color: #d1fae5;
          color: #059669;
        }

        .status-badge .icon {
          font-size: 16px;
        }

        /* Priority Badge */
        .priority-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .priority-badge.high {
          background-color: #fee2e2;
          color: var(--danger-color);
        }

        .priority-badge.medium {
          background-color: #fef3c7;
          color: #d97706;
        }

        .priority-badge.low {
          background-color: #d1fae5;
          color: #059669;
        }

        /* Patient Info */
        .patient-info {
          margin-bottom: 16px;
        }

        .patient-info h3 {
          font-size: 16px;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-medium);
        }

        .info-label {
          font-weight: 600;
        }

        .patient-name {
          font-weight: 700;
          color: var(--text-dark);
        }

        /* Task Details Grid */
        .task-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .detail-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .detail-icon {
          color: var(--primary-color);
          font-size: 20px;
          margin-top: 2px;
        }

        .detail-label {
          font-size: 14px;
          color: var(--text-light);
          margin: 0 0 4px;
        }

        .detail-value {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-dark);
          margin: 0 0 6px;
        }

        .detail-subvalue {
          font-size: 14px;
          color: var(--text-medium);
          margin: 0;
        }

        .contact-btn,
        .map-btn {
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: var(--transition);
        }

        .contact-btn {
          background-color: #e0f2fe;
          color: #0369a1;
        }

        .contact-btn:hover {
          background-color: #bae6fd;
        }

        .map-btn {
          background-color: #e0e7ff;
          color: #4338ca;
        }

        .map-btn:hover {
          background-color: #c7d2fe;
        }

        /* Important Notes */
        .important-notes {
          background-color: var(--primary-light);
          padding: 16px;
          border-radius: var(--border-radius);
          margin-bottom: 20px;
        }

        .notes-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          color: var(--primary-color);
          margin: 0 0 8px;
        }

        .notes-content {
          font-size: 15px;
          color: var(--text-dark);
          margin: 0;
          line-height: 1.5;
        }

        /* Task Actions */
        .task-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-primary,
        .btn-secondary,
        .btn-tertiary {
          width: 100%;
          padding: 14px;
          border: none;
          font-size: 16px;
          font-weight: 600;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }

        .btn-primary:hover {
          background-color: var(--primary-hover);
        }

        .btn-secondary {
          background-color: white;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
        }

        .btn-secondary:hover {
          background-color: var(--primary-light);
        }

        .btn-tertiary {
          background-color: transparent;
          color: var(--text-medium);
          border: 1px solid #e5e7eb;
        }

        .btn-tertiary:hover {
          background-color: #f9fafb;
        }

        .start-btn {
          background-color: var(--warning-color);
        }

        .start-btn:hover {
          background-color: #d97706;
        }

        .complete-btn {
          background-color: var(--secondary-color);
        }

        .complete-btn:hover {
          background-color: #059669;
        }

        /* Loading State */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          gap: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--primary-light);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* No Tasks State */
        .no-tasks {
          text-align: center;
          padding: 40px 20px;
          background-color: #f9fafb;
          border-radius: var(--border-radius);
          color: var(--text-medium);
        }

        /* Responsive Design */
        @media (min-width: 600px) {
          .task-details-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .task-actions {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .btn-primary,
          .btn-secondary,
          .btn-tertiary {
            width: auto;
            flex: 1;
          }
        }

        @media (max-width: 480px) {
          .task-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .status-wrapper {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </>
  );
};

export default Task;
