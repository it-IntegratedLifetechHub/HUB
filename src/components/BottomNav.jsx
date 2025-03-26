import React from "react";
import { FaHome, FaBox, FaUser } from "react-icons/fa";
import { TbReportMedical } from "react-icons/tb";
import { useLocation, Link } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bottom-navigation">
      <Link
        to="/patient"
        className={currentPath === "/patient" ? "active" : ""}
      >
        <FaHome size={22} />
        <span>Home</span>
      </Link>
      <Link to="/orders" className={currentPath === "/orders" ? "active" : ""}>
        <FaBox size={22} />
        <span>Orders</span>
      </Link>
      <Link to="/report" className={currentPath === "/report" ? "active" : ""}>
        <TbReportMedical size={22} />
        <span>Report</span>
      </Link>
      <Link
        to="/profile"
        className={currentPath === "/profile" ? "active" : ""}
      >
        <FaUser size={22} />
        <span>Profile</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
