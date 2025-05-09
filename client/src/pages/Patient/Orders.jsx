import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaDownload,
  FaPhone,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaSpinner,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaFlask,
  FaHourglassHalf,
  FaFileAlt,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
} from "react-icons/fa";
import BottomNavigation from "../../components/BottomNav";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData?.id) throw new Error("User not authenticated");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/user/${userData.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        toast.error(error.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusInfo = (status) => {
    // Define all possible steps grouped by sector
    const statusSectors = {
      collection: {
        icon: <FaClock />,
        label: "Sample Collection",
        subStatuses: [
          {
            key: "pending",
            label: "Test Pending",
            description: "Test has been scheduled and is awaiting collection.",
          },
          {
            key: "collected",
            label: "Sample Collected",
            description: "Sample collected successfully.",
          },
        ],
      },
      transit: {
        icon: <FaTruck />,
        label: "Sample Transit",
        subStatuses: [
          {
            key: "transit",
            label: "Delivering to Lab",
            description: "Sample is being transported to the lab.",
          },
        ],
      },
      processing: {
        icon: <FaFlask />,
        label: "Lab Processing",
        subStatuses: [
          {
            key: "in-lab",
            label: "Sample Received",
            description:
              "Sample has arrived at the lab and is being processed.",
          },
          {
            key: "processing",
            label: "Analysis in Progress",
            description: "Sample is undergoing analysis in the lab.",
          },
        ],
      },
      reporting: {
        icon: <FaFileAlt />,
        label: "Report Generation",
        subStatuses: [
          {
            key: "report-pending",
            label: "Report Pending",
            description: "Analysis complete, report is being finalized.",
          },
          {
            key: "report-ready",
            label: "Report Ready",
            description: "Your report is ready for download.",
          },
        ],
      },
    };

    // Determine which sector to show based on current status
    let activeSector = null;
    let activeSubStatus = null;

    if (status === "pending" || status === "collected") {
      activeSector = "collection";
      activeSubStatus = status;
    } else if (status === "transit") {
      activeSector = "transit";
      activeSubStatus = status;
    } else if (status === "in-lab" || status === "processing") {
      activeSector = "processing";
      activeSubStatus = status;
    } else if (status === "report-pending" || status === "report-ready") {
      activeSector = "reporting";
      activeSubStatus = status;
    } else if (status === "completed") {
      // For completed orders, show all sectors as completed
      activeSector = "reporting";
      activeSubStatus = "report-ready";
    } else if (status === "cancelled") {
      return {
        sectorIcon: <FaExclamationTriangle />,
        sectorLabel: "Order Cancelled",
        label: "Cancelled",
        description: "This order has been cancelled.",
      };
    }

    // Get the active sector data
    const sector = statusSectors[activeSector] || statusSectors.collection;

    // Find the active substatus within the sector
    const activeSubStatusData =
      sector.subStatuses.find(
        (sub) => sub.key === (activeSubStatus || "pending")
      ) || sector.subStatuses[0];

    return {
      sectorIcon: sector.icon,
      sectorLabel: sector.label,
      ...activeSubStatusData,
    };
  };

  const downloadReport = (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    if (order?.reportUrl) {
      window.open(order.reportUrl, "_blank");
    } else {
      toast.info("Report not available yet");
    }
  };

  const contactSupport = () => {
    window.location.href = "tel:+18001234567";
  };

  const filteredOrders = orders
    .filter((order) =>
      activeTab === "completed"
        ? order.status === "completed"
        : order.status !== "completed"
    )
    .filter((order) =>
      order.test.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString.replace(/([0-9]{1,2}):([0-9]{2})/, (match, hh, mm) => {
      const hour = parseInt(hh, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${mm} ${ampm}`;
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="page-header">
        <h1 className="page-title">My Test Orders</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="toggle-container">
        <div className="toggle-wrapper">
          <input
            type="radio"
            id="recent"
            name="orderFilter"
            checked={activeTab === "recent"}
            onChange={() => setActiveTab("recent")}
          />
          <label
            htmlFor="recent"
            className={`toggle-option ${
              activeTab === "recent" ? "active" : ""
            }`}
          >
            <span className="toggle-label">Recent</span>
            {activeTab === "recent" && <div className="active-indicator"></div>}
          </label>

          <input
            type="radio"
            id="completed"
            name="orderFilter"
            checked={activeTab === "completed"}
            onChange={() => setActiveTab("completed")}
          />
          <label
            htmlFor="completed"
            className={`toggle-option ${
              activeTab === "completed" ? "active" : ""
            }`}
          >
            <span className="toggle-label">Completed</span>
            {activeTab === "completed" && (
              <div className="active-indicator"></div>
            )}
          </label>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            {activeTab === "completed" ? (
              <FaCheckCircle />
            ) : (
              <FaExclamationTriangle />
            )}
          </div>
          <h3>
            {activeTab === "completed"
              ? "No Completed Orders Found"
              : "No Recent Orders Found"}
          </h3>
          <p>
            {activeTab === "completed"
              ? "You don't have any completed test orders yet."
              : "You don't have any recent test orders."}
          </p>
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div key={order._id} className={`order-card ${order.status}`}>
                <div className="card-header">
                  <div className="test-info">
                    <h2 className="test-name">{order.test.name}</h2>
                    <div className="order-meta">
                      <p className="collection-type">
                        <FaMapMarkerAlt />{" "}
                        {order.appointment.collectionType || "Lab Visit"}
                      </p>
                      <p className="order-id">Order #{order._id.slice(-6)}</p>
                    </div>
                  </div>
                  <span className={`status-badge ${order.status}`}>
                    {order.status === "completed"
                      ? "Completed"
                      : order.status === "cancelled"
                      ? "Cancelled"
                      : order.status === "in-lab" ||
                        order.status === "processing"
                      ? "In Progress"
                      : "Pending"}
                  </span>
                </div>

                <div className="order-details-grid">
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <div>
                      <p className="detail-label">Booked Date</p>
                      <p className="detail-value">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="detail-item">
                    {order.status === "completed" ? (
                      <>
                        <FaCheckCircle className="detail-icon" />
                        <div>
                          <p className="detail-label">Completed Date</p>
                          <p className="detail-value">
                            {order.completedAt
                              ? formatDate(order.completedAt)
                              : "N/A"}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <FaFlask className="detail-icon" />
                        <div>
                          <p className="detail-label">
                            {order.status === "in-lab" ||
                            order.status === "processing"
                              ? "Estimated Completion"
                              : "Scheduled Date"}
                          </p>
                          <p className="detail-value">
                            {order.appointment.preferredDate
                              ? formatDate(order.appointment.preferredDate)
                              : "N/A"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="detail-item">
                    <FaClock className="detail-icon" />
                    <div>
                      <p className="detail-label">
                        {order.status === "completed"
                          ? "Collection Time"
                          : "Scheduled Time"}
                      </p>
                      <p className="detail-value">
                        {formatTime(order.appointment.preferredTime)}
                      </p>
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <div className="notes-section">
                    <p className="notes-label">
                      <FaInfoCircle /> Important Notes:
                    </p>
                    <p className="notes-text">{order.notes}</p>
                  </div>
                )}
                <div className="order-status-section-modern">
                  <h3 className="section-heading">📊 Test Status Overview</h3>
                  <div className="status-card">
                    <div className="sector-icon-box">
                      {React.cloneElement(statusInfo.sectorIcon, {
                        className: "modern-sector-icon",
                      })}
                      <span className="modern-sector-label">
                        {statusInfo.sectorLabel}
                      </span>
                    </div>
                    <div className="modern-status-details">
                      <div className="modern-status-badge">
                        {statusInfo.label}
                      </div>
                      <p className="modern-status-description">
                        {statusInfo.description}
                      </p>
                    </div>
                  </div>
                </div>

                {expandedOrder === order._id && (
                  <div className="additional-details">
                    <h4>Test Details</h4>
                    <div className="details-grid">
                      <div>
                        <p className="detail-label">Preparation</p>
                        <p>
                          {order.test.preparation || "No special preparation"}
                        </p>
                      </div>
                      <div>
                        <p className="detail-label">Duration</p>
                        <p>{order.test.turnaroundTime || "N/A"}</p>
                      </div>
                      <div>
                        <p className="detail-label">Specialist</p>
                        <p>{order.test.specialist || "General Practitioner"}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="action-buttons">
                  <button
                    className="action-button details"
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    {expandedOrder === order._id ? (
                      <>
                        <FaChevronUp /> Hide Details
                      </>
                    ) : (
                      <>
                        <FaChevronDown /> View Details
                      </>
                    )}
                  </button>

                  {order.status === "completed" ? (
                    <button
                      className="action-button download"
                      onClick={() => downloadReport(order._id)}
                    >
                      <FaDownload /> Download Report
                    </button>
                  ) : order.status === "cancelled" ? (
                    <button
                      className="action-button contact"
                      onClick={contactSupport}
                    >
                      <FaPhone /> Contact Support
                    </button>
                  ) : (
                    <button
                      className="action-button contact"
                      onClick={contactSupport}
                    >
                      <FaPhone /> Contact Support
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <BottomNavigation />

      <style jsx="true">{`
        /* Color Variables */
        :root {
          --primary-color: #6a0dad;
          --primary-light: #f3e5ff;
          --secondary-color: #4a148c;
          --success-color: #2e7d32;
          --warning-color: #ed6c02;
          --error-color: #d32f2f;
          --text-dark: #2d3748;
          --text-medium: #4a5568;
          --text-light: #718096;
          --border-radius: 12px;
          --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --card-shadow: 0 2px 8px rgba(106, 13, 173, 0.08);
        }

        /* Base Styles */
        .orders-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          padding-bottom: 100px;
          font-family: "Outfit", sans-serif;
        }

        .page-header {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 25px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          color: var(--primary-color);
          text-align: center;
        }

        /* Search Bar */
        .search-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        .search-input {
          width: 100%;
          padding: 12px 20px;
          border: 1px solid #e2e8f0;
          border-radius: 30px;
          font-size: 16px;
          background-color: white;
          box-shadow: var(--box-shadow);
          transition: var(--transition);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23718096' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: 15px center;
          background-size: 20px;
          padding-left: 45px;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(106, 13, 173, 0.1);
        }

        /* Enhanced Toggle Styles */
        .toggle-container {
          display: flex;
          justify-content: center;
          margin: 0 auto 30px;
          position: relative;
        }

        .toggle-wrapper {
          display: flex;
          position: relative;
          background: var(--bg-light);
          border-radius: 50px;
          padding: 6px;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
          border: 1px solid #e5e7eb;
          background-clip: padding-box;
        }

        .toggle-wrapper input[type="radio"] {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-option {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          border-radius: 50px;
          cursor: pointer;
          transition: var(--transition);
          z-index: 1;
          min-width: 150px;
          color: var(--text-medium);
          font-weight: 600;
          font-size: 15px;
        }

        .toggle-option:hover {
          color: var(--primary-color);
          background: rgba(124, 58, 237, 0.05);
        }

        .toggle-option.active {
          color: white;
          background-color: #5e0d97;
        }

        .toggle-icon {
          margin-right: 8px;
          display: flex;
          align-items: center;
        }

        .toggle-option.active .toggle-icon {
          color: white;
        }

        .toggle-bg {
          position: absolute;
          top: 6px;
          left: 6px;
          height: calc(100% - 12px);
          width: calc(50% - 6px);
          background: linear-gradient(
            135deg,
            var(--primary-color),
            var(--secondary-color)
          );
          border-radius: 50px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(${activeTab === "recent" ? "0" : "100%"});
          box-shadow: 0 4px 6px rgba(124, 58, 237, 0.2);
          z-index: 0;
        }

        .active-indicator {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 3px;
          background: white;
          border-radius: 3px;
          opacity: 0.8;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .toggle-option {
            min-width: 120px;
            padding: 10px 16px;
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .toggle-wrapper {
            width: 100%;
          }

          .toggle-option {
            flex: 1;
            min-width: auto;
            padding: 10px 12px;
          }
        }
        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          background-color: #f9f9ff;
          border-radius: var(--border-radius);
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .empty-icon {
          font-size: 48px;
          color: var(--primary-color);
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .empty-state h3 {
          font-size: 22px;
          color: var(--text-dark);
          margin: 0 0 10px 0;
        }

        .empty-state p {
          color: var(--text-medium);
          margin-bottom: 20px;
          max-width: 400px;
        }

        .clear-search {
          background: none;
          border: none;
          color: var(--primary-color);
          font-weight: 600;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 20px;
          transition: var(--transition);
        }

        .clear-search:hover {
          background-color: var(--primary-light);
        }

        /* Order List */
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        /* Order Card */
        .order-card {
          background: white;
          padding: 25px;
          border-radius: var(--border-radius);
          box-shadow: var(--card-shadow);
          transition: var(--transition);
          border-left: 4px solid var(--primary-color);
          position: relative;
          overflow: hidden;
        }

        .order-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(106, 13, 173, 0.1);
        }

        .order-card.completed {
          border-left-color: var(--success-color);
        }

        .order-card.in-lab {
          border-left-color: var(--primary-color);
        }

        .order-card.pending {
          border-left-color: var(--warning-color);
        }

        /* Card Header */
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          gap: 15px;
        }

        .test-info {
          flex: 1;
        }

        .test-name {
          font-size: 22px;
          font-weight: 600;
          color: var(--text-dark);
          margin: 0 0 5px 0;
        }

        .order-meta {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .collection-type {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: var(--text-medium);
          margin: 0;
        }

        .order-id {
          font-size: 13px;
          color: var(--text-light);
          background: #f5f5f5;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .collection-type svg {
          color: var(--primary-color);
        }

        /* Status Badge */
        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-badge.completed {
          background-color: #e6f7ee;
          color: var(--success-color);
        }

        .status-badge.in-lab {
          background-color: var(--primary-light);
          color: var(--primary-color);
        }

        .status-badge.pending {
          background-color: #fff4e6;
          color: var(--warning-color);
        }

        /* Order Details Grid */
        .order-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .detail-icon {
          color: var(--primary-color);
          margin-top: 3px;
          flex-shrink: 0;
        }

        .detail-label {
          font-size: 14px;
          color: var(--text-light);
          margin: 0 0 4px 0;
        }

        .detail-value {
          font-size: 16px;
          font-weight: 500;
          color: var(--text-dark);
          margin: 0;
        }

        /* Notes Section */
        .notes-section {
          background-color: #f8f5ff;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
          border-left: 3px solid var(--primary-color);
        }

        .notes-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--primary-color);
          margin: 0 0 8px 0;
          font-size: 15px;
        }

        .notes-text {
          color: var(--text-medium);
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
        }

        /* Order Status Section */
        .order-status-section {
          margin-top: 25px;
        }

        .order-status-section h3 {
          font-size: 18px;
          color: var(--text-dark);
          margin-bottom: 15px;
        }

        .progress-tracker {
          display: flex;
          align-items: flex-start;
          margin: 20px 0;
          position: relative;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 100px;
          position: relative;
          z-index: 1;
        }

        .step-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 2px solid #eee;
          border-radius: 50%;
          margin-bottom: 8px;
          transition: var(--transition);
        }

        .step.active .step-icon {
          border-color: var(--primary-color);
          background: var(--primary-light);
        }

        .step-icon svg {
          color: #bbb;
          transition: var(--transition);
        }

        .step.active .step-icon svg {
          color: var(--primary-color);
        }

        .step-info {
          text-align: center;
        }

        .step-label {
          font-size: 14px;
          font-weight: 500;
          display: block;
          color: #bbb;
          transition: var(--transition);
        }

        .step.active .step-label {
          color: var(--text-dark);
          font-weight: 600;
        }

        .step-description {
          font-size: 12px;
          color: #bbb;
          margin-top: 4px;
          display: block;
          transition: var(--transition);
        }

        .step.active .step-description {
          color: var(--text-medium);
        }

        .connector {
          flex: 1;
          height: 2px;
          background-color: #eee;
          margin: 20px 5px 0;
          transition: var(--transition);
        }

        .active-connector {
          background: linear-gradient(90deg, var(--primary-color), #c97bff);
        }

        /* Additional Details */
        .additional-details {
          background: #f9f9ff;
          padding: 15px;
          border-radius: var(--border-radius);
          margin: 15px 0;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .additional-details h4 {
          margin: 0 0 15px 0;
          color: var(--primary-color);
          font-size: 16px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 15px;
        }

        .details-grid div {
          background: white;
          padding: 12px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .details-grid .detail-label {
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--primary-color);
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 25px;
        }

        .action-button {
          padding: 12px 16px;
          border-radius: var(--border-radius);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: var(--transition);
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          justify-content: center;
        }

        .action-button.download {
          background-color: var(--primary-color);
          color: white;
        }

        .action-button.download:hover {
          background-color: var(--secondary-color);
          transform: translateY(-2px);
        }

        .action-button.contact {
          background-color: var(--primary-light);
          color: var(--primary-color);
        }

        .action-button.contact:hover {
          background-color: #e0ccff;
          transform: translateY(-2px);
        }

        .action-button.details {
          background-color: white;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
        }

        .action-button.details:hover {
          background-color: var(--primary-light);
          transform: translateY(-2px);
        }

        /* Loading State */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          color: var(--primary-color);
        }

        .spinner {
          font-size: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .order-details-grid {
            grid-template-columns: 1fr 1fr;
          }

          .progress-tracker {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .step {
            flex-direction: row;
            align-items: center;
            min-width: auto;
            width: 100%;
            gap: 15px;
          }

          .step-icon {
            margin-bottom: 0;
          }

          .step-info {
            text-align: left;
          }

          .connector {
            width: 2px;
            height: 20px;
            margin: 5px 0 5px 19px;
          }

          .action-buttons {
            flex-direction: column;
          }

          .toggle-option {
            min-width: 120px;
            padding: 10px 16px;
            font-size: 14px;
          }

          .toggle-icon {
            margin-right: 6px;
          }

          .page-header {
            gap: 15px;
          }

          .order-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }

        @media (max-width: 480px) {
          .order-card {
            padding: 18px;
          }

          .page-title {
            font-size: 24px;
          }

          .test-name {
            font-size: 20px;
          }

          .order-details-grid {
            grid-template-columns: 1fr;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .toggle-wrapper {
            width: 100%;
          }

          .toggle-option {
            flex: 1;
            min-width: auto;
            padding: 10px 12px;
          }

          .toggle-icon {
            display: none;
          }

          .action-button {
            padding: 10px 12px;
            font-size: 13px;
          }

          .search-input {
            padding: 10px 15px 10px 40px;
            background-position: 12px center;
          }
        }
        .order-status-section-modern {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: linear-gradient(to right, #f7f9fc, #eef1f8);
          border-radius: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease-in-out;
        }

        .section-heading {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.25rem;
          background: white;
          border-radius: 0.875rem;
          border: 1px solid #e0e7ff;
          transition: transform 0.2s ease-in-out;
          flex-wrap: wrap; /* for better wrapping on smaller screens */
        }

        .status-card:hover {
          transform: translateY(-2px);
        }

        .sector-icon-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 90px;
          text-align: center;
          flex-shrink: 0;
        }

        .modern-sector-icon {
          font-size: 2.2rem;
          color: #6a0dad;
          background: #e0ecff;
          padding: 0.6rem;
          border-radius: 50%;
          margin-bottom: 0.5rem;
        }

        .modern-sector-label {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }

        .modern-status-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 200px;
        }

        .modern-status-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: linear-gradient(to right, #6a0dad, #6366f1);
          color: #fff;
          border-radius: 9999px;
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          box-shadow: 0 3px 8px rgba(99, 102, 241, 0.2);
          width: fit-content;
        }

        .modern-status-description {
          font-size: 0.95rem;
          color: #334155;
          line-height: 1.5;
        }

        /* RESPONSIVE BREAKPOINTS */

        @media (max-width: 768px) {
          .status-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .sector-icon-box {
            flex-direction: row;
            gap: 0.75rem;
            align-items: center;
            justify-content: flex-start;
            min-width: auto;
          }

          .modern-sector-label {
            font-size: 0.9rem;
            text-align: left;
            margin: 0;
          }

          .modern-sector-icon {
            font-size: 2rem;
            padding: 0.5rem;
          }

          .modern-status-badge {
            font-size: 0.85rem;
            padding: 0.4rem 0.9rem;
          }

          .modern-status-description {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .section-heading {
            font-size: 1.1rem;
          }

          .order-status-section-modern {
            padding: 1rem;
          }

          .status-card {
            padding: 1rem;
          }

          .modern-sector-icon {
            font-size: 1.8rem;
          }

          .modern-status-badge {
            font-size: 0.8rem;
            padding: 0.3rem 0.8rem;
          }

          .modern-status-description {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;
