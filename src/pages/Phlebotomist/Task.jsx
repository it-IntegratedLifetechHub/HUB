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
    </>
  );
};

export default Task;
