import React, { useState } from "react";
import HubNav from "../../components/HubNav";

const Orders = () => {
  // Sample orders data
  const [orders, setOrders] = useState([
    {
      id: "#ORD-1001",
      patient: "John Doe",
      test: "Complete Blood Count",
      date: "2023-06-15",
      status: "Pending",
      lab: "City Diagnostics",
      priority: "High",
      amount: "$120",
    },
    {
      id: "#ORD-1002",
      patient: "Jane Smith",
      test: "Lipid Panel",
      date: "2023-06-14",
      status: "In Progress",
      lab: "Metro Health",
      priority: "Medium",
      amount: "$95",
    },
    {
      id: "#ORD-1003",
      patient: "Robert Johnson",
      test: "Thyroid Function",
      date: "2023-06-14",
      status: "Completed",
      lab: "Precision Labs",
      priority: "Low",
      amount: "$150",
    },
    {
      id: "#ORD-1004",
      patient: "Emily Davis",
      test: "Glucose Test",
      date: "2023-06-13",
      status: "Completed",
      lab: "Quick Results",
      priority: "Medium",
      amount: "$65",
    },
    {
      id: "#ORD-1005",
      patient: "Michael Wilson",
      test: "Liver Function",
      date: "2023-06-13",
      status: "Cancelled",
      lab: "Advanced Pathology",
      priority: "High",
      amount: "$180",
    },
    {
      id: "#ORD-1006",
      patient: "Sarah Thompson",
      test: "COVID-19 PCR",
      date: "2023-06-12",
      status: "In Progress",
      lab: "City Diagnostics",
      priority: "High",
      amount: "$90",
    },
    {
      id: "#ORD-1007",
      patient: "David Miller",
      test: "Hemoglobin A1C",
      date: "2023-06-12",
      status: "Pending",
      lab: "Metro Health",
      priority: "Medium",
      amount: "$75",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.test.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.lab.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;
      const matchesPriority =
        priorityFilter === "All" || order.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const statusOptions = [
    "All",
    "Pending",
    "In Progress",
    "Completed",
    "Cancelled",
  ];
  const priorityOptions = ["All", "High", "Medium", "Low"];

  // Calculate statistics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;
  const revenue = orders
    .filter((order) => order.status === "Completed")
    .reduce((sum, order) => sum + parseFloat(order.amount.replace("$", "")), 0);

  return (
    <>
      <HubNav />
      <div className="orders-container">
        <header>
          <div className="header-content">
            <h1>Orders Management</h1>
            <p className="welcome-message">
              Manage and track all laboratory test orders
            </p>
          </div>
          <div className="header-actions">
            <button className="btn primary-btn">
              <span className="icon">+</span> Create New Order
            </button>
            <button className="btn secondary-btn">
              <span className="icon">📊</span> Generate Report
            </button>
          </div>
        </header>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Total Orders</h3>
              <div className="stat-value">{totalOrders}</div>
              <div className="stat-change">
                <span className="trend up">↑ 12%</span> from last week
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Completed</h3>
              <div className="stat-value">{completedOrders}</div>
              <div className="stat-percentage">
                {Math.round((completedOrders / totalOrders) * 100)}% completion
                rate
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Revenue</h3>
              <div className="stat-value">${revenue.toFixed(2)}</div>
              <div className="stat-change">
                <span className="trend up">↑ 8%</span> from last week
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <h3>Avg. Processing</h3>
              <div className="stat-value">24h</div>
              <div className="stat-change">
                <span className="trend down">↓ 15%</span> improvement
              </div>
            </div>
          </div>
        </div>

        <div className="filters-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Priority:</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button className="btn tertiary-btn">
            <span className="icon">🔄</span> Reset Filters
          </button>
        </div>

        <div className="orders-table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => requestSort("id")}>
                  Order ID{" "}
                  {sortConfig.key === "id" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th onClick={() => requestSort("patient")}>
                  Patient{" "}
                  {sortConfig.key === "patient" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th onClick={() => requestSort("test")}>
                  Test{" "}
                  {sortConfig.key === "test" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th onClick={() => requestSort("date")}>
                  Date{" "}
                  {sortConfig.key === "date" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th onClick={() => requestSort("lab")}>
                  Lab{" "}
                  {sortConfig.key === "lab" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th onClick={() => requestSort("priority")}>
                  Priority{" "}
                  {sortConfig.key === "priority" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th onClick={() => requestSort("amount")}>
                  Amount{" "}
                  {sortConfig.key === "amount" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <div className="patient-cell">
                      <span className="patient-avatar">
                        {order.patient.charAt(0)}
                      </span>
                      {order.patient}
                    </div>
                  </td>
                  <td>{order.test}</td>
                  <td>{order.date}</td>
                  <td>{order.lab}</td>
                  <td>
                    <span
                      className={`priority-badge ${order.priority.toLowerCase()}`}
                    >
                      {order.priority}
                    </span>
                  </td>
                  <td>{order.amount}</td>
                  <td>
                    <span
                      className={`status-badge ${order.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn small-btn view-btn"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No orders found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        <div className="pagination-controls">
          <button className="btn pagination-btn" disabled>
            Previous
          </button>
          <span className="page-info">Page 1 of 3</span>
          <button className="btn pagination-btn">Next</button>
        </div>
      </div>

      <style>{`
        :root {
          --primary-color: #5e0d97;
          --primary-light: #8a2be2;
          --secondary-color: #ff7e33;
          --tertiary-color: #00c9a7;
          --text-color: #2c3e50;
          --text-light: #7f8c8d;
          --bg-color: #f8f9fa;
          --card-bg: #ffffff;
          --success-color: #27ae60;
          --warning-color: #f39c12;
          --error-color: #e74c3c;
          --info-color: #3498db;
          --high-priority: #e74c3c;
          --medium-priority: #f39c12;
          --low-priority: #2ecc71;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-color: var(--bg-color);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .orders-container {
          padding: 30px;
          max-width: 1600px;
          margin: 0 auto;
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

        .header-actions {
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

        .primary-btn {
          background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(94, 13, 151, 0.2);
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(94, 13, 151, 0.3);
        }

        .secondary-btn {
          background-color: var(--card-bg);
          color: var(--text-color);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid #e0e0e0;
        }

        .secondary-btn:hover {
          background-color: #f0f0f0;
          transform: translateY(-2px);
        }

        .tertiary-btn {
          background-color: transparent;
          color: var(--primary-color);
          border: 1px solid var(--primary-light);
        }

        .tertiary-btn:hover {
          background-color: rgba(94, 13, 151, 0.05);
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
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          font-size: 28px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(94, 13, 151, 0.1);
          color: var(--primary-color);
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

        .stat-change, .stat-percentage {
          font-size: 12px;
          color: var(--text-light);
        }

        .trend {
          font-weight: 600;
        }

        .trend.up {
          color: var(--success-color);
        }

        .trend.down {
          color: var(--error-color);
        }

        .filters-container {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          align-items: center;
          margin-bottom: 20px;
          background: var(--card-bg);
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .search-box {
          flex: 1;
          min-width: 250px;
          position: relative;
        }

        .search-box input {
          width: 100%;
          padding: 10px 15px 10px 35px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .search-box input:focus {
          outline: none;
          border-color: var(--primary-light);
          box-shadow: 0 0 0 2px rgba(94, 13, 151, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-group label {
          font-size: 14px;
          color: var(--text-light);
        }

        .filter-group select {
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          background-color: white;
          cursor: pointer;
        }

        .filter-group select:focus {
          outline: none;
          border-color: var(--primary-light);
        }

        .orders-table-container {
          background: var(--card-bg);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          margin-bottom: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
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
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        th:hover {
          background-color: #f0f0f0;
        }

        tr:hover {
          background-color: #f9f9f9;
        }

        .patient-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .patient-avatar {
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

        .priority-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .priority-badge.high {
          background-color: rgba(231, 76, 60, 0.1);
          color: var(--high-priority);
        }

        .priority-badge.medium {
          background-color: rgba(243, 156, 18, 0.1);
          color: var(--medium-priority);
        }

        .priority-badge.low {
          background-color: rgba(46, 204, 113, 0.1);
          color: var(--low-priority);
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

        .action-buttons {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .small-btn {
          padding: 6px;
          min-width: 32px;
          border-radius: 6px;
          font-size: 14px;
        }

        .view-btn {
          background-color: rgba(52, 152, 219, 0.1);
          color: var(--info-color);
        }

        .view-btn:hover {
          background-color: rgba(52, 152, 219, 0.2);
        }

        .status-select {
          padding: 6px;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          font-size: 12px;
          cursor: pointer;
        }

        .status-select:focus {
          outline: none;
          border-color: var(--primary-light);
        }

        .no-results {
          text-align: center;
          padding: 40px 20px;
          background: var(--card-bg);
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .no-results-icon {
          font-size: 48px;
          margin-bottom: 15px;
          color: var(--text-light);
        }

        .no-results h3 {
          color: var(--text-color);
          margin-bottom: 8px;
        }

        .no-results p {
          color: var(--text-light);
        }

        .pagination-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        .pagination-btn {
          padding: 8px 16px;
          background-color: var(--card-bg);
          border: 1px solid #e0e0e0;
        }

        .pagination-btn:hover:not(:disabled) {
          background-color: #f0f0f0;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          color: var(--text-light);
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .filters-container {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box, .filter-group {
            width: 100%;
          }

          table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
    </>
  );
};

export default Orders;
