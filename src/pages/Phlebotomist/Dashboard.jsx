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
      <style jsx="true">
        {`
          /* General Dashboard Styles */
          /* Base Styles */
          .dashboard-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px 16px 100px;
    font-family: "Outfit", sans-serif;
          }

          .dashboard-title {
            font-size: 28px;
            color: var(--primary-color);
            margin-bottom: 24px;
            text-align: center;
            font-weight: 700;
          }

          /* Task Overview Cards */
          .task-overview {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 24px;
          }

          .task-card {
            background: white;
            border-radius: var(--border-radius);
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 16px;
            box-shadow: var(--box-shadow);
            transition: var(--transition);
            border-bottom: 4px solid transparent;
          }

          .task-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          }

          .task-card.total {
            border-color: var(--primary-color);
          }

          .task-card.completed {
            border-color: var(--secondary-color);
          }

          .task-card.pending {
            border-color: var(--warning-color);
          }

          .task-card.urgent {
            border-color: var(--danger-color);
          }

          .task-icon {
            font-size: 55px;
            color: white;
            background: var(--primary-color);
            padding: 12px;
            border-radius: 50%;
          }

          .task-card.completed .task-icon {
            background: var(--secondary-color);
          }

          .task-card.pending .task-icon {
            background: var(--warning-color);
          }

          .task-card.urgent .task-icon {
            background: var(--danger-color);
          }

          .task-card-content h2 {
            font-size: 28px;
            margin: 0;
            color: var(--text-dark);
          }

          .task-card-content p {
            margin: 4px 0 0;
            color: var(--text-medium);
            font-size: 14px;
            font-weight: 600;
          }

          /* Dashboard Grid Layout */
          .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
          }

          /* Section Styles */
          .calendar-section,
          .task-filters {
            background: white;
            border-radius: var(--border-radius);
            padding: 20px;
            box-shadow: var(--box-shadow);
          }

          .section-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
          }

          .section-header h2 {
            font-size: 20px;
            color: var(--text-dark);
            margin: 0;
          }

          .section-icon {
            color: var(--primary-color);
            font-size: 20px;
          }

          /* Calendar Styles */
          .custom-calendar {
            width: 100%;
            border: none;
            border-radius: 8px;
          }

          .react-calendar__tile--now {
            background: var(--primary-light);
          }

          .react-calendar__tile--active {
            background: var(--primary-color);
            color: white;
          }

          /* Calendar Markings */
          .calendar-task-completed {
            background: var(--secondary-color) !important;
            color: white !important;
            border-radius: 50%;
          }

          .calendar-task-pending {
            background: var(--warning-color) !important;
            color: white !important;
            border-radius: 50%;
          }

          /* Filter Buttons */
          .filter-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .filter-btn {
            padding: 10px;
            border: none;
            border-radius: 6px;
            background: #f8f9fa;
            color: var(--text-medium);
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
          }

          .filter-btn.active {
            background: var(--primary-color);
            color: white;
          }

          .filter-btn:hover {
            background: #e9ecef;
          }

          .filter-btn.active:hover {
            background: var(--primary-color);
          }

          /* Appointments Section */
          .appointments-section {
            background: white;
            border-radius: var(--border-radius);
            padding: 20px;
            box-shadow: var(--box-shadow);
          }

          .appointments-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          /* Task Item Styles */
          .task-item {
            background: white;
            border-radius: var(--border-radius);
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            border-left: 4px solid var(--warning-color);
            transition: var(--transition);
          }

          .task-item:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .task-item.completed {
            border-left-color: var(--secondary-color);
            opacity: 0.9;
          }

          .task-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }

          .patient-info {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .patient-info h3 {
            margin: 0;
            font-size: 18px;
            color: var(--text-dark);
          }

          .info-icon {
            color: var(--primary-color);
          }

          /* Priority Badge */
          .priority-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }

          .priority-badge.high {
            background: #fee2e2;
            color: var(--danger-color);
          }

          .priority-badge.urgent {
            background: #ffd6d6;
            color: #c00;
          }

          .priority-badge.medium {
            background: #fef3c7;
            color: #b45309;
          }

          .priority-badge.low {
            background: #d1fae5;
            color: #065f46;
          }

          /* Status Badge */
          .status-badge {
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
          }

          .status-badge.pending {
            background: #fef3c7;
            color: #b45309;
          }

          .status-badge.completed {
            background: #d1fae5;
            color: #065f46;
          }

          .status-badge.in-progress {
            background: #dbeafe;
            color: #1e40af;
          }

          /* Task Details */
          .task-details {
            margin: 12px 0;
          }

          .detail-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
            color: var(--text-medium);
          }

          .detail-icon {
            color: var(--primary-color);
            min-width: 20px;
          }

          .task-notes {
            margin-top: 12px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
            font-size: 14px;
          }

          /* Task Actions */
          .task-actions {
            display: flex;
            gap: 10px;
            margin-top: 16px;
          }

          .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            flex: 1;
          }

          .start-btn {
            background: var(--warning-color);
            color: white;
          }

          .start-btn:hover {
            background: #e68a00;
          }

          .complete-btn {
            background: var(--secondary-color);
            color: white;
          }

          .complete-btn:hover {
            background: #218838;
          }

          .reschedule-btn {
            background: white;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
          }

          .reschedule-btn:hover {
            background: var(--primary-light);
          }

          .contact-btn {
            background: white;
            color: var(--info-color);
            border: 1px solid var(--info-color);
          }

          .contact-btn:hover {
            background: #e6f7ff;
          }

          /* No Tasks State */
          .no-tasks {
            text-align: center;
            padding: 40px 20px;
            background: #f8f9fa;
            border-radius: var(--border-radius);
            color: var(--text-medium);
          }

          /* Responsive Design */
          @media (max-width: 992px) {
            .dashboard-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 768px) {
            .task-overview {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 576px) {
            .task-overview {
              grid-template-columns: 1fr;
            }

            .filter-buttons {
              grid-template-columns: 1fr;
            }

            .task-actions {
              flex-direction: column;
            }
          }
        `}
      </style>
    </>
  );
};

export default Dashboard;
