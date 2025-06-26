import React, { useState } from "react";
import MobileHospitalNav from "../../components/MobileHospitalNav";

const Dashboard = () => {
  const [emergencies, setEmergencies] = useState([
    {
      id: 1,
      patientName: "Rahul Sharma",
      location: "19.0760,72.8777",
      address: "Andheri East, Mumbai 400069",
      emergencyType: "Cardiac Arrest",
      priority: "Critical",
      time: "2 mins ago",
      status: "pending",
      vitalSigns: "BP: 190/110, Pulse: 120",
      notes: "Patient unconscious, family on scene",
      estimatedArrival: "5-7 mins",
    },
    {
      id: 2,
      patientName: "Priya Patel",
      location: "18.5204,73.8567",
      address: "Kothrud, Pune 411038",
      emergencyType: "Road Accident",
      priority: "Moderate",
      time: "15 mins ago",
      status: "pending",
      vitalSigns: "BP: 130/85, Pulse: 90",
      notes: "Frontal collision, airbags deployed",
      estimatedArrival: "12-15 mins",
    },
    {
      id: 3,
      patientName: "Amit Singh",
      location: "12.9716,77.5946",
      address: "Koramangala, Bengaluru 560034",
      emergencyType: "Diabetic Emergency",
      priority: "Low",
      time: "25 mins ago",
      status: "pending",
      vitalSigns: "BP: 100/60, Glucose: 45",
      notes: "Known diabetic, last ate 6 hours ago",
      estimatedArrival: "18-20 mins",
    },
  ]);

  const [activeTab, setActiveTab] = useState("active");
  const [expandedCard, setExpandedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAcknowledge = (id) => {
    setEmergencies(
      emergencies.map((emergency) =>
        emergency.id === id
          ? {
              ...emergency,
              status: "acknowledged",
              time: "Dispatched just now",
            }
          : emergency
      )
    );
  };

  const openGoogleMaps = (location, address) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${location}&destination_place_id=${encodeURIComponent(
        address
      )}&travelmode=driving`
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return {
          bg: "critical-bg",
          text: "critical-text",
          border: "critical-border",
          icon: "❤️",
        };
      case "Moderate":
        return {
          bg: "moderate-bg",
          text: "moderate-text",
          border: "moderate-border",
          icon: "🚗",
        };
      case "Low":
        return {
          bg: "low-bg",
          text: "low-text",
          border: "low-border",
          icon: "🩸",
        };
      default:
        return {
          bg: "default-bg",
          text: "default-text",
          border: "default-border",
          icon: "⚠️",
        };
    }
  };

  const filteredEmergencies = emergencies.filter((emergency) => {
    if (activeTab === "active" && emergency.status !== "pending") return false;
    if (activeTab === "acknowledged" && emergency.status !== "acknowledged")
      return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        emergency.patientName.toLowerCase().includes(query) ||
        emergency.address.toLowerCase().includes(query) ||
        emergency.emergencyType.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const toggleExpandCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <>
      <MobileHospitalNav />
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Emergency Dispatch Dashboard</h1>
              <p>Real-time emergency alerts and management</p>
            </div>

            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="stats-container">
            <div className="stat-card critical-stat">
              <div className="stat-count">
                {
                  emergencies.filter(
                    (e) => e.priority === "Critical" && e.status === "pending"
                  ).length
                }
              </div>
              <div className="stat-label">Critical</div>
            </div>
            <div className="stat-card moderate-stat">
              <div className="stat-count">
                {
                  emergencies.filter(
                    (e) => e.priority === "Moderate" && e.status === "pending"
                  ).length
                }
              </div>
              <div className="stat-label">Moderate</div>
            </div>
            <div className="stat-card low-stat">
              <div className="stat-count">
                {
                  emergencies.filter(
                    (e) => e.priority === "Low" && e.status === "pending"
                  ).length
                }
              </div>
              <div className="stat-label">Low Priority</div>
            </div>
          </div>

          <div className="tabs">
            <button
              className={`tab ${activeTab === "active" ? "active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              Active Alerts
            </button>
            <button
              className={`tab ${activeTab === "acknowledged" ? "active" : ""}`}
              onClick={() => setActiveTab("acknowledged")}
            >
              Dispatched
            </button>
          </div>
        </div>

        <div className="emergency-list">
          {filteredEmergencies.length > 0 ? (
            filteredEmergencies.map((emergency) => {
              const priorityColors = getPriorityColor(emergency.priority);
              return (
                <div
                  key={emergency.id}
                  className={`emergency-card ${priorityColors.bg} ${priorityColors.border} ${emergency.status}`}
                  onClick={() => toggleExpandCard(emergency.id)}
                >
                  <div className="card-header">
                    <div className="patient-info">
                      <div className="name-and-badge">
                        <h2>{emergency.patientName}</h2>
                        <span
                          className={`priority-badge ${priorityColors.text}`}
                        >
                          {priorityColors.icon} {emergency.priority}
                        </span>
                      </div>
                      <div className="time-ago">
                        <svg className="clock-icon" viewBox="0 0 24 24">
                          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {emergency.time}
                      </div>
                    </div>
                    <div className="emergency-type">
                      {emergency.emergencyType}
                    </div>
                  </div>

                  {expandedCard === emergency.id && (
                    <div className="card-body">
                      <div className="location-info">
                        <div className="address-section">
                          <h3>
                            <svg className="map-icon" viewBox="0 0 24 24">
                              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Location:
                          </h3>
                          <p className="address">{emergency.address}</p>
                          <p className="eta">
                            ETA: {emergency.estimatedArrival}
                          </p>
                        </div>
                        <div className="map-preview">
                          <iframe
                            width="100%"
                            height="200"
                            frameBorder="0"
                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCyuT-iBobF8yIYhECIqGzoQDTh6rWN_HM&q=${emergency.location}&zoom=15`}
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>

                      <div className="medical-info">
                        <div className="vital-signs">
                          <h3>Vital Signs:</h3>
                          <p>{emergency.vitalSigns}</p>
                        </div>
                        <div className="notes">
                          <h3>Additional Notes:</h3>
                          <p>{emergency.notes}</p>
                        </div>
                      </div>

                      <div className="card-actions">
                        <button
                          className="nav-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openGoogleMaps(
                              emergency.location,
                              emergency.address
                            );
                          }}
                        >
                          <svg className="nav-icon" viewBox="0 0 24 24">
                            <path d="M9 21.5l7.5-7.5 3 3L12 24.5l-9-9 3-3L9 21.5zm0-21l7.5 7.5 3-3L12-2.5l-9 9 3 3L9 .5z" />
                          </svg>
                          Start Navigation
                        </button>
                        {emergency.status === "pending" && (
                          <button
                            className="acknowledge-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcknowledge(emergency.id);
                            }}
                          >
                            <svg className="check-icon" viewBox="0 0 24 24">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                            Acknowledge & Dispatch
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-alerts">
              <div className="no-alerts-icon">⚠️</div>
              <p>
                No {activeTab === "active" ? "active" : "dispatched"} alerts
                found
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        /* Base Styles */
        .dashboard {
          padding: 24px 24px 156px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #f8fafc;
          min-height: 100vh;
        }

        /* Header Styles */
        .dashboard-header {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          margin-bottom: 24px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-text h1 {
          font-size: 28px;
          color: #1e293b;
          margin: 0;
          font-weight: 600;
          line-height: 1.2;
        }

        .header-text p {
          color: #64748b;
          margin: 8px 0 0;
          font-size: 16px;
        }

        /* Search Styles */
        .search-container {
          position: relative;
          width: 100%;
          max-width: 320px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          stroke: #94a3b8;
        }

        .search-container input {
          width: 100%;
          padding: 12px 16px 12px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.2s;
          background-color: #f8fafc;
        }

        .search-container input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
          background-color: white;
        }

        /* Stats Styles */
        .stats-container {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .stat-card {
          flex: 1;
          min-width: 160px;
          padding: 16px;
          border-radius: 12px;
          border-left: 4px solid;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .critical-stat {
          border-left-color: #ef4444;
          background: linear-gradient(to right, #fee2e2, #fef2f2);
        }

        .moderate-stat {
          border-left-color: #f59e0b;
          background: linear-gradient(to right, #fef3c7, #fef9e7);
        }

        .low-stat {
          border-left-color: #10b981;
          background: linear-gradient(to right, #d1fae5, #ecfdf5);
        }

        .stat-count {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .critical-stat .stat-count {
          color: #ef4444;
        }

        .moderate-stat .stat-count {
          color: #f59e0b;
        }

        .low-stat .stat-count {
          color: #10b981;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
        }

        /* Tab Styles */
        .tabs {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
        }

        .tab {
          padding: 12px 24px;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          color: #64748b;
          position: relative;
          transition: all 0.2s;
          font-size: 14px;
        }

        .tab.active {
          color: #3b82f6;
        }

        .tab.active::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #3b82f6;
        }

        /* Emergency Card Styles */
        .emergency-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .emergency-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          border-left: 6px solid;
          cursor: pointer;
          transition: all 0.2s;
        }

        .emergency-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .critical-bg {
          background: linear-gradient(to right, #fee2e2, #fef2f2);
        }

        .moderate-bg {
          background: linear-gradient(to right, #fef3c7, #fef9e7);
        }

        .low-bg {
          background: linear-gradient(to right, #d1fae5, #ecfdf5);
        }

        .critical-border {
          border-left-color: #ef4444;
        }

        .moderate-border {
          border-left-color: #f59e0b;
        }

        .low-border {
          border-left-color: #10b981;
        }

        .critical-text {
          color: #ef4444;
        }

        .moderate-text {
          color: #f59e0b;
        }

        .low-text {
          color: #10b981;
        }

        .emergency-card.acknowledged {
          opacity: 0.8;
          border-left-color: #10b981 !important;
          background: linear-gradient(to right, #ecfdf5, #f0fdfa);
        }

        .card-header {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .patient-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          min-width: 200px;
        }

        .name-and-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .patient-info h2 {
          font-size: 18px;
          margin: 0;
          color: #1e293b;
          font-weight: 600;
        }

        .priority-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .time-ago {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 14px;
        }

        .clock-icon {
          width: 16px;
          height: 16px;
          stroke: #94a3b8;
        }

        .emergency-type {
          font-size: 16px;
          font-weight: 500;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Card Body Styles */
        .card-body {
          padding: 0 20px 20px;
          border-top: 1px dashed #e2e8f0;
          margin-top: 8px;
          padding-top: 20px;
        }

        .location-info {
          margin-bottom: 20px;
        }

        .address-section {
          margin-bottom: 16px;
        }

        .address-section h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          color: #475569;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .map-icon {
          width: 18px;
          height: 18px;
          stroke: #94a3b8;
        }

        .address {
          color: #475569;
          margin-bottom: 4px;
          font-size: 15px;
          line-height: 1.5;
        }

        .eta {
          color: #64748b;
          font-size: 14px;
          font-style: italic;
        }

        .map-preview {
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .medical-info {
          display: flex;
          gap: 24px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .vital-signs,
        .notes {
          flex: 1;
          min-width: 250px;
        }

        .vital-signs h3,
        .notes h3 {
          font-size: 16px;
          color: #475569;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .vital-signs p,
        .notes p {
          color: #475569;
          font-size: 15px;
          line-height: 1.5;
        }

        /* Action Button Styles */
        .card-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .nav-button,
        .acknowledge-button {
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          flex: 1;
          min-width: 200px;
          justify-content: center;
        }

        .nav-icon,
        .check-icon {
          width: 18px;
          height: 18px;
          stroke: white;
        }

        .nav-button {
          background: linear-gradient(to right, #3b82f6, #2563eb);
          color: white;
        }

        .nav-button:hover {
          background: linear-gradient(to right, #2563eb, #1d4ed8);
          transform: translateY(-1px);
        }

        .acknowledge-button {
          background: linear-gradient(to right, #10b981, #059669);
          color: white;
        }

        .acknowledge-button:hover {
          background: linear-gradient(to right, #059669, #047857);
          transform: translateY(-1px);
        }

        /* No Alerts Styles */
        .no-alerts {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          text-align: center;
        }

        .no-alerts-icon {
          font-size: 48px;
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .no-alerts p {
          color: #64748b;
          font-size: 18px;
          max-width: 400px;
          line-height: 1.5;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .dashboard {
            padding: 16px 16px 134px;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .search-container {
            max-width: 100%;
          }

          .stats-container {
            flex-direction: column;
          }

          .stat-card {
            width: 100%;
          }

          .medical-info {
            flex-direction: column;
            gap: 16px;
          }

          .vital-signs,
          .notes {
            min-width: 100%;
          }

          .card-actions {
            flex-direction: column;
          }

          .nav-button,
          .acknowledge-button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default Dashboard;
