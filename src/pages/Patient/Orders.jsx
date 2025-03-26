import React from "react";
import {
  FaCheckCircle,
  FaFlask,
  FaFileAlt,
  FaCalendarAlt,
  FaInfoCircle,
  FaUserNurse,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import BottomNavigation from "../../components/BottomNav";

const Orders = () => {
  // Sample order data - in a real app this would come from an API
  const orders = [
    {
      id: 1,
      testName: "Complete Blood Count (CBC)",
      bookedDate: "10 January 2025",
      status: "in-lab", // 'completed', 'in-lab', 'pending'
      estimatedCompletion: "12 January 2025",
      collectionType: "Home Collection",
      collectionTime: "9:00 AM - 11:00 AM",
      phlebotomist: "Dr. Smith (ID: PHLEB-123)",
      notes: "Fasting required for 8 hours before test",
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
      notes: "Report available for download",
    },
  ];

  const getStatusSteps = (status) => {
    const steps = [
      {
        icon: <FaCheckCircle size={20} />,
        label: "Test Taken",
        status: "completed",
      },
      { icon: <FaFlask size={20} />, label: "In Lab", status: "in-lab" },
      { icon: <FaFileAlt size={20} />, label: "Report", status: "pending" },
    ];

    return steps.map((step) => {
      if (status === "completed") {
        return {
          ...step,
          current:
            step.status === "completed" ||
            step.status === "in-lab" ||
            step.status === "pending",
        };
      } else if (status === "in-lab") {
        return {
          ...step,
          current: step.status === "completed" || step.status === "in-lab",
        };
      } else {
        return { ...step, current: step.status === "completed" };
      }
    });
  };

  return (
    <>
      <div className="orders-container">
        <h1 className="page-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <img
              src="/images/no-orders.svg"
              alt="No orders"
              className="empty-image"
            />
            <h3>No Orders Found</h3>
            <p>You haven't booked any tests yet.</p>
            <button className="primary-button">Book a Test</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="card-header">
                  <h2 className="test-name">{order.testName}</h2>
                  <span className={`status-badge ${order.status}`}>
                    {order.status === "completed"
                      ? "Completed"
                      : order.status === "in-lab"
                      ? "In Progress"
                      : "Pending"}
                  </span>
                </div>

                <div className="order-details">
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <div>
                      <p className="detail-label">Booked Date</p>
                      <p className="detail-value">{order.bookedDate}</p>
                    </div>
                  </div>

                  {order.status === "completed" && (
                    <div className="detail-item">
                      <FaCheckCircle className="detail-icon" />
                      <div>
                        <p className="detail-label">Completed Date</p>
                        <p className="detail-value">{order.completedDate}</p>
                      </div>
                    </div>
                  )}

                  {order.status === "in-lab" && (
                    <div className="detail-item">
                      <FaFlask className="detail-icon" />
                      <div>
                        <p className="detail-label">Estimated Completion</p>
                        <p className="detail-value">
                          {order.estimatedCompletion}
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
                </div>

                {order.notes && (
                  <div className="notes-section">
                    <p className="notes-label">Important Notes:</p>
                    <p className="notes-text">{order.notes}</p>
                  </div>
                )}

                <div className="order-status-section">
                  <h3>Status Progress</h3>
                  <div className="progress-tracker">
                    {getStatusSteps(order.status).map((step, index) => (
                      <React.Fragment key={index}>
                        <div className={`step ${step.current ? "active" : ""}`}>
                          {React.cloneElement(step.icon, {
                            size: 20,
                            className: step.current ? "active-icon" : "",
                          })}
                          <span>{step.label}</span>
                        </div>
                        {index < getStatusSteps(order.status).length - 1 && (
                          <div
                            className={`line ${
                              step.current ? "active-line" : ""
                            }`}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="action-buttons">
                  {order.status === "completed" ? (
                    <>
                      <button className="download-button">
                        Download Report
                      </button>
                      <button className="contact-button">
                        Contact Support
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="details-button">View Details</button>
                      <button className="contact-button">
                        Contact Support
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </>
  );
};

export default Orders;
