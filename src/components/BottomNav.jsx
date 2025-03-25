import React from "react";
import { FaHome, FaBox, FaUser } from "react-icons/fa";
import { TbReportMedical } from "react-icons/tb";

const BottomNavigation = () => {
  return (
    <div className="bottom-navigation">
      <a href="/patient" className="active">
        <FaHome size={22} />
        <span>Home</span>
      </a>
      <a href="/orders">
        <FaBox size={22} />
        <span>Orders</span>
      </a>
      <a href="/report">
        <TbReportMedical size={22} />
        <span>Report</span>
      </a>
      <a href="/profile">
        <FaUser size={22} />
        <span>Profile</span>
      </a>
    </div>
  );
};

export default BottomNavigation;
