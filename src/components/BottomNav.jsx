import React from "react";
import { useState, useEffect } from "react";
import { FaHome, FaUser, FaBell, FaPlus, FaHistory } from "react-icons/fa";
import { MdOutlineInventory, MdLocalHospital } from "react-icons/md";
import { TbReportMedical, TbReport } from "react-icons/tb";
import { useLocation, Link } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [hasNotifications, setHasNotifications] = useState(false);

  // Sample data - replace with actual notification check
  useEffect(() => {
    // Simulate checking for notifications
    const timer = setTimeout(() => {
      setHasNotifications(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    {
      path: "/patient",
      icon: <FaHome size={20} />,
      label: "Home",
      exact: true,
    },
    {
      path: "/orders",
      icon: <FaHistory size={20} />,
      label: "Orders",
    },

    {
      path: "/report",
      icon: <TbReportMedical size={20} />,
      label: "Reports",
    },
    {
      path: "/profile",
      icon: (
        <div className="notification-wrapper">
          <FaUser size={20} />
          {hasNotifications && <span className="notification-badge" />}
        </div>
      ),
      label: "Profile",
    },
  ];

  return (
    <>
      <div className="bottom-navigation">
        {navItems.map((item) => {
          const isActive = item.exact
            ? currentPath === item.path
            : currentPath.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""} ${
                item.floating ? "floating" : ""
              }`}
            >
              <div className="nav-icon">{item.icon}</div>
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <style jsx="true">{`
        .bottom-navigation {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background-color: #fff;
          border-top: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 8px 0 10px;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
          z-index: 1000;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 10px;
          color: #888;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
          position: relative;
          flex: 1;
          padding: 4px 0;
          opacity: 0.8;
        }

        .nav-item:hover {
          color: #9900ff;
          opacity: 1;
        }

        .nav-item.active {
          color: #9900ff;
          opacity: 1;
          transform: translateY(-2px);
        }

        .nav-icon {
          margin-bottom: 4px;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-item.active .nav-icon {
          transform: scale(1.15);
        }

        .nav-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2px;
        }

        /* Floating Action Button */
        .nav-item.floating {
          position: relative;
          z-index: 1001;
        }

        .floating-action {
          background: linear-gradient(135deg, #9900ff, #7b00cc);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(153, 0, 255, 0.3);
          transform: translateY(-20px);
          transition: all 0.3s ease;
        }

        .nav-item.floating .nav-label {
          position: absolute;
          bottom: -20px;
          color: #9900ff;
          font-weight: 600;
        }

        .nav-item.floating.active .floating-action {
          transform: translateY(-25px) scale(1.05);
        }

        /* Notification Badge */
        .notification-wrapper {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 8px;
          height: 8px;
          background-color: #ff4757;
          border-radius: 50%;
          border: 2px solid white;
        }

        /* Responsive Design */
        @media (min-width: 768px) {
          .bottom-navigation {
            max-width: 500px;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 30px 30px 0 0;
            bottom: 20px;
            border: 1px solid #f0f0f0;
          }

          .nav-label {
            font-size: 11px;
          }
        }

        @media (max-width: 350px) {
          .nav-label {
            font-size: 9px;
          }

          .floating-action {
            width: 44px;
            height: 44px;
          }
        }
      `}</style>
      ;
    </>
  );
};

export default BottomNavigation;
