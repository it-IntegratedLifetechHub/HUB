import React, { useState, useEffect } from "react";
import {
  FaMapMarkedAlt,
  FaUserPlus,
  FaProcedures,
  FaHospital,
  FaUserCircle,
} from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MobileHospitalNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [hasNotifications, setHasNotifications] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulated notification toggle logic
      setHasNotifications(Math.random() > 0.5);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      path: "/mobile-hospital/dashboard",
      icon: <FaMapMarkedAlt size={20} />,
      label: "Alerts",
      color: "#6a0dad",
    },
    {
      path: "/mobile-hospital/patients",
      icon: <FaProcedures size={20} />,
      label: "Patients",
      color: "#1e88e5",
    },
    {
      path: "/mobile-hospital/hospitals",
      icon: <FaHospital size={20} />,
      label: "Hospitals",
      color: "#43a047",
    },

    {
      path: "/mobile-hospital/profile",
      icon: <FaUserCircle size={20} />,
      label: "Profile",
      color: "#ff8f00",
    },
  ];

  return (
    <div className="floating-nav-container">
      <nav className="phlebotomist-bottom-navigation">
        {navItems.map((item) => {
          const isActive = currentPath.startsWith(item.path);

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
                <div className="nav-icon">{item.icon}</div>
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

      {/* Embedded styles for quick styling */}
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
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 15px 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(0, 0, 0, 0.05);
          max-width: 500px;
          width: 100%;
          backdrop-filter: blur(10px);
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
          color: var(--active-color, #6a0dad);
        }

        .nav-item.active {
          color: var(--active-color, #6a0dad);
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

export default MobileHospitalNav;
