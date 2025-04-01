import React, { useState, useEffect } from "react";
import HubNav from "../../components/HubNav";

const Assignment = () => {
  // Sample data - in a real app, this would come from API calls
  const [orders, setOrders] = useState([
    {
      id: "#ORD-1001",
      patient: "John Doe",
      test: "Complete Blood Count",
      date: "2023-06-15",
      status: "Unassigned",
      priority: "High",
      location: "Downtown Clinic",
      preferredLab: "",
      assignedPhlebotomist: "",
    },
    {
      id: "#ORD-1002",
      patient: "Jane Smith",
      test: "Lipid Panel",
      date: "2023-06-14",
      status: "Unassigned",
      priority: "Medium",
      location: "Uptown Medical",
      preferredLab: "",
      assignedPhlebotomist: "",
    },
    // More sample orders...
  ]);

  const [phlebotomists, setPhlebotomists] = useState([
    {
      id: "PH-101",
      name: "Sarah Johnson",
      currentLocation: "Downtown Clinic",
      status: "Available",
      currentAssignments: 2,
      maxCapacity: 5,
      rating: 4.8,
    },
    {
      id: "PH-102",
      name: "David Miller",
      currentLocation: "Uptown Medical",
      status: "Available",
      currentAssignments: 1,
      maxCapacity: 5,
      rating: 4.5,
    },
    // More phlebotomists...
  ]);

  const [labs, setLabs] = useState([
    {
      id: "LAB-201",
      name: "City Diagnostics",
      location: "Downtown",
      status: "Operational",
      currentLoad: 32,
      maxCapacity: 50,
      turnaroundTime: "24h",
    },
    {
      id: "LAB-202",
      name: "Metro Health Labs",
      location: "Uptown",
      status: "Operational",
      currentLoad: 28,
      maxCapacity: 45,
      turnaroundTime: "36h",
    },
    // More labs...
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentDetails, setAssignmentDetails] = useState({
    labId: "",
    phlebotomistId: "",
  });

  // Get unique locations for filter
  const locations = [...new Set(orders.map((order) => order.location))];

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.test.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    const matchesPriority =
      priorityFilter === "All" || order.priority === priorityFilter;
    const matchesLocation =
      locationFilter === "All" || order.location === locationFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesLocation;
  });

  // Toggle order selection
  const toggleOrderSelection = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Select all filtered orders
  const selectAllOrders = () => {
    setSelectedOrders(
      selectedOrders.length === filteredOrders.length
        ? []
        : filteredOrders.map((order) => order.id)
    );
  };

  // Handle bulk assignment
  const handleBulkAssignment = () => {
    if (bulkAction === "assign" && selectedOrders.length > 0) {
      setShowAssignmentModal(true);
    } else if (bulkAction === "unassign") {
      // Unassign selected orders
      setOrders(
        orders.map((order) =>
          selectedOrders.includes(order.id)
            ? {
                ...order,
                status: "Unassigned",
                assignedPhlebotomist: "",
                preferredLab: "",
              }
            : order
        )
      );
      setSelectedOrders([]);
      setBulkAction("");
    }
  };

  // Confirm assignment
  const confirmAssignment = () => {
    if (!assignmentDetails.labId || !assignmentDetails.phlebotomistId) {
      alert("Please select both a lab and a phlebotomist");
      return;
    }

    // Update orders
    setOrders(
      orders.map((order) =>
        selectedOrders.includes(order.id)
          ? {
              ...order,
              status: "Assigned",
              preferredLab: assignmentDetails.labId,
              assignedPhlebotomist: assignmentDetails.phlebotomistId,
            }
          : order
      )
    );

    // Update phlebotomist's assignment count
    setPhlebotomists(
      phlebotomists.map((phleb) =>
        phleb.id === assignmentDetails.phlebotomistId
          ? {
              ...phleb,
              currentAssignments:
                phleb.currentAssignments + selectedOrders.length,
            }
          : phleb
      )
    );

    // Close modal and reset
    setShowAssignmentModal(false);
    setSelectedOrders([]);
    setBulkAction("");
    setAssignmentDetails({ labId: "", phlebotomistId: "" });
  };

  // Get available phlebotomists (not at max capacity)
  const availablePhlebotomists = phlebotomists.filter(
    (phleb) =>
      phleb.status === "Available" &&
      phleb.currentAssignments < phleb.maxCapacity
  );

  // Get available labs (not at max capacity)
  const availableLabs = labs.filter(
    (lab) => lab.status === "Operational" && lab.currentLoad < lab.maxCapacity
  );

  return (
    <>
      <HubNav />
      <div className="assignment-container">
        <header>
          <div className="header-content">
            <h1>Order Assignment</h1>
            <p className="welcome-message">
              Allocate orders to phlebotomists and labs efficiently
            </p>
          </div>
          <div className="header-actions">
            <button
              className="btn primary-btn"
              onClick={() => setShowAssignmentModal(true)}
              disabled={selectedOrders.length === 0}
            >
              <span className="icon">➕</span> Assign Selected
            </button>
          </div>
        </header>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Unassigned Orders</h3>
              <div className="stat-value">
                {orders.filter((o) => o.status === "Unassigned").length}
              </div>
              <div className="stat-change">
                {orders.filter((o) => o.status === "Assigned").length} already
                assigned
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💉</div>
            <div className="stat-content">
              <h3>Available Phlebotomists</h3>
              <div className="stat-value">{availablePhlebotomists.length}</div>
              <div className="stat-change">
                {phlebotomists.length - availablePhlebotomists.length}{" "}
                unavailable
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏥</div>
            <div className="stat-content">
              <h3>Available Labs</h3>
              <div className="stat-value">{availableLabs.length}</div>
              <div className="stat-change">
                Avg. turnaround: {calculateAverageTurnaround(availableLabs)}
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
              <option value="All">All Statuses</option>
              <option value="Unassigned">Unassigned</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
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
            <label>Location:</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="All">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn secondary-btn"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("All");
              setPriorityFilter("All");
              setLocationFilter("All");
            }}
          >
            <span className="icon">🔄</span> Reset Filters
          </button>
        </div>

        <div className="bulk-actions">
          <div className="selection-info">
            <input
              type="checkbox"
              checked={
                selectedOrders.length > 0 &&
                selectedOrders.length === filteredOrders.length
              }
              onChange={selectAllOrders}
              indeterminate={
                selectedOrders.length > 0 &&
                selectedOrders.length < filteredOrders.length
              }
            />
            <span>
              {selectedOrders.length}{" "}
              {selectedOrders.length === 1 ? "order" : "orders"} selected
            </span>
          </div>

          <div className="action-buttons">
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              disabled={selectedOrders.length === 0}
            >
              <option value="">Bulk Actions</option>
              <option value="assign">Assign Selected</option>
              <option value="unassign">Unassign Selected</option>
            </select>
            <button
              className="btn small-btn"
              onClick={handleBulkAssignment}
              disabled={!bulkAction || selectedOrders.length === 0}
            >
              Apply
            </button>
          </div>
        </div>

        <div className="orders-table-container">
          <table>
            <thead>
              <tr>
                <th width="50px"></th>
                <th>Order ID</th>
                <th>Patient</th>
                <th>Test</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Lab</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className={order.status.toLowerCase()}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                      />
                    </td>
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
                    <td>{order.location}</td>
                    <td>
                      <span
                        className={`priority-badge ${order.priority.toLowerCase()}`}
                      >
                        {order.priority}
                      </span>
                    </td>
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
                      {order.assignedPhlebotomist
                        ? phlebotomists.find(
                            (p) => p.id === order.assignedPhlebotomist
                          )?.name || "Unknown"
                        : "—"}
                    </td>
                    <td>
                      {order.preferredLab
                        ? labs.find((l) => l.id === order.preferredLab)?.name ||
                          "Unknown"
                        : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="no-results-row">
                  <td colSpan="9">
                    <div className="no-results">
                      <div className="no-results-icon">🔍</div>
                      <h3>No orders found</h3>
                      <p>Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Assignment Modal */}
        {showAssignmentModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Assign Orders ({selectedOrders.length})</h2>

              <div className="form-group">
                <label>Select Lab:</label>
                <select
                  value={assignmentDetails.labId}
                  onChange={(e) =>
                    setAssignmentDetails({
                      ...assignmentDetails,
                      labId: e.target.value,
                    })
                  }
                >
                  <option value="">Select a lab</option>
                  {availableLabs.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name} ({lab.location}) - {lab.currentLoad}/
                      {lab.maxCapacity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Phlebotomist:</label>
                <select
                  value={assignmentDetails.phlebotomistId}
                  onChange={(e) =>
                    setAssignmentDetails({
                      ...assignmentDetails,
                      phlebotomistId: e.target.value,
                    })
                  }
                >
                  <option value="">Select a phlebotomist</option>
                  {availablePhlebotomists.map((phleb) => (
                    <option key={phleb.id} value={phleb.id}>
                      {phleb.name} ({phleb.currentLocation}) -{" "}
                      {phleb.currentAssignments}/{phleb.maxCapacity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button
                  className="btn secondary-btn"
                  onClick={() => setShowAssignmentModal(false)}
                >
                  Cancel
                </button>
                <button className="btn primary-btn" onClick={confirmAssignment}>
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Base styles */
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
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
            sans-serif;
        }

        .assignment-container {
          padding: 30px;
          max-width: 1600px;
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

        .primary-btn {
          background: linear-gradient(
            135deg,
            var(--primary-light) 0%,
            var(--primary-color) 100%
          );
          color: white;
          box-shadow: 0 4px 12px rgba(94, 13, 151, 0.2);
        }

        .primary-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(94, 13, 151, 0.3);
        }

        .primary-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .secondary-btn {
          background-color: var(--card-bg);
          color: var(--text-color);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid #e0e0e0;
        }

        .secondary-btn:hover {
          background-color: #f0f0f0;
        }

        .small-btn {
          padding: 6px 12px;
          font-size: 12px;
        }

        /* Stats cards */
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

        .stat-change {
          font-size: 12px;
          color: var(--text-light);
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

        /* Bulk actions */
        .bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding: 10px 15px;
          background-color: rgba(94, 13, 151, 0.05);
          border-radius: 8px;
        }

        .selection-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .selection-info input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .action-buttons select {
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          background-color: white;
          cursor: pointer;
        }

        /* Table styles */
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
        }

        tr:hover {
          background-color: #f9f9f9;
        }

        tr.unassigned {
          background-color: rgba(231, 76, 60, 0.05);
        }

        tr.assigned {
          background-color: rgba(46, 204, 113, 0.05);
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

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
          min-width: 80px;
          text-align: center;
        }

        .status-badge.unassigned {
          background-color: rgba(231, 76, 60, 0.1);
          color: var(--error-color);
        }

        .status-badge.assigned {
          background-color: rgba(52, 152, 219, 0.1);
          color: var(--info-color);
        }

        .status-badge.in-progress {
          background-color: rgba(243, 156, 18, 0.1);
          color: var(--warning-color);
        }

        .status-badge.completed {
          background-color: rgba(39, 174, 96, 0.1);
          color: var(--success-color);
        }

        /* No results */
        .no-results-row td {
          padding: 0;
        }

        .no-results {
          text-align: center;
          padding: 40px 20px;
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

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background-color: white;
          border-radius: 12px;
          padding: 30px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .modal h2 {
          margin-bottom: 20px;
          color: var(--text-color);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--text-color);
        }

        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 30px;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .filters-container {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box,
          .filter-group {
            width: 100%;
          }

          .bulk-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }

          .action-buttons {
            justify-content: flex-end;
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

// Helper function to calculate average turnaround time
function calculateAverageTurnaround(labs) {
  if (labs.length === 0) return "N/A";

  const totalHours = labs.reduce((sum, lab) => {
    const hours = parseInt(lab.turnaroundTime.replace("h", ""));
    return sum + (isNaN(hours) ? 0 : hours);
  }, 0);

  const average = totalHours / labs.length;
  return `${Math.round(average)}h`;
}

export default Assignment;
