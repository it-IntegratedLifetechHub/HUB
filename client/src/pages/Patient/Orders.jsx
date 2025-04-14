import React, { useState } from "react";
import {
  FaCheckCircle,
  FaFlask,
  FaFileAlt,
  FaCalendarAlt,
  FaClock,
  FaDownload,
  FaPhone,
  FaInfoCircle,
  FaUserNurse,
  FaMapMarkerAlt,
} from "react-icons/fa";
import BottomNavigation from "../../components/BottomNav";

const Orders = () => {
  // Sample order data - in a real app this would come from an API
  const [orders, setOrders] = useState([
    {
      id: 1,
      testName: "Complete Blood Count (CBC)",
      bookedDate: "10 January 2025",
      status: "in-lab", // 'completed', 'in-lab', 'pending'
      estimatedCompletion: "12 January 2025",
      collectionType: "Home Collection",
      collectionTime: "9:00 AM - 11:00 AM",
      phlebotomist: {
        name: "Dr. Smith",
        id: "PHLEB-123",
        contact: "+1 (555) 123-4567",
      },
      notes: "Fasting required for 8 hours before test",
      reportUrl: "#",
      testDetails: {
        preparation: "Fasting required",
        duration: "5-10 minutes",
        risks: "Minimal (slight bruising possible)",
      },
    },
    {
      id: 2,
      testName: "Thyroid Function Test",
      bookedDate: "8 January 2025",
      status: "completed",
      completedDate: "10 January 2025",
      collectionType: "Lab Visit",
      collectionTime: "Completed at 10:30 AM",
      reportReady: true,
      reportUrl: "#",
      notes: "Report available for download",
      testDetails: {
        preparation: "No special preparation",
        duration: "5 minutes",
        risks: "Minimal",
      },
    },
    {
      id: 3,
      testName: "Lipid Profile",
      bookedDate: "12 January 2025",
      status: "pending",
      estimatedCompletion: "15 January 2025",
      collectionType: "Home Collection",
      collectionTime: "2:00 PM - 4:00 PM",
      notes: "12-hour fasting required",
      reportUrl: "#",
      testDetails: {
        preparation: "12-hour fasting",
        duration: "5 minutes",
        risks: "Minimal",
      },
    },
  ]);

  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("recent"); // 'recent' or 'completed'

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusSteps = (status) => {
    const steps = [
      {
        icon: <FaCheckCircle />,
        label: "Test Taken",
        status: "completed",
        description: "Sample collected successfully",
      },
      {
        icon: <FaFlask />,
        label: "In Lab",
        status: "in-lab",
        description: "Processing your sample",
      },
      {
        icon: <FaFileAlt />,
        label: "Report Ready",
        status: "pending",
        description: "Results being prepared",
      },
    ];

    return steps.map((step) => {
      if (status === "completed") {
        return {
          ...step,
          current: true,
          description:
            step.status === "pending"
              ? "Report available for download"
              : step.description,
        };
      } else if (status === "in-lab") {
        return {
          ...step,
          current: step.status !== "pending",
          description:
            step.status === "pending"
              ? "Estimated completion: 2-3 days"
              : step.description,
        };
      } else {
        return {
          ...step,
          current: step.status === "completed",
          description:
            step.status === "completed"
              ? "Waiting for sample collection"
              : step.description,
        };
      }
    });
  };

  const downloadReport = (orderId) => {
    // In a real app, this would trigger the download
    console.log(`Downloading report for order ${orderId}`);
    // window.location.href = orders.find(o => o.id === orderId).reportUrl;
  };

  const contactSupport = () => {
    // In a real app, this would open a chat/phone interface
    console.log("Contacting support");
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "completed") {
      return order.status === "completed";
    } else {
      return order.status !== "completed";
    }
  });

  return (
    <div className="orders-container">
      <h1 className="page-title">My Test Orders</h1>

      {/* Enhanced Toggle for Recent/Completed orders */}
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
            <span className="toggle-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
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
            <span className="toggle-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="toggle-label">Completed</span>
            {activeTab === "completed" && (
              <div className="active-indicator"></div>
            )}
          </label>

          <div className="toggle-bg"></div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <img
            src="/images/no-orders.svg"
            alt="No orders"
            className="empty-image"
          />
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
          {activeTab === "completed" && (
            <button
              className="primary-button"
              onClick={() => setActiveTab("recent")}
            >
              View Recent Orders
            </button>
          )}
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.id} className={`order-card ${order.status}`}>
              <div className="card-header">
                <div className="test-info">
                  <h2 className="test-name">{order.testName}</h2>
                  <p className="collection-type">
                    <FaMapMarkerAlt /> {order.collectionType}
                  </p>
                </div>
                <span className={`status-badge ${order.status}`}>
                  {order.status === "completed"
                    ? "Completed"
                    : order.status === "in-lab"
                    ? "In Progress"
                    : "Pending"}
                </span>
              </div>

              <div className="order-details-grid">
                <div className="detail-item">
                  <FaCalendarAlt className="detail-icon" />
                  <div>
                    <p className="detail-label">Booked Date</p>
                    <p className="detail-value">{order.bookedDate}</p>
                  </div>
                </div>

                {order.status === "completed" ? (
                  <div className="detail-item">
                    <FaCheckCircle className="detail-icon" />
                    <div>
                      <p className="detail-label">Completed Date</p>
                      <p className="detail-value">{order.completedDate}</p>
                    </div>
                  </div>
                ) : (
                  <div className="detail-item">
                    <FaFlask className="detail-icon" />
                    <div>
                      <p className="detail-label">
                        {order.status === "in-lab"
                          ? "Estimated Completion"
                          : "Scheduled Date"}
                      </p>
                      <p className="detail-value">
                        {order.estimatedCompletion || order.bookedDate}
                      </p>
                    </div>
                  </div>
                )}

                <div className="detail-item">
                  <FaClock className="detail-icon" />
                  <div>
                    <p className="detail-label">
                      {order.status === "completed"
                        ? "Collection Time"
                        : "Scheduled Time"}
                    </p>
                    <p className="detail-value">{order.collectionTime}</p>
                  </div>
                </div>

                {order.phlebotomist && (
                  <div className="detail-item">
                    <FaUserNurse className="detail-icon" />
                    <div>
                      <p className="detail-label">Phlebotomist</p>
                      <p className="detail-value">
                        {order.phlebotomist.name} ({order.phlebotomist.id})
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {order.notes && (
                <div className="notes-section">
                  <p className="notes-label">
                    <FaInfoCircle /> Important Notes:
                  </p>
                  <p className="notes-text">{order.notes}</p>
                </div>
              )}

              <div className="order-status-section">
                <h3>Test Status</h3>
                <div className="progress-tracker">
                  {getStatusSteps(order.status).map((step, index) => (
                    <React.Fragment key={index}>
                      <div className={`step ${step.current ? "active" : ""}`}>
                        <div className="step-icon">
                          {React.cloneElement(step.icon, {
                            className: step.current ? "active-icon" : "",
                          })}
                        </div>
                        <div className="step-info">
                          <span className="step-label">{step.label}</span>
                          <span className="step-description">
                            {step.description}
                          </span>
                        </div>
                      </div>
                      {index < getStatusSteps(order.status).length - 1 && (
                        <div
                          className={`connector ${
                            step.current ? "active-connector" : ""
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="additional-details">
                  <h4>Test Details</h4>
                  <div className="details-grid">
                    <div>
                      <p className="detail-label">Preparation</p>
                      <p>{order.testDetails.preparation}</p>
                    </div>
                    <div>
                      <p className="detail-label">Duration</p>
                      <p>{order.testDetails.duration}</p>
                    </div>
                    <div>
                      <p className="detail-label">Risks</p>
                      <p>{order.testDetails.risks}</p>
                    </div>
                    {order.phlebotomist?.contact && (
                      <div>
                        <p className="detail-label">Phlebotomist Contact</p>
                        <p>{order.phlebotomist.contact}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="action-buttons">
                {order.status === "completed" ? (
                  <>
                    <button
                      className="action-button download"
                      onClick={() => downloadReport(order.id)}
                    >
                      <FaDownload /> Download Report
                    </button>
                    <button
                      className="action-button details"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      {expandedOrder === order.id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="action-button details"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      {expandedOrder === order.id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                    <button
                      className="action-button contact"
                      onClick={contactSupport}
                    >
                      <FaPhone /> Contact Support
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
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
          --text-dark: #2d3748;
          --text-medium: #4a5568;
          --text-light: #718096;
          --border-radius: 12px;
          --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Base Styles */
        .orders-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          padding-bottom: 100px;
          font-family: "Outfit", sans-serif;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 25px;
          color: var(--primary-color);
          text-align: center;
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
          background: #f8f5ff;
          border-radius: 50px;
          padding: 6px;
          box-shadow: 0 2px 10px rgba(106, 13, 173, 0.1);
          border: 1px solid rgba(106, 13, 173, 0.1);
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
        }

        .toggle-option:hover {
          color: var(--primary-color);
        }

        .toggle-option.active {
          color: white;
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
          background: var(--primary-color);
          border-radius: 50px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(${activeTab === "recent" ? "0" : "100%"});
          box-shadow: 0 4px 6px rgba(106, 13, 173, 0.2);
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
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          background-color: #f9f9ff;
          border-radius: var(--border-radius);
          margin-top: 30px;
        }

        .empty-state h3 {
          font-size: 22px;
          color: var(--text-dark);
          margin: 20px 0 10px;
        }

        .empty-state p {
          color: var(--text-medium);
          margin-bottom: 20px;
        }

        .empty-image {
          width: 150px;
          height: auto;
          opacity: 0.8;
        }

        .primary-button {
          background-color: var(--primary-color);
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .primary-button:hover {
          background-color: var(--secondary-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(106, 13, 173, 0.3);
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
          box-shadow: var(--box-shadow);
          transition: var(--transition);
          border-left: 4px solid var(--primary-color);
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

        .collection-type {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: var(--text-medium);
          margin: 0;
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
        }

        .additional-details h4 {
          margin: 0 0 15px 0;
          color: var(--primary-color);
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 15px;
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
        }

        .action-button.contact {
          background-color: var(--primary-light);
          color: var(--primary-color);
        }

        .action-button.contact:hover {
          background-color: #e0ccff;
        }

        .action-button.details {
          background-color: white;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
        }

        .action-button.details:hover {
          background-color: var(--primary-light);
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
        }
      `}</style>
    </div>
  );
};

export default Orders;