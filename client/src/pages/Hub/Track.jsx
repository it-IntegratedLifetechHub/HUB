import React, { useState, useEffect } from "react";
import HubNav from "../../components/HubNav";

const Track = () => {
  // Sample orders data - in a real app, this would come from API calls
  const [orders, setOrders] = useState([
    {
      id: "#ORD-1001",
      patient: "John Doe",
      test: "Complete Blood Count",
      date: "2023-06-15",
      status: "New",
      priority: "High",
      lab: "City Diagnostics",
      phlebotomist: "Sarah Johnson",
      collectionTime: "09:30 AM",
      processingTime: "1h 15m",
      turnaroundTime: "24h",
      results: "Pending",
    },
    {
      id: "#ORD-1002",
      patient: "Jane Smith",
      test: "Lipid Panel",
      date: "2023-06-14",
      status: "Processing",
      priority: "Medium",
      lab: "Metro Health",
      phlebotomist: "David Miller",
      collectionTime: "10:45 AM",
      processingTime: "45m",
      turnaroundTime: "18h",
      results: "In Analysis",
    },
    {
      id: "#ORD-1003",
      patient: "Robert Johnson",
      test: "Thyroid Function",
      date: "2023-06-14",
      status: "Completed",
      priority: "Low",
      lab: "Precision Labs",
      phlebotomist: "Lisa Chen",
      collectionTime: "11:15 AM",
      processingTime: "30m",
      turnaroundTime: "12h",
      results: "Ready",
    },
    {
      id: "#ORD-1004",
      patient: "Emily Davis",
      test: "Glucose Test",
      date: "2023-06-13",
      status: "Processing",
      priority: "Medium",
      lab: "Quick Results",
      phlebotomist: "James Wilson",
      collectionTime: "02:30 PM",
      processingTime: "1h",
      turnaroundTime: "6h",
      results: "In Analysis",
    },
    {
      id: "#ORD-1005",
      patient: "Michael Wilson",
      test: "Liver Function",
      date: "2023-06-13",
      status: "Completed",
      priority: "High",
      lab: "Advanced Pathology",
      phlebotomist: "Maria Garcia",
      collectionTime: "09:00 AM",
      processingTime: "2h",
      turnaroundTime: "36h",
      results: "Ready",
    },
    {
      id: "#ORD-1006",
      patient: "Sarah Thompson",
      test: "COVID-19 PCR",
      date: "2023-06-12",
      status: "Delayed",
      priority: "High",
      lab: "City Diagnostics",
      phlebotomist: "Sarah Johnson",
      collectionTime: "03:45 PM",
      processingTime: "2h 30m",
      turnaroundTime: "48h",
      results: "Delayed",
    },
    {
      id: "#ORD-1007",
      patient: "David Miller",
      test: "Hemoglobin A1C",
      date: "2023-06-12",
      status: "Cancelled",
      priority: "Medium",
      lab: "Metro Health",
      phlebotomist: "N/A",
      collectionTime: "N/A",
      processingTime: "N/A",
      turnaroundTime: "N/A",
      results: "Cancelled",
    },
  ]);

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [selectedTab, setSelectedTab] = useState("all");

  // Get unique dates for filter
  const dates = [...new Set(orders.map((order) => order.date))];

  // Filter orders based on search and filters
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
      const matchesDate = dateFilter === "All" || order.date === dateFilter;
      const matchesTab =
        selectedTab === "all" ||
        (selectedTab === "new" && order.status === "New") ||
        (selectedTab === "processing" && order.status === "Processing") ||
        (selectedTab === "completed" && order.status === "Completed") ||
        (selectedTab === "delayed" && order.status === "Delayed") ||
        (selectedTab === "cancelled" && order.status === "Cancelled");

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesDate &&
        matchesTab
      );
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

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Calculate statistics
  const totalOrders = orders.length;
  const newOrders = orders.filter((order) => order.status === "New").length;
  const processingOrders = orders.filter(
    (order) => order.status === "Processing"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;
  const delayedOrders = orders.filter(
    (order) => order.status === "Delayed"
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Refresh data (simulated)
  const refreshData = () => {
    // In a real app, this would fetch fresh data from the API
    console.log("Refreshing data...");
  };

  return (
    <>
      <HubNav />
      <div className="tracking-dashboard">
        <header>
          <div className="header-content">
            <h1>Order Tracking</h1>
            <p className="welcome-message">
              Monitor and manage all laboratory test orders in real-time
            </p>
          </div>
          <div className="header-actions">
            <button className="btn refresh-btn" onClick={refreshData}>
              <span className="icon">🔄</span> Refresh
            </button>
            <button className="btn export-btn">
              <span className="icon">📊</span> Export Report
            </button>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card total">
            <div className="stat-value">{totalOrders}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          <div className="stat-card new">
            <div className="stat-value">{newOrders}</div>
            <div className="stat-label">New</div>
          </div>
          <div className="stat-card processing">
            <div className="stat-value">{processingOrders}</div>
            <div className="stat-label">Processing</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-value">{completedOrders}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card delayed">
            <div className="stat-value">{delayedOrders}</div>
            <div className="stat-label">Delayed</div>
          </div>
          <div className="stat-card cancelled">
            <div className="stat-value">{cancelledOrders}</div>
            <div className="stat-label">Cancelled</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab ${selectedTab === "all" ? "active" : ""}`}
            onClick={() => setSelectedTab("all")}
          >
            All Orders
          </button>
          <button
            className={`tab ${selectedTab === "new" ? "active" : ""}`}
            onClick={() => setSelectedTab("new")}
          >
            New
          </button>
          <button
            className={`tab ${selectedTab === "processing" ? "active" : ""}`}
            onClick={() => setSelectedTab("processing")}
          >
            Processing
          </button>
          <button
            className={`tab ${selectedTab === "completed" ? "active" : ""}`}
            onClick={() => setSelectedTab("completed")}
          >
            Completed
          </button>
          <button
            className={`tab ${selectedTab === "delayed" ? "active" : ""}`}
            onClick={() => setSelectedTab("delayed")}
          >
            Delayed
          </button>
          <button
            className={`tab ${selectedTab === "cancelled" ? "active" : ""}`}
            onClick={() => setSelectedTab("cancelled")}
          >
            Cancelled
          </button>
        </div>

        {/* Filters */}
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
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority:</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date:</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="All">All Dates</option>
              {dates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn reset-btn"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("All");
              setPriorityFilter("All");
              setDateFilter("All");
            }}
          >
            Reset Filters
          </button>
        </div>

        {/* Orders Table */}
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
                <th onClick={() => requestSort("priority")}>
                  Priority{" "}
                  {sortConfig.key === "priority" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th>Collection Time</th>
                <th>Processing Time</th>
                <th>Turnaround</th>
                <th>Lab</th>
                <th>Phlebotomist</th>
                <th>Results</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`status-${order.status.toLowerCase()}`}
                  >
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
                    <td>
                      <span
                        className={`priority-badge ${order.priority.toLowerCase()}`}
                      >
                        {order.priority}
                      </span>
                    </td>
                    <td>{order.collectionTime}</td>
                    <td>
                      <div className="processing-time">
                        <span className="time-value">
                          {order.processingTime}
                        </span>
                        {order.status === "Processing" && (
                          <div className="progress-bar">
                            <div
                              className="progress"
                              style={{
                                width: `${calculateProgress(
                                  order.processingTime
                                )}%`,
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{order.turnaroundTime}</td>
                    <td>{order.lab}</td>
                    <td>{order.phlebotomist}</td>
                    <td>
                      <span
                        className={`results-badge ${order.results
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {order.results}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${order.status.toLowerCase()}`}
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
                          <option value="New">New</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Delayed">Delayed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="no-results">
                  <td colSpan="13">
                    <div className="no-results-content">
                      <span className="icon">🔍</span>
                      <h3>No orders found</h3>
                      <p>Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Order Timeline Modal (would be implemented) */}
        {/* Order Details Modal (would be implemented) */}
      </div>

      <style jsx>{`
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
          --new-color: #3498db;
          --processing-color: #f39c12;
          --completed-color: #27ae60;
          --delayed-color: #e74c3c;
          --cancelled-color: #95a5a6;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-color: var(--bg-color);
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
            sans-serif;
        }

        .tracking-dashboard {
          padding: 30px;
          max-width: 1800px;
          margin: 0 auto;
        }

        /* Header styles */
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

        /* Button styles */
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
          border: 1px solid #e0e0e0;
        }

        .refresh-btn:hover {
          background-color: #f0f0f0;
        }

        .export-btn {
          background: linear-gradient(
            135deg,
            var(--primary-light) 0%,
            var(--primary-color) 100%
          );
          color: white;
          box-shadow: 0 4px 12px rgba(94, 13, 151, 0.2);
        }

        .export-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(94, 13, 151, 0.3);
        }

        .reset-btn {
          background-color: transparent;
          color: var(--primary-color);
          border: 1px solid var(--primary-light);
        }

        .reset-btn:hover {
          background-color: rgba(94, 13, 151, 0.05);
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

        /* Stats overview */
        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-card.total {
          border-top: 4px solid var(--primary-color);
        }

        .stat-card.new {
          border-top: 4px solid var(--new-color);
        }

        .stat-card.processing {
          border-top: 4px solid var(--processing-color);
        }

        .stat-card.completed {
          border-top: 4px solid var(--completed-color);
        }

        .stat-card.delayed {
          border-top: 4px solid var(--delayed-color);
        }

        .stat-card.cancelled {
          border-top: 4px solid var(--cancelled-color);
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-color);
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-light);
        }

        /* Tabs */
        .tabs-container {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          overflow-x: auto;
          padding-bottom: 5px;
        }

        .tab {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          background-color: var(--card-bg);
          color: var(--text-light);
          cursor: pointer;
          font-weight: 500;
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        .tab:hover {
          color: var(--primary-color);
          background-color: rgba(94, 13, 151, 0.05);
        }

        .tab.active {
          background-color: var(--primary-color);
          color: white;
        }

        /* Filters */
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
          min-width: 150px;
        }

        /* Table styles */
        .orders-table-container {
          background: var(--card-bg);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
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

        /* Status-based row coloring */
        tr.status-new {
          background-color: rgba(52, 152, 219, 0.05);
        }

        tr.status-processing {
          background-color: rgba(243, 156, 18, 0.05);
        }

        tr.status-completed {
          background-color: rgba(39, 174, 96, 0.05);
        }

        tr.status-delayed {
          background-color: rgba(231, 76, 60, 0.05);
        }

        tr.status-cancelled {
          background-color: rgba(149, 165, 166, 0.05);
        }

        /* Cell styles */
        .patient-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .patient-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            var(--primary-light) 0%,
            var(--primary-color) 100%
          );
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

        .processing-time {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .time-value {
          font-weight: 500;
        }

        .progress-bar {
          height: 4px;
          background-color: #f0f0f0;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress {
          height: 100%;
          background-color: var(--processing-color);
          transition: width 0.3s ease;
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

        .status-badge.new {
          background-color: rgba(52, 152, 219, 0.1);
          color: var(--new-color);
        }

        .status-badge.processing {
          background-color: rgba(243, 156, 18, 0.1);
          color: var(--processing-color);
        }

        .status-badge.completed {
          background-color: rgba(39, 174, 96, 0.1);
          color: var(--completed-color);
        }

        .status-badge.delayed {
          background-color: rgba(231, 76, 60, 0.1);
          color: var(--delayed-color);
        }

        .status-badge.cancelled {
          background-color: rgba(149, 165, 166, 0.1);
          color: var(--cancelled-color);
        }

        .results-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
          text-align: center;
        }

        .results-badge.pending {
          background-color: rgba(52, 152, 219, 0.1);
          color: var(--new-color);
        }

        .results-badge.in-analysis {
          background-color: rgba(243, 156, 18, 0.1);
          color: var(--processing-color);
        }

        .results-badge.ready {
          background-color: rgba(39, 174, 96, 0.1);
          color: var(--completed-color);
        }

        .results-badge.delayed {
          background-color: rgba(231, 76, 60, 0.1);
          color: var(--delayed-color);
        }

        .results-badge.cancelled {
          background-color: rgba(149, 165, 166, 0.1);
          color: var(--cancelled-color);
        }

        /* Action buttons */
        .action-buttons {
          display: flex;
          gap: 8px;
          align-items: center;
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

        /* No results */
        .no-results td {
          padding: 0;
        }

        .no-results-content {
          text-align: center;
          padding: 40px 20px;
        }

        .no-results-content .icon {
          font-size: 48px;
          margin-bottom: 15px;
          color: var(--text-light);
        }

        .no-results-content h3 {
          color: var(--text-color);
          margin-bottom: 8px;
        }

        .no-results-content p {
          color: var(--text-light);
        }

        /* Responsive styles */
        @media (max-width: 1200px) {
          .orders-table-container {
            overflow-x: auto;
          }

          table {
            width: max-content;
            min-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .filters-container {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box,
          .filter-group {
            width: 100%;
          }

          .stats-overview {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
};

// Helper function to calculate progress (simplified for demo)
function calculateProgress(processingTime) {
  if (!processingTime || processingTime === "N/A") return 0;

  // Extract hours and minutes from string like "1h 15m"
  const hoursMatch = processingTime.match(/(\d+)h/);
  const minsMatch = processingTime.match(/(\d+)m/);

  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
  const mins = minsMatch ? parseInt(minsMatch[1]) : 0;

  const totalMins = hours * 60 + mins;

  // For demo purposes, assume average processing time is 2 hours
  const progress = Math.min(100, Math.round((totalMins / 120) * 100));

  return progress;
}

export default Track;
