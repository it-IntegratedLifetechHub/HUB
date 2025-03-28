import React, { useState } from "react";
import {
  FaClipboardList,
  FaCheckCircle,
  FaHourglassHalf,
  FaCalendarAlt,
  FaBell,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import PhlebotomistBottomNavigation from "../../components/PhlebotomistNav";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState("all");

  const [tasks, setTasks] = useState([
    {
      id: 1,
      patient: "John Doe",
      contact: "+1 (555) 123-4567",
      address: "123 Main St, New York, NY",
      time: "10:00 AM",
      date: "2025-03-27",
      status: "Pending",
      priority: "High",
      testType: "Complete Blood Count (CBC)",
      notes: "Fasting required for 8 hours before the test",
    },
    {
      id: 2,
      patient: "Jane Smith",
      contact: "+1 (555) 987-6543",
      address: "456 Oak Ave, Boston, MA",
      time: "11:30 AM",
      date: "2025-03-28",
      status: "Completed",
      priority: "Medium",
      testType: "Lipid Profile",
      notes: "Avoid fatty foods 24 hours before test",
    },
    {
      id: 3,
      patient: "Michael Brown",
      contact: "+1 (555) 456-7890",
      address: "789 Pine Rd, Chicago, IL",
      time: "01:00 PM",
      date: "2025-03-27",
      status: "Pending",
      priority: "Urgent",
      testType: "Thyroid Panel",
      notes: "Take medications after blood draw",
    },
    {
      id: 4,
      patient: "Lisa Green",
      contact: "+1 (555) 321-6547",
      address: "101 Elm Blvd, Seattle, WA",
      time: "03:30 PM",
      date: "2025-03-29",
      status: "Completed",
      priority: "Low",
      testType: "Vitamin D Test",
      notes: "No special preparation needed",
    },
    {
      id: 5,
      patient: "David Wilson",
      contact: "+1 (555) 789-1234",
      address: "202 Maple Dr, Austin, TX",
      time: "09:00 AM",
      date: "2025-03-30",
      status: "Pending",
      priority: "High",
      testType: "Glucose Tolerance Test",
      notes: "Requires 2-hour monitoring period",
    },
  ]);

  // Task statistics
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;
  const urgentTasks = tasks.filter(
    (task) => task.priority === "Urgent" && task.status === "Pending"
  ).length;
  const totalTasks = tasks.length;

  // Filter tasks based on active filter
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "today") {
      const today = new Date().toISOString().split("T")[0];
      return task.date === today;
    }
    return task.status === activeFilter;
  });

  // Calendar tile markings
  const taskDates = tasks.reduce((acc, task) => {
    acc[task.date] = task.status;
    return acc;
  }, {});

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = date.toISOString().split("T")[0];
      if (taskDates[formattedDate]) {
        return taskDates[formattedDate] === "Completed"
          ? "calendar-task-completed"
          : "calendar-task-pending";
      }
    }
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  // Handle task status change
  const handleStatusChange = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Phlebotomist Dashboard</h1>

        {/* Task Overview Cards */}
        <div className="task-overview">
          <div className="task-card total">
            <FaClipboardList className="task-icon" />
            <div className="task-card-content">
              <h2>{totalTasks}</h2>
              <p>Total Tasks</p>
            </div>
          </div>
          <div className="task-card completed">
            <FaCheckCircle className="task-icon" />
            <div className="task-card-content">
              <h2>{completedTasks}</h2>
              <p>Completed</p>
            </div>
          </div>
          <div className="task-card pending">
            <FaHourglassHalf className="task-icon" />
            <div className="task-card-content">
              <h2>{pendingTasks}</h2>
              <p>Pending</p>
            </div>
          </div>
          <div className="task-card urgent">
            <FaBell className="task-icon" />
            <div className="task-card-content">
              <h2>{urgentTasks}</h2>
              <p>Urgent</p>
            </div>
          </div>
        </div>

        {/* Calendar and Task Filters */}
        <div className="dashboard-grid">
          <div className="calendar-section">
            <div className="section-header">
              <FaCalendarAlt className="section-icon" />
              <h2>Task Calendar</h2>
            </div>
            <Calendar
              onChange={setDate}
              value={date}
              tileClassName={tileClassName}
              className="custom-calendar"
            />
          </div>

          {/* Task Filters */}
          <div className="task-filters">
            <div className="section-header">
              <FaClipboardList className="section-icon" />
              <h2>Task Filters</h2>
            </div>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${
                  activeFilter === "all" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("all")}
              >
                All Tasks
              </button>
              <button
                className={`filter-btn ${
                  activeFilter === "today" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("today")}
              >
                Today's Tasks
              </button>
              <button
                className={`filter-btn ${
                  activeFilter === "Pending" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("Pending")}
              >
                Pending
              </button>
              <button
                className={`filter-btn ${
                  activeFilter === "Completed" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("Completed")}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="appointments-section">
          <div className="section-header">
            <FaCalendarAlt className="section-icon" />
            <h2>Upcoming Appointments</h2>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="no-tasks">
              <p>No tasks found for the selected filter.</p>
            </div>
          ) : (
            <div className="appointments-list">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-item ${task.status.toLowerCase()}`}
                >
                  <div className="task-header">
                    <div className="patient-info">
                      <FaUser className="info-icon" />
                      <h3>{task.patient}</h3>
                      <span
                        className={`priority-badge ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <span
                      className={`status-badge ${task.status.toLowerCase()}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="task-details">
                    <div className="detail-row">
                      <FaCalendarAlt className="detail-icon" />
                      <p>
                        {formatDate(task.date)} at {task.time}
                      </p>
                    </div>
                    <div className="detail-row">
                      <FaClipboardList className="detail-icon" />
                      <p>{task.testType}</p>
                    </div>
                    <div className="detail-row">
                      <FaPhone className="detail-icon" />
                      <p>{task.contact}</p>
                    </div>
                    <div className="detail-row">
                      <FaMapMarkerAlt className="detail-icon" />
                      <p>{task.address}</p>
                    </div>
                    {task.notes && (
                      <div className="task-notes">
                        <p>
                          <strong>Notes:</strong> {task.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="task-actions">
                    {task.status === "Pending" && (
                      <>
                        <button
                          className="btn start-btn"
                          onClick={() =>
                            handleStatusChange(task.id, "In Progress")
                          }
                        >
                          Start Task
                        </button>
                        <button className="btn reschedule-btn">
                          Reschedule
                        </button>
                      </>
                    )}
                    {task.status === "In Progress" && (
                      <button
                        className="btn complete-btn"
                        onClick={() => handleStatusChange(task.id, "Completed")}
                      >
                        Mark Complete
                      </button>
                    )}
                    <button className="btn contact-btn">Contact Patient</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <PhlebotomistBottomNavigation />
    </>
  );
};

export default Dashboard;
