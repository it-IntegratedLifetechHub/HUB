import React, { useState, useEffect } from "react";
import { FaTasks, FaUserCircle, FaChartLine, FaBell } from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PhlebotomistBottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [hasNotifications, setHasNotifications] = useState(true);
  const [activeHover, setActiveHover] = useState(null);

  // Simulate dynamic notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setHasNotifications((prev) => Math.random() > 0.5);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      path: "/phlebotomist/dashboard",
      icon: <FaChartLine size={20} />,
      label: "Dashboard",
      exact: true,
      color: "#5e0d97",
    },
    {
      path: "/phlebotomist/task",
      icon: <FaTasks size={20} />,
      label: "Tasks",
      badge: 3,
      color: "#17a2b8",
    },
    {
      path: "/phlebotomist/notifications",
      icon: <FaBell size={20} />,
      label: "Alerts",
      color: "#ff4757",
      notification: hasNotifications,
    },
    {
      path: "/phlebotomist/profile",
      icon: <FaUserCircle size={20} />,
      label: "Profile",
      color: "#ff8f00",
    },
  ];

  return (
    <div className="floating-nav-container">
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
              onMouseEnter={() => setActiveHover(item.path)}
              onMouseLeave={() => setActiveHover(null)}
              style={isActive ? { "--active-color": item.color } : {}}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="nav-icon-container">
                <AnimatePresence>
                  {(isActive || activeHover === item.path) && (
                    <motion.div
                      className="nav-background"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                </AnimatePresence>
                <div className="nav-icon">
                  {item.notification ? (
                    <div className="notification-wrapper">
                      {item.icon}
                      <span className="notification-badge" />
                    </div>
                  ) : item.badge ? (
                    <div className="badge-wrapper">
                      {item.icon}
                      <motion.span
                        className="task-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        {item.badge}
                      </motion.span>
                    </div>
                  ) : (
                    item.icon
                  )}
                </div>
              </div>
              <motion.span
                className="nav-label"
                initial={{ y: 0 }}
                animate={{
                  y: isActive ? -5 : 0,
                  color: isActive ? item.color : "#666",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {item.label}
              </motion.span>

              {isActive && (
                <motion.div
                  className="active-indicator"
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 0.3 }}
                  style={{ backgroundColor: item.color }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <style jsx>{`
        .floating-nav-container {
          position: fixed;
          bottom: 25px;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 1000;
          padding: 0 25px;
          box-sizing: border-box;
        }

        .phlebotomist-bottom-navigation {
          background-color: #ffffff;
          border-radius: 50px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 15px 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(0, 0, 0, 0.05);
          max-width: 500px;
          width: 100%;
          position: relative;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
          color: #666;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          flex: 1;
          padding: 5px 0;
          z-index: 1;
          gap: 8px;
        }

        .nav-item:hover {
          color: var(--active-color, #5e0d97);
        }

        .nav-item.active {
          color: var(--active-color, #5e0d97);
        }

        .nav-icon-container {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-background {
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          opacity: 0.15;
        }

        .nav-icon {
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .nav-item.active .nav-icon {
          transform: translateY(-5px) scale(1.1);
        }

        .nav-label {
          font-size: 12px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .active-indicator {
          position: absolute;
          bottom: 0;
          width: 60%;
          height: 3px;
          border-radius: 3px;
        }

        .notification-wrapper,
        .badge-wrapper {
          position: relative;
          display: flex;
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
          box-shadow: 0 0 5px rgba(255, 71, 87, 0.5);
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
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .floating-nav-container {
            bottom: 15px;
            padding: 0 20px;
          }

          .phlebotomist-bottom-navigation {
            padding: 12px 0;
            border-radius: 40px;
          }

          .nav-icon-container {
            width: 36px;
            height: 36px;
          }

          .nav-label {
            font-size: 11px;
          }
        }

        @media (max-width: 350px) {
          .floating-nav-container {
            padding: 0 15px;
          }

          .nav-label {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default PhlebotomistBottomNavigation;
