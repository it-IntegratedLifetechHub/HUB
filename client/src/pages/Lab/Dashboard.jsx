import React, { useState, useEffect } from "react";
import LabNav from "../../components/LabNav";
import {
  FaFlask,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
  FaCalendarAlt,
  FaEllipsisV,
  FaFileDownload,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdOutlineMedicalServices, MdPendingActions } from "react-icons/md";
import { BsGraphUp, BsThreeDotsVertical } from "react-icons/bs";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Dashboard = () => {
  // State for statistics
  const [stats, setStats] = useState({
    pending: 24,
    inProgress: 12,
    completed: 48,
    critical: 5,
  });

  // State for sample data
  const [recentSamples, setRecentSamples] = useState([
    {
      id: "SMP-1001",
      patient: "John Doe",
      test: "CBC",
      status: "pending",
      received: "2023-06-15",
      priority: "normal",
    },
    {
      id: "SMP-1002",
      patient: "Jane Smith",
      test: "Lipid Profile",
      status: "in-progress",
      received: "2023-06-15",
      priority: "high",
    },
    {
      id: "SMP-1003",
      patient: "Robert Johnson",
      test: "Thyroid Panel",
      status: "completed",
      received: "2023-06-14",
      priority: "normal",
    },
    {
      id: "SMP-1004",
      patient: "Emily Davis",
      test: "Liver Function",
      status: "pending",
      received: "2023-06-14",
      priority: "normal",
    },
    {
      id: "SMP-1005",
      patient: "Michael Wilson",
      test: "COVID-19 PCR",
      status: "critical",
      received: "2023-06-14",
      priority: "urgent",
    },
  ]);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateRange, setDateRange] = useState("today");
  const [sortConfig, setSortConfig] = useState({
    key: "received",
    direction: "desc",
  });
  const [expandedSample, setExpandedSample] = useState(null);

  // Filter samples based on search and filter criteria
  const filteredSamples = recentSamples.filter((sample) => {
    const matchesSearch =
      sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.test.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      activeFilter === "all" ||
      sample.status === activeFilter ||
      (activeFilter === "priority" && sample.priority !== "normal");

    return matchesSearch && matchesFilter;
  });

  // Sort samples
  const sortedSamples = [...filteredSamples].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Request sort
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Toggle sample details
  const toggleSampleDetails = (sampleId) => {
    setExpandedSample(expandedSample === sampleId ? null : sampleId);
  };

  // Chart data
  const testStatusData = {
    labels: ["Pending", "In Progress", "Completed", "Critical"],
    datasets: [
      {
        data: [
          stats.pending,
          stats.inProgress,
          stats.completed,
          stats.critical,
        ],
        backgroundColor: ["#FFB74D", "#64B5F6", "#81C784", "#E57373"],
        borderColor: ["#FF9800", "#2196F3", "#4CAF50", "#F44336"],
        borderWidth: 1,
      },
    ],
  };

  const testVolumeData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Tests Processed",
        data: [65, 59, 80, 81, 56, 72],
        backgroundColor: "rgba(94, 13, 151, 0.7)",
        borderColor: "rgba(94, 13, 151, 1)",
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: "rgba(123, 0, 204, 0.8)",
      },
    ],
  };

  // Status icon component
  const StatusIcon = ({ status }) => {
    switch (status) {
      case "pending":
        return <MdPendingActions className="status-icon" />;
      case "in-progress":
        return <FaClock className="status-icon" />;
      case "completed":
        return <FaCheckCircle className="status-icon" />;
      case "critical":
        return <FaExclamationTriangle className="status-icon" />;
      default:
        return <MdOutlineMedicalServices className="status-icon" />;
    }
  };

  // Priority badge component
  const PriorityBadge = ({ priority }) => {
    switch (priority) {
      case "urgent":
        return <span className="priority-badge urgent">URGENT</span>;
      case "high":
        return <span className="priority-badge high">HIGH</span>;
      default:
        return null;
    }
  };

  // Sample details component
  const SampleDetails = ({ sample }) => {
    return (
      <div className="sample-details">
        <div className="detail-row">
          <span className="detail-label">Test Details:</span>
          <span>{sample.test} - Standard Panel</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Physician:</span>
          <span>Dr. {sample.patient.split(" ")[0]} Smith</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Collection Time:</span>
          <span>08:30 AM</span>
        </div>
        <div className="detail-actions">
          <button className="action-btn view-btn">View Full Report</button>
          <button className="action-btn notes-btn">Add Notes</button>
          {sample.status === "pending" && (
            <button className="action-btn process-btn">Start Processing</button>
          )}
        </div>
      </div>
    );
  };

  // Sort indicator component
  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return (
      <span className="sort-indicator">
        {sortConfig.direction === "asc" ? <FaChevronUp /> : <FaChevronDown />}
      </span>
    );
  };

  return (
    <div className="lab-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1>Lab Dashboard</h1>
          <p className="greeting">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="header-controls">
          <div className="date-selector">
            <FaCalendarAlt />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <button className="export-btn">
            <FaFileDownload /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card pending">
          <div className="stat-icon">
            <MdPendingActions />
          </div>
          <div className="stat-info">
            <h3>Pending Tests</h3>
            <p>{stats.pending}</p>
            <span className="stat-trend up">+2 from yesterday</span>
          </div>
        </div>

        <div className="stat-card in-progress">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-info">
            <h3>In Progress</h3>
            <p>{stats.inProgress}</p>
            <span className="stat-trend down">-1 from yesterday</span>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <h3>Completed Today</h3>
            <p>{stats.completed}</p>
            <span className="stat-trend up">+8 from yesterday</span>
          </div>
        </div>

        <div className="stat-card critical">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-info">
            <h3>Critical Results</h3>
            <p>{stats.critical}</p>
            <span className="stat-trend">No change</span>
          </div>
        </div>
      </div>

      {/* Data Visualization */}
      <div className="data-visualization">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Test Status Distribution</h3>
            <div className="chart-legend">
              {testStatusData.labels.map((label, index) => (
                <div key={label} className="legend-item">
                  <span
                    className="legend-color"
                    style={{
                      backgroundColor:
                        testStatusData.datasets[0].backgroundColor[index],
                    }}
                  ></span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-container">
            <Pie
              data={testStatusData}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.label}: ${context.raw} (${context.percent}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Monthly Test Volume</h3>
            <select className="chart-time-selector">
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="chart-container">
            <Bar
              data={testVolumeData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: false,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `Tests: ${context.raw}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Samples */}
      <div className="samples-card">
        <div className="table-header">
          <h2>Recent Samples</h2>
          <div className="table-controls">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search samples..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-dropdown">
              <FaFilter />
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="critical">Critical</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="samples-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("id")}>
                  Sample ID <SortIndicator columnKey="id" />
                </th>
                <th onClick={() => requestSort("patient")}>
                  Patient <SortIndicator columnKey="patient" />
                </th>
                <th onClick={() => requestSort("test")}>
                  Test <SortIndicator columnKey="test" />
                </th>
                <th onClick={() => requestSort("priority")}>
                  Priority <SortIndicator columnKey="priority" />
                </th>
                <th onClick={() => requestSort("status")}>
                  Status <SortIndicator columnKey="status" />
                </th>
                <th onClick={() => requestSort("received")}>
                  Received <SortIndicator columnKey="received" />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSamples.map((sample) => (
                <React.Fragment key={sample.id}>
                  <tr
                    onClick={() => toggleSampleDetails(sample.id)}
                    className="clickable-row"
                  >
                    <td>
                      <span className="sample-id">{sample.id}</span>
                      <PriorityBadge priority={sample.priority} />
                    </td>
                    <td>{sample.patient}</td>
                    <td>{sample.test}</td>
                    <td>
                      <span className={`priority-indicator ${sample.priority}`}>
                        {sample.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${sample.status}`}>
                        <StatusIcon status={sample.status} />
                        {sample.status.replace("-", " ")}
                      </span>
                    </td>
                    <td>{sample.received}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view-btn">View</button>
                        {sample.status === "pending" && (
                          <button className="action-btn process-btn">
                            Process
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedSample === sample.id && (
                    <tr className="details-row">
                      <td colSpan="7">
                        <SampleDetails sample={sample} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {sortedSamples.length === 0 && (
            <div className="no-results">
              <p>No samples found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      <LabNav />

      <style jsx>{`
        :root {
          --primary: #5e0d97;
          --primary-light: #7b00cc;
          --secondary: #17a2b8;
          --danger: #e63946;
          --warning: #ffbe0b;
          --success: #2a9d8f;
          --text: #2b2d42;
          --text-light: #8d99ae;
          --bg: #f8f9fa;
          --card-bg: #ffffff;
          --border: #e9ecef;
        }

        .lab-dashboard {
          padding: 2rem;
          padding-bottom: 6rem;
          max-width: 1400px;
          margin: 0 auto;
          background-color: var(--bg);
          min-height: 100vh;
        }

        /* Header Styles */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 1.8rem;
          color: var(--text);
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .greeting {
          color: var(--text-light);
          font-size: 0.95rem;
        }

        .header-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .date-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--card-bg);
          padding: 0.6rem 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .date-selector select {
          border: none;
          background: transparent;
          color: var(--text);
          font-weight: 500;
          cursor: pointer;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .export-btn:hover {
          background: var(--primary-light);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* Stats Cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .stat-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
        }

        .stat-card.pending::before {
          background: var(--warning);
        }

        .stat-card.in-progress::before {
          background: var(--secondary);
        }

        .stat-card.completed::before {
          background: var(--success);
        }

        .stat-card.critical::before {
          background: var(--danger);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          font-size: 1.2rem;
          color: white;
        }

        .stat-card.pending .stat-icon {
          background: var(--warning);
        }

        .stat-card.in-progress .stat-icon {
          background: var(--secondary);
        }

        .stat-card.completed .stat-icon {
          background: var(--success);
        }

        .stat-card.critical .stat-icon {
          background: var(--danger);
        }

        .stat-info h3 {
          font-size: 0.9rem;
          color: var(--text-light);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .stat-info p {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 0.3rem;
        }

        .stat-trend {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .stat-trend.up {
          color: var(--success);
        }

        .stat-trend.down {
          color: var(--danger);
        }

        /* Data Visualization */
        .data-visualization {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 1024px) {
          .data-visualization {
            grid-template-columns: 1fr;
          }
        }

        .chart-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .chart-header h3 {
          font-size: 1.1rem;
          color: var(--text);
          font-weight: 600;
        }

        .chart-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          font-size: 0.8rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .legend-color {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }

        .chart-time-selector {
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 0.3rem 0.6rem;
          font-size: 0.8rem;
          background: var(--bg);
          color: var(--text);
        }

        .chart-container {
          height: 250px;
          position: relative;
        }

        /* Samples Table */
        .samples-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .table-header h2 {
          font-size: 1.3rem;
          color: var(--text);
          font-weight: 600;
        }

        .table-controls {
          display: flex;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .table-controls {
            flex-direction: column;
            width: 100%;
          }
        }

        .search-box {
          display: flex;
          align-items: center;
          background: var(--bg);
          padding: 0.6rem 1rem;
          border-radius: 8px;
          width: 220px;
        }

        .search-box input {
          border: none;
          background: transparent;
          outline: none;
          margin-left: 0.5rem;
          width: 100%;
          color: var(--text);
        }

        .filter-dropdown {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg);
          padding: 0.6rem 1rem;
          border-radius: 8px;
        }

        .filter-dropdown select {
          border: none;
          background: transparent;
          color: var(--text);
          font-weight: 500;
          cursor: pointer;
        }

        .table-container {
          overflow-x: auto;
        }

        .samples-table {
          width: 100%;
          border-collapse: collapse;
        }

        .samples-table th {
          text-align: left;
          padding: 1rem;
          background: var(--bg);
          color: var(--text-light);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: sticky;
          top: 0;
          cursor: pointer;
          user-select: none;
        }

        .samples-table th:hover {
          background: #e9ecef;
        }

        .sort-indicator {
          margin-left: 0.3rem;
          font-size: 0.7rem;
          color: var(--primary);
        }

        .samples-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          font-size: 0.9rem;
          color: var(--text);
          vertical-align: middle;
        }

        .clickable-row {
          cursor: pointer;
        }

        .clickable-row:hover td {
          background: rgba(94, 13, 151, 0.03);
        }

        .details-row td {
          padding: 0;
          background: rgba(94, 13, 151, 0.02);
        }

        .sample-details {
          padding: 1rem;
        }

        .detail-row {
          display: flex;
          margin-bottom: 0.8rem;
        }

        .detail-label {
          font-weight: 600;
          width: 120px;
          color: var(--text-light);
        }

        .detail-actions {
          display: flex;
          gap: 0.8rem;
          margin-top: 1.2rem;
        }

        .notes-btn {
          background: #6c757d;
          color: white;
        }

        .notes-btn:hover {
          background: #5a6268;
        }

        .no-results {
          text-align: center;
          padding: 2rem;
          color: var(--text-light);
        }

        .sample-id {
          font-weight: 500;
          display: block;
          margin-bottom: 0.3rem;
        }

        .priority-badge {
          font-size: 0.65rem;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-weight: 700;
          display: inline-block;
        }

        .priority-badge.urgent {
          background: #ffebee;
          color: #c62828;
        }

        .priority-badge.high {
          background: #fff8e1;
          color: #ff8f00;
        }

        .priority-indicator {
          font-size: 0.8rem;
          font-weight: 500;
          padding: 0.3rem 0.6rem;
          border-radius: 12px;
        }

        .priority-indicator.urgent {
          background: #ffebee;
          color: #c62828;
        }

        .priority-indicator.high {
          background: #fff8e1;
          color: #ff8f00;
        }

        .priority-indicator.normal {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.8rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-icon {
          font-size: 0.9rem;
        }

        .status-badge.pending {
          background: #fff3e0;
          color: #e65100;
        }

        .status-badge.in-progress {
          background: #e3f2fd;
          color: #1565c0;
        }

        .status-badge.completed {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .status-badge.critical {
          background: #ffebee;
          color: #c62828;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.5rem 0.8rem;
          border-radius: 6px;
          border: none;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .view-btn {
          background: var(--primary);
          color: white;
        }

        .view-btn:hover {
          background: var(--primary-light);
        }

        .process-btn {
          background: var(--secondary);
          color: white;
        }

        .process-btn:hover {
          background: #138496;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-controls {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
          }

          .date-selector,
          .export-btn {
            width: 100%;
          }

          .search-box,
          .filter-dropdown {
            width: 100%;
          }
        }

        @media (max-width: 576px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .lab-dashboard {
            padding: 1rem;
            padding-bottom: 5rem;
          }

          .detail-row {
            flex-direction: column;
          }

          .detail-label {
            width: 100%;
            margin-bottom: 0.3rem;
          }

          .detail-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
