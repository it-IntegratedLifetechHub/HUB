import React, { useState } from "react";
import { FaTasks, FaUserCircle, FaChartLine, FaBell } from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";

const PhlebotomistBottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [hasNotifications, setHasNotifications] = useState(true); // Set based on actual notifications

  const navItems = [
    {
      path: "/phlebotomist/dashboard",
      icon: <FaChartLine size={20} />,
      label: "Dashboard",
      exact: true,
    },
    {
      path: "/phlebotomist/task",
      icon: <FaTasks size={20} />,
      label: "Tasks",
      badge: 3, // Example task count
    },
    {
      path: "/phlebotomist/profile",
      icon: (
        <div className="notification-wrapper">
          <FaUserCircle size={20} />
          {hasNotifications && <span className="notification-badge" />}
        </div>
      ),
      label: "Profile",
    },
  ];

  return (
    <nav className="phlebotomist-bottom-navigation">
      {navItems.map((item) => {
        const isActive = item.exact
          ? currentPath === item.path
          : currentPath.startsWith(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive ? "active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <div className="nav-icon">
              {item.icon}
              {item.badge && <span className="task-badge">{item.badge}</span>}
            </div>
            <span className="nav-label">{item.label}</span>
            {isActive && <div className="active-indicator" />}
          </Link>
        );
      })}

      <style jsx="true">{`
        .phlebotomist-bottom-navigation {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background-color: #ffffff;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 12px 0;
          box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.95);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
          font-weight: 500;
          color: #666;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          padding: 6px 12px;
          position: relative;
          flex: 1;
          max-width: 120px;
        }

        .nav-item:hover {
          color: #7b00cc;
        }

        .nav-item.active {
          color: #5e0d97;
        }

        .nav-icon {
          position: relative;
          margin-bottom: 4px;
          transition: transform 0.3s ease;
        }

        .nav-item.active .nav-icon {
          transform: translateY(-4px);
        }

        .nav-label {
          font-size: 12px;
          transition: font-weight 0.3s ease;
        }

        .nav-item.active .nav-label {
          font-weight: 600;
        }

        .active-indicator {
          position: absolute;
          top: -8px;
          width: 20px;
          height: 3px;
          background-color: #5e0d97;
          border-radius: 3px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .nav-item.active .active-indicator {
          opacity: 1;
        }

        .notification-wrapper {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: -3px;
          right: -5px;
          width: 8px;
          height: 8px;
          background-color: #ff4757;
          border-radius: 50%;
          border: 2px solid white;
        }

        .task-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: #5e0d97;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
          .phlebotomist-bottom-navigation {
            padding: 10px 0;
          }

          .nav-label {
            font-size: 11px;
          }

          .nav-item {
            padding: 6px 8px;
          }
        }

        @media (min-width: 768px) {
          .phlebotomist-bottom-navigation {
            max-width: 500px;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 25px 25px 0 0;
            bottom: 20px;
            border: 1px solid rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>
    </nav>
  );
};

export default PhlebotomistBottomNavigation;
