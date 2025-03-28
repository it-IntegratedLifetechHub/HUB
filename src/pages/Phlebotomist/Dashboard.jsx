import React, { useState } from "react";
import {
  FaClipboardList,
  FaCheckCircle,
  FaHourglassHalf,
  FaCalendarAlt,
  FaBell,
} from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import PhlebotomistBottomNavigation from "../../components/PhlebotomistNav";

const Dashboard = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      patient: "John Doe",
      time: "10:00 AM",
      date: "2025-03-27",
      status: "Pending",
    },
    {
      id: 2,
      patient: "Jane Smith",
      time: "11:30 AM",
      date: "2025-03-28",
      status: "Completed",
    },
    {
      id: 3,
      patient: "Michael Brown",
      time: "01:00 PM",
      date: "2025-03-27",
      status: "Pending",
    },
    {
      id: 4,
      patient: "Lisa Green",
      time: "03:30 PM",
      date: "2025-03-29",
      status: "Completed",
    },
  ]);

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;
  const totalTasks = tasks.length;

  // Extract unique task dates for calendar marking
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

  return (
    <>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Phlebotomist Dashboard</h1>

        {/* Task Overview Section */}
        <div className="task-overview">
          <div className="task-card completed">
            <FaCheckCircle className="task-icon" />
            <h2>{completedTasks}</h2>
            <p>Completed Tasks</p>
          </div>
          <div className="task-card pending">
            <FaHourglassHalf className="task-icon" />
            <h2>{pendingTasks}</h2>
            <p>Pending Tasks</p>
          </div>
          <div className="task-card total">
            <FaClipboardList className="task-icon" />
            <h2>{totalTasks}</h2>
            <p>Total Tasks</p>
          </div>
        </div>

        {/* Calendar Integration */}
        <div className="calendar-section">
          <h2>
            <FaCalendarAlt /> Task Calendar
          </h2>
          <Calendar tileClassName={tileClassName} />
        </div>

        {/* Upcoming Appointments */}
        <div className="appointments">
          <h2>
            <FaCalendarAlt /> Upcoming Appointments
          </h2>
          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`task-item ${task.status.toLowerCase()}`}
              >
                <span>{task.patient}</span> - <span>{task.time}</span> (
                {task.date})
                <span className={`status ${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <PhlebotomistBottomNavigation />
    </>
  );
};

export default Dashboard;
