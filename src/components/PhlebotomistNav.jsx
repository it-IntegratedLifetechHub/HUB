import React from "react";
import { FaTasks, FaUserCircle, FaChartLine } from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";

const PhlebotomistBottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="phlebotomist-bottom-navigation">
      <Link
        to="/phlebotomist/dashboard"
        className={currentPath === "/phlebotomist/dashboard" ? "active" : ""}
      >
        <FaChartLine size={22} />
        <span>Dashboard</span>
      </Link>
      <Link
        to="/phlebotomist/task"
        className={currentPath === "/phlebotomist/task" ? "active" : ""}
      >
        <FaTasks size={22} />
        <span>Tasks</span>
      </Link>
      <Link
        to="/phlebotomist/profile"
        className={currentPath === "/phlebotomist/profile" ? "active" : ""}
      >
        <FaUserCircle size={22} />
        <span>Profile</span>
      </Link>
    </div>
  );
};

export default PhlebotomistBottomNavigation;
