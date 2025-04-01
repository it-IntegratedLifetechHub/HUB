import React from "react";
import HubNav from "../../components/HubNav";

const Dashboard = () => {
  // Sample data - in a real app, this would come from API calls
  const stats = {
    totalPatients: 1245,
    totalLabs: 42,
    totalPhlebotomists: 87,
    activeOrders: 189,
    growthPatients: 12,
    growthLabs: 5,
    growthPhlebotomists: 8,
    growthOrders: -3,
  };

  const recentOrders = [
    {
      id: "#ORD-1001",
      patient: "John Doe",
      test: "CBC",
      date: "2023-05-15",
      status: "Pending",
    },
    {
      id: "#ORD-1002",
      patient: "Jane Smith",
      test: "Lipid Panel",
      date: "2023-05-14",
      status: "In Progress",
    },
    {
      id: "#ORD-1003",
      patient: "Robert Johnson",
      test: "Thyroid Test",
      date: "2023-05-14",
      status: "Completed",
    },
    {
      id: "#ORD-1004",
      patient: "Emily Davis",
      test: "Glucose Test",
      date: "2023-05-13",
      status: "Completed",
    },
    {
      id: "#ORD-1005",
      patient: "Michael Wilson",
      test: "Liver Function",
      date: "2023-05-13",
      status: "Cancelled",
    },
  ];

  const phlebotomists = [
    {
      id: "PH-101",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      activeOrders: 5,
      rating: 4.8,
    },
    {
      id: "PH-102",
      name: "David Miller",
      email: "david@example.com",
      activeOrders: 3,
      rating: 4.5,
    },
    {
      id: "PH-103",
      name: "Lisa Chen",
      email: "lisa@example.com",
      activeOrders: 7,
      rating: 4.9,
    },
    {
      id: "PH-104",
      name: "James Wilson",
      email: "james@example.com",
      activeOrders: 2,
      rating: 4.2,
    },
    {
      id: "PH-105",
      name: "Maria Garcia",
      email: "maria@example.com",
      activeOrders: 4,
      rating: 4.7,
    },
  ];

  const labs = [
    {
      id: "LAB-201",
      name: "City Diagnostics",
      location: "Downtown",
      tests: 32,
      rating: 4.6,
    },
    {
      id: "LAB-202",
      name: "Metro Health Labs",
      location: "Uptown",
      tests: 28,
      rating: 4.4,
    },
    {
      id: "LAB-203",
      name: "Precision Testing",
      location: "Midtown",
      tests: 45,
      rating: 4.8,
    },
    {
      id: "LAB-204",
      name: "Quick Results Lab",
      location: "East Side",
      tests: 19,
      rating: 4.1,
    },
    {
      id: "LAB-205",
      name: "Advanced Pathology",
      location: "West End",
      tests: 37,
      rating: 4.7,
    },
  ];

  return (
    <>
      <HubNav />
      <div className="admin-dashboard">
        <header>
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p className="welcome-message">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="dashboard-actions">
            <button className="btn refresh-btn">
              <span className="icon">🔄</span> Refresh
            </button>
            <button className="btn export-btn">
              <span className="icon">📁</span> Export
            </button>
          </div>
        </header>

        <div className="stats-container">
          <div className="stat-card patients-card">
            <div className="stat-icon">👨‍⚕️</div>
            <div className="stat-content">
              <h3>Total Patients</h3>
              <div className="stat-value">
                {stats.totalPatients.toLocaleString()}
              </div>
              <div className="stat-growth positive">
                <span className="trend-icon">↑</span> +{stats.growthPatients}%
                from last month
              </div>
            </div>
          </div>

          <div className="stat-card labs-card">
            <div className="stat-icon">🏥</div>
            <div className="stat-content">
              <h3>Total Labs</h3>
              <div className="stat-value">
                {stats.totalLabs.toLocaleString()}
              </div>
              <div className="stat-growth positive">
                <span className="trend-icon">↑</span> +{stats.growthLabs}% from
                last month
              </div>
            </div>
          </div>

          <div className="stat-card phlebotomists-card">
            <div className="stat-icon">💉</div>
            <div className="stat-content">
              <h3>Total Phlebotomists</h3>
              <div className="stat-value">
                {stats.totalPhlebotomists.toLocaleString()}
              </div>
              <div className="stat-growth positive">
                <span className="trend-icon">↑</span> +
                {stats.growthPhlebotomists}% from last month
              </div>
            </div>
          </div>

          <div className="stat-card orders-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Active Orders</h3>
              <div className="stat-value">
                {stats.activeOrders.toLocaleString()}
              </div>
              <div className="stat-growth negative">
                <span className="trend-icon">↓</span> {stats.growthOrders}% from
                last week
              </div>
            </div>
          </div>
        </div>

        <div className="content-row">
          <div className="recent-orders card">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <a href="/orders" className="view-all">
                View All <span className="arrow">→</span>
              </a>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Patient</th>
                    <th>Test</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td className="patient-cell">
                        <span className="patient-avatar">
                          {order.patient.charAt(0)}
                        </span>
                        {order.patient}
                      </td>
                      <td>{order.test}</td>
                      <td>{order.date}</td>
                      <td>
                        <span
                          className={`status-badge ${order.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="phlebotomists-list card">
            <div className="section-header">
              <h2>Top Phlebotomists</h2>
              <a href="/phlebotomists" className="view-all">
                View All <span className="arrow">→</span>
              </a>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Active</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {phlebotomists.map((phleb) => (
                    <tr key={phleb.id}>
                      <td>{phleb.id}</td>
                      <td className="phleb-name">
                        <span className="phleb-avatar">
                          {phleb.name.charAt(0)}
                        </span>
                        {phleb.name}
                      </td>
                      <td>{phleb.email}</td>
                      <td>
                        <div className="active-orders">
                          <div className="orders-count">
                            {phleb.activeOrders}
                          </div>
                          <div className="orders-label">orders</div>
                        </div>
                      </td>
                      <td>
                        <div className="rating-container">
                          <div className="stars">
                            {"★".repeat(Math.floor(phleb.rating))}
                            {"☆".repeat(5 - Math.floor(phleb.rating))}
                          </div>
                          <span className="rating-value">
                            {phleb.rating.toFixed(1)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="labs-section card">
          <div className="section-header">
            <h2>Registered Labs</h2>
            <div className="section-actions">
              <input
                type="text"
                placeholder="Search labs..."
                className="search-input"
              />
              <a href="/labs" className="view-all">
                View All <span className="arrow">→</span>
              </a>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Lab ID</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Tests</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {labs.map((lab) => (
                  <tr key={lab.id}>
                    <td>{lab.id}</td>
                    <td>
                      <div className="lab-info">
                        <div className="lab-avatar">{lab.name.charAt(0)}</div>
                        <div className="lab-details">
                          <div className="lab-name">{lab.name}</div>
                          <div className="lab-location">{lab.location}</div>
                        </div>
                      </div>
                    </td>
                    <td>{lab.location}</td>
                    <td>
                      <div className="tests-count">{lab.tests}</div>
                    </td>
                    <td>
                      <div className="rating-container">
                        <div className="stars">
                          {"★".repeat(Math.floor(lab.rating))}
                          {"☆".repeat(5 - Math.floor(lab.rating))}
                        </div>
                        <span className="rating-value">
                          {lab.rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn small-btn view-btn">View</button>
                        <button className="btn small-btn edit-btn">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="btn action-btn primary-action">
              <span className="icon">👤</span>
              <span className="action-text">Add New Patient</span>
            </button>
            <button className="btn action-btn secondary-action">
              <span className="icon">🏥</span>
              <span className="action-text">Register New Lab</span>
            </button>
            <button className="btn action-btn tertiary-action">
              <span className="icon">💉</span>
              <span className="action-text">Onboard Phlebotomist</span>
            </button>
            <button className="btn action-btn quaternary-action">
              <span className="icon">📊</span>
              <span className="action-text">Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --primary-color: #5e0d97;
          --primary-light: #8a2be2;
          --primary-lighter: #b57edc;
          --secondary-color: #ff7e33;
          --tertiary-color: #00c9a7;
          --quaternary-color: #845ec2;
          --text-color: #2c3e50;
          --text-light: #7f8c8d;
          --bg-color: #f8f9fa;
          --card-bg: #ffffff;
          --success-color: #27ae60;
          --warning-color: #f39c12;
          --error-color: #e74c3c;
          --info-color: #3498db;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-color: var(--bg-color);
        }

        .admin-dashboard {
          padding: 30px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: var(--text-color);
          max-width: 1600px;
          margin: 0 auto;
          background-color: var(--bg-color);
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-content h1 {
          font-size: 32px;
          color: var(--primary-color);
          margin: 0;
          font-weight: 700;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .welcome-message {
          color: var(--text-light);
          font-size: 16px;
          margin-top: 8px;
        }

        .dashboard-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .btn {
          padding: 10px 18px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .btn .icon {
          font-size: 16px;
        }

        .refresh-btn {
          background-color: var(--card-bg);
          color: var(--text-color);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .refresh-btn:hover {
          background-color: #e0e0e0;
          transform: translateY(-2px);
        }

        .export-btn {
          background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(94, 13, 151, 0.2);
        }

        .export-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(94, 13, 151, 0.3);
        }

        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          display: flex;
          gap: 15px;
          align-items: center;
          transition: transform 0.3s ease;
          border-left: 4px solid transparent;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .patients-card {
          border-left-color: var(--primary-color);
        }

        .labs-card {
          border-left-color: var(--secondary-color);
        }

        .phlebotomists-card {
          border-left-color: var(--tertiary-color);
        }

        .orders-card {
          border-left-color: var(--quaternary-color);
        }

        .stat-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(94, 13, 151, 0.1);
          color: var(--primary-color);
        }

        .labs-card .stat-icon {
          background: rgba(255, 126, 51, 0.1);
          color: var(--secondary-color);
        }

        .phlebotomists-card .stat-icon {
          background: rgba(0, 201, 167, 0.1);
          color: var(--tertiary-color);
        }

        .orders-card .stat-icon {
          background: rgba(132, 94, 194, 0.1);
          color: var(--quaternary-color);
        }

        .stat-content {
          flex: 1;
        }

        .stat-card h3 {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: var(--text-light);
          font-weight: 500;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-color);
          margin-bottom: 5px;
        }

        .stat-growth {
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stat-growth .trend-icon {
          font-size: 14px;
        }

        .stat-growth.positive {
          color: var(--success-color);
        }

        .stat-growth.negative {
          color: var(--error-color);
        }

        .content-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        @media (max-width: 1200px) {
          .content-row {
            grid-template-columns: 1fr;
          }
        }

        .card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h2 {
          font-size: 20px;
          margin: 0;
          color: var(--text-color);
          font-weight: 600;
        }

        .section-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .view-all {
          color: var(--primary-color);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
        }

        .view-all .arrow {
          transition: transform 0.2s ease;
        }

        .view-all:hover {
          color: var(--primary-light);
        }

        .view-all:hover .arrow {
          transform: translateX(3px);
        }

        .search-input {
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          min-width: 200px;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-light);
          box-shadow: 0 0 0 2px rgba(94, 13, 151, 0.1);
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: var(--card-bg);
          border-radius: 12px;
          overflow: hidden;
        }

        th, td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #f0f0f0;
        }

        th {
          background-color: #f9f9f9;
          font-weight: 600;
          color: var(--text-light);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        tr:hover {
          background-color: #f9f9f9;
        }

        .patient-cell, .phleb-name {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .patient-avatar, .phleb-avatar, .lab-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }

        .lab-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .lab-details {
          display: flex;
          flex-direction: column;
        }

        .lab-name {
          font-weight: 500;
        }

        .lab-location {
          font-size: 12px;
          color: var(--text-light);
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
          min-width: 80px;
          text-align: center;
        }

        .status-badge.pending {
          background-color: rgba(243, 156, 18, 0.1);
          color: var(--warning-color);
        }

        .status-badge.in-progress {
          background-color: rgba(52, 152, 219, 0.1);
          color: var(--info-color);
        }

        .status-badge.completed {
          background-color: rgba(39, 174, 96, 0.1);
          color: var(--success-color);
        }

        .status-badge.cancelled {
          background-color: rgba(231, 76, 60, 0.1);
          color: var(--error-color);
        }

        .active-orders {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .orders-count {
          font-weight: 600;
          color: var(--text-color);
        }

        .orders-label {
          font-size: 10px;
          color: var(--text-light);
          text-transform: uppercase;
        }

        .tests-count {
          font-weight: 600;
          color: var(--text-color);
        }

        .rating-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stars {
          color: #f1c40f;
          font-size: 14px;
          letter-spacing: 2px;
        }

        .rating-value {
          font-weight: 600;
          color: var(--text-color);
        }

        .small-btn {
          padding: 6px 12px;
          font-size: 12px;
          border-radius: 6px;
          font-weight: 500;
        }

        .view-btn {
          background-color: var(--info-color);
          color: white;
        }

        .edit-btn {
          background-color: var(--tertiary-color);
          color: white;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .quick-actions {
          margin-bottom: 30px;
        }

        .quick-actions h2 {
          font-size: 20px;
          margin-bottom: 20px;
          color: var(--text-color);
          font-weight: 600;
        }

        .quick-actions .action-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          height: 120px;
          background: var(--card-bg);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border-left: 4px solid transparent;
          text-align: left;
        }

        .action-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .action-btn .icon {
          font-size: 28px;
          margin-bottom: 12px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(94, 13, 151, 0.1);
          color: var(--primary-color);
        }

        .action-btn .action-text {
          font-weight: 500;
          font-size: 16px;
        }

        .primary-action {
          border-left-color: var(--primary-color);
        }

        .primary-action .icon {
          background: rgba(94, 13, 151, 0.1);
          color: var(--primary-color);
        }

        .secondary-action {
          border-left-color: var(--secondary-color);
        }

        .secondary-action .icon {
          background: rgba(255, 126, 51, 0.1);
          color: var(--secondary-color);
        }

        .tertiary-action {
          border-left-color: var(--tertiary-color);
        }

        .tertiary-action .icon {
          background: rgba(0, 201, 167, 0.1);
          color: var(--tertiary-color);
        }

        .quaternary-action {
          border-left-color: var(--quaternary-color);
        }

        .quaternary-action .icon {
          background: rgba(132, 94, 194, 0.1);
          color: var(--quaternary-color);
        }
      `}</style>
    </>
  );
};

export default Dashboard;
