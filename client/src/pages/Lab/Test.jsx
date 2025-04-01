import React, { useState, useEffect } from "react";
import LabNav from "../../components/LabNav";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaFileDownload,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaVial,
  FaTimes,
} from "react-icons/fa";
import { MdPendingActions, MdOutlineMedicalServices } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { format, parseISO, isBefore, addHours } from "date-fns";

const Test = () => {
  // Sample test data with more realistic dates and additional fields
  const [tests, setTests] = useState([
    {
      id: "T-1001",
      sampleId: "SMP-2001",
      patient: "John Doe",
      patientId: "PID-001",
      testType: "Complete Blood Count",
      status: "pending",
      priority: "routine",
      received: "2023-06-15T09:30:00",
      dueDate: "2023-06-16T17:00:00",
      technician: "Unassigned",
      notes: "",
    },
    {
      id: "T-1002",
      sampleId: "SMP-2002",
      patient: "Jane Smith",
      patientId: "PID-002",
      testType: "Lipid Profile",
      status: "in-progress",
      priority: "urgent",
      received: "2023-06-15T10:15:00",
      dueDate: "2023-06-15T18:00:00",
      technician: "Dr. Sarah Johnson",
      notes: "Patient fasting for 12 hours",
    },
    {
      id: "T-1003",
      sampleId: "SMP-2003",
      patient: "Robert Chen",
      patientId: "PID-003",
      testType: "Thyroid Panel",
      status: "completed",
      priority: "routine",
      received: "2023-06-14T14:20:00",
      dueDate: "2023-06-15T17:00:00",
      technician: "Dr. Michael Brown",
      notes: "Repeat test in 3 months",
    },
    {
      id: "T-1004",
      sampleId: "SMP-2004",
      patient: "Emily Wilson",
      patientId: "PID-004",
      testType: "Liver Function Test",
      status: "pending",
      priority: "high",
      received: "2023-06-14T16:45:00",
      dueDate: "2023-06-16T12:00:00",
      technician: "Unassigned",
      notes: "",
    },
    {
      id: "T-1005",
      sampleId: "SMP-2005",
      patient: "David Kim",
      patientId: "PID-005",
      testType: "COVID-19 PCR",
      status: "critical",
      priority: "stat",
      received: "2023-06-14T18:30:00",
      dueDate: "2023-06-15T09:00:00",
      technician: "Dr. Lisa Wong",
      notes: "Isolation protocol required",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [showTestDetails, setShowTestDetails] = useState(null);
  const [newTest, setNewTest] = useState({
    sampleId: "",
    patient: "",
    patientId: "",
    testType: "",
    priority: "routine",
    notes: "",
  });

  // Calculate overdue tests
  const calculateOverdue = (test) => {
    if (!test.dueDate) return false;
    const dueDate = parseISO(test.dueDate);
    return isBefore(dueDate, new Date()) && test.status !== "completed";
  };

  // Filter tests based on search and filters
  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || test.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || test.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort tests by priority and due date
  const sortedTests = [...filteredTests].sort((a, b) => {
    // Priority order: stat > urgent > high > routine
    const priorityOrder = { stat: 4, urgent: 3, high: 2, routine: 1 };
    if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    // Then sort by due date (earlier first)
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const getStatusIcon = (status) => {
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

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "stat":
        return <span className="priority-badge stat">STAT</span>;
      case "urgent":
        return <span className="priority-badge urgent">URGENT</span>;
      case "high":
        return <span className="priority-badge high">HIGH</span>;
      default:
        return <span className="priority-badge routine">ROUTINE</span>;
    }
  };

  const handleAddTest = () => {
    // Calculate due date based on priority
    const now = new Date();
    let dueDate = new Date();

    switch (newTest.priority) {
      case "stat":
        dueDate = addHours(now, 2); // 2 hours for STAT
        break;
      case "urgent":
        dueDate = addHours(now, 8); // 8 hours for urgent
        break;
      case "high":
        dueDate = addHours(now, 24); // 24 hours for high
        break;
      default:
        dueDate = addHours(now, 48); // 48 hours for routine
    }

    const testToAdd = {
      id: `T-${1000 + tests.length + 1}`,
      sampleId: newTest.sampleId,
      patient: newTest.patient,
      patientId: newTest.patientId,
      testType: newTest.testType,
      status: "pending",
      priority: newTest.priority,
      received: now.toISOString(),
      dueDate: dueDate.toISOString(),
      technician: "Unassigned",
      notes: newTest.notes,
    };

    setTests([...tests, testToAdd]);
    setShowAddTestModal(false);
    setNewTest({
      sampleId: "",
      patient: "",
      patientId: "",
      testType: "",
      priority: "routine",
      notes: "",
    });
  };

  const updateTestStatus = (testId, newStatus) => {
    setTests(
      tests.map((test) =>
        test.id === testId ? { ...test, status: newStatus } : test
      )
    );
  };

  const assignToSelf = (testId) => {
    setTests(
      tests.map((test) =>
        test.id === testId ? { ...test, technician: "You" } : test
      )
    );
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return format(parseISO(dateString), "MMM dd, yyyy h:mm a");
  };

  return (
    <div className="lab-tests">
      {/* Header and Controls */}
      <div className="tests-header">
        <div>
          <h1>Test Management</h1>
          <p className="stats-summary">
            {tests.filter((t) => t.status === "pending").length} Pending •
            {tests.filter((t) => t.status === "in-progress").length} In Progress
            •{tests.filter((t) => t.status === "completed").length} Completed •
            {tests.filter((t) => calculateOverdue(t)).length} Overdue
          </p>
        </div>
        <div className="controls">
          <button
            className="add-test-btn"
            onClick={() => setShowAddTestModal(true)}
          >
            <FaPlus /> Add Test
          </button>
          <button className="export-btn">
            <FaFileDownload /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tests by ID, sample, patient, or test type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              <FaTimes />
            </button>
          )}
        </div>

        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="stat">STAT</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="routine">Routine</option>
          </select>
        </div>
      </div>

      {/* Tests Table */}
      <div className="tests-table-container">
        {sortedTests.length === 0 ? (
          <div className="no-results">
            <FaVial className="no-results-icon" />
            <h3>No tests found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <table className="tests-table">
            <thead>
              <tr>
                <th>Test ID</th>
                <th>Sample ID</th>
                <th>Patient</th>
                <th>Test Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Received</th>
                <th>Due Date</th>
                <th>Technician</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTests.map((test) => (
                <tr
                  key={test.id}
                  className={`
                    ${test.status} 
                    ${calculateOverdue(test) ? "overdue" : ""}
                  `}
                >
                  <td>{test.id}</td>
                  <td>{test.sampleId}</td>
                  <td>
                    <div className="patient-info">
                      <div className="patient-name">{test.patient}</div>
                      <div className="patient-id">{test.patientId}</div>
                    </div>
                  </td>
                  <td>{test.testType}</td>
                  <td>{getPriorityBadge(test.priority)}</td>
                  <td>
                    <span className={`status-badge ${test.status}`}>
                      {getStatusIcon(test.status)}
                      {test.status.replace("-", " ")}
                      {calculateOverdue(test) && (
                        <span className="overdue-badge">OVERDUE</span>
                      )}
                    </span>
                  </td>
                  <td>{formatDateTime(test.received)}</td>
                  <td
                    className={
                      calculateOverdue(test) ? "due-date overdue" : "due-date"
                    }
                  >
                    {formatDateTime(test.dueDate)}
                  </td>
                  <td>
                    <div className="technician-cell">
                      {test.technician}
                      {test.technician === "Unassigned" && (
                        <button
                          className="assign-btn"
                          onClick={() => assignToSelf(test.id)}
                        >
                          Assign to me
                        </button>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {test.status === "pending" && (
                        <button
                          className="action-btn start-btn"
                          onClick={() =>
                            updateTestStatus(test.id, "in-progress")
                          }
                        >
                          Start
                        </button>
                      )}
                      {test.status === "in-progress" && (
                        <button
                          className="action-btn complete-btn"
                          onClick={() => updateTestStatus(test.id, "completed")}
                        >
                          Complete
                        </button>
                      )}
                      <button
                        className="action-btn details-btn"
                        onClick={() => setShowTestDetails(test)}
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Test Modal */}
      {showAddTestModal && (
        <div className="modal-overlay">
          <div className="add-test-modal">
            <div className="modal-header">
              <h2>Add New Test</h2>
              <button
                className="close-modal"
                onClick={() => setShowAddTestModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="form-group">
              <label>Sample ID:</label>
              <input
                type="text"
                value={newTest.sampleId}
                onChange={(e) =>
                  setNewTest({ ...newTest, sampleId: e.target.value })
                }
                placeholder="Enter sample identifier"
              />
            </div>
            <div className="form-group">
              <label>Patient Name:</label>
              <input
                type="text"
                value={newTest.patient}
                onChange={(e) =>
                  setNewTest({ ...newTest, patient: e.target.value })
                }
                placeholder="Patient full name"
              />
            </div>
            <div className="form-group">
              <label>Patient ID:</label>
              <input
                type="text"
                value={newTest.patientId}
                onChange={(e) =>
                  setNewTest({ ...newTest, patientId: e.target.value })
                }
                placeholder="Patient identifier"
              />
            </div>
            <div className="form-group">
              <label>Test Type:</label>
              <input
                type="text"
                value={newTest.testType}
                onChange={(e) =>
                  setNewTest({ ...newTest, testType: e.target.value })
                }
                placeholder="Test name or panel"
              />
            </div>
            <div className="form-group">
              <label>Priority:</label>
              <select
                value={newTest.priority}
                onChange={(e) =>
                  setNewTest({ ...newTest, priority: e.target.value })
                }
              >
                <option value="routine">Routine (48h turnaround)</option>
                <option value="high">High (24h turnaround)</option>
                <option value="urgent">Urgent (8h turnaround)</option>
                <option value="stat">STAT (2h turnaround)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Notes:</label>
              <textarea
                value={newTest.notes}
                onChange={(e) =>
                  setNewTest({ ...newTest, notes: e.target.value })
                }
                placeholder="Any special instructions"
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowAddTestModal(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={handleAddTest}
                disabled={
                  !newTest.sampleId || !newTest.patient || !newTest.testType
                }
              >
                Add Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Details Modal */}
      {showTestDetails && (
        <div className="modal-overlay">
          <div className="test-details-modal">
            <div className="modal-header">
              <h2>Test Details</h2>
              <button
                className="close-modal"
                onClick={() => setShowTestDetails(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Test ID:</span>
                <span className="detail-value">{showTestDetails.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Sample ID:</span>
                <span className="detail-value">{showTestDetails.sampleId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Patient:</span>
                <span className="detail-value">
                  {showTestDetails.patient} ({showTestDetails.patientId})
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Test Type:</span>
                <span className="detail-value">{showTestDetails.testType}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Priority:</span>
                <span className="detail-value">
                  {getPriorityBadge(showTestDetails.priority)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value">
                  <span className={`status-badge ${showTestDetails.status}`}>
                    {getStatusIcon(showTestDetails.status)}
                    {showTestDetails.status.replace("-", " ")}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Received:</span>
                <span className="detail-value">
                  {formatDateTime(showTestDetails.received)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Due Date:</span>
                <span
                  className={`detail-value ${
                    calculateOverdue(showTestDetails) ? "overdue" : ""
                  }`}
                >
                  {formatDateTime(showTestDetails.dueDate)}
                  {calculateOverdue(showTestDetails) && (
                    <span className="overdue-badge">OVERDUE</span>
                  )}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Technician:</span>
                <span className="detail-value">
                  {showTestDetails.technician}
                </span>
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Notes:</span>
                <span className="detail-value">
                  {showTestDetails.notes || "No notes available"}
                </span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowTestDetails(null)}
              >
                Close
              </button>
              {showTestDetails.status === "pending" && (
                <button
                  className="action-btn start-btn"
                  onClick={() => {
                    updateTestStatus(showTestDetails.id, "in-progress");
                    setShowTestDetails(null);
                  }}
                >
                  Start Test
                </button>
              )}
              {showTestDetails.status === "in-progress" && (
                <button
                  className="action-btn complete-btn"
                  onClick={() => {
                    updateTestStatus(showTestDetails.id, "completed");
                    setShowTestDetails(null);
                  }}
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <LabNav />

      <style jsx>{`
        .lab-tests {
          padding: 2rem;
          padding-bottom: 6rem;
          max-width: 1600px;
          margin: 0 auto;
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        /* Header Styles */
        .tests-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .tests-header h1 {
          font-size: 1.8rem;
          color: #2b2d42;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .stats-summary {
          color: #6c757d;
          font-size: 0.9rem;
          display: flex;
          gap: 1rem;
        }

        .controls {
          display: flex;
          gap: 1rem;
        }

        .add-test-btn,
        .export-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.2rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .add-test-btn {
          background: #5e0d97;
          color: white;
        }

        .add-test-btn:hover {
          background: #7b00cc;
          transform: translateY(-2px);
        }

        .export-btn {
          background: #17a2b8;
          color: white;
        }

        .export-btn:hover {
          background: #138496;
          transform: translateY(-2px);
        }

        /* Filters */
        .filters {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          align-items: center;
          background: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .search-box {
          display: flex;
          align-items: center;
          background: #f8f9fa;
          padding: 0.7rem 1rem;
          border-radius: 8px;
          width: 300px;
          position: relative;
        }

        .search-box input {
          border: none;
          background: transparent;
          outline: none;
          margin-left: 0.5rem;
          width: 100%;
          color: #2b2d42;
          padding-right: 1.5rem;
        }

        .search-icon {
          color: #6c757d;
        }

        .clear-search {
          position: absolute;
          right: 0.8rem;
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 0.2rem;
          display: flex;
          align-items: center;
        }

        .clear-search:hover {
          color: #495057;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8f9fa;
          padding: 0.7rem 1rem;
          border-radius: 8px;
        }

        .filter-icon {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .filter-group select {
          border: none;
          background: transparent;
          outline: none;
          cursor: pointer;
          color: #2b2d42;
          font-size: 0.9rem;
        }

        /* Tests Table */
        .tests-table-container {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow-x: auto;
          min-height: 300px;
        }

        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #6c757d;
        }

        .no-results-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #adb5bd;
        }

        .no-results h3 {
          margin-bottom: 0.5rem;
          color: #495057;
        }

        .tests-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .tests-table th {
          text-align: left;
          padding: 1rem;
          background: #f1f3f5;
          color: #495057;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: sticky;
          top: 0;
        }

        .tests-table td {
          padding: 1rem;
          border-bottom: 1px solid #e9ecef;
          font-size: 0.9rem;
          color: #2b2d42;
          vertical-align: middle;
        }

        .tests-table tr:last-child td {
          border-bottom: none;
        }

        .tests-table tr:hover td {
          background: rgba(94, 13, 151, 0.03);
        }

        .tests-table tr.overdue td {
          background: rgba(220, 53, 69, 0.05);
        }

        .tests-table tr.overdue:hover td {
          background: rgba(220, 53, 69, 0.08);
        }

        /* Patient Info */
        .patient-info {
          display: flex;
          flex-direction: column;
        }

        .patient-name {
          font-weight: 500;
        }

        .patient-id {
          font-size: 0.8rem;
          color: #6c757d;
        }

        /* Priority Badges */
        .priority-badge {
          font-size: 0.7rem;
          padding: 0.3rem 0.6rem;
          border-radius: 12px;
          font-weight: 700;
          display: inline-block;
        }

        .priority-badge.stat {
          background: #ffebee;
          color: #c62828;
        }

        .priority-badge.urgent {
          background: #ffecb3;
          color: #ff8f00;
        }

        .priority-badge.high {
          background: #bbdefb;
          color: #1565c0;
        }

        .priority-badge.routine {
          background: #e8f5e9;
          color: #2e7d32;
        }

        /* Status Badges */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.8rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          position: relative;
        }

        .status-icon {
          font-size: 1rem;
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

        /* Overdue Badge */
        .overdue-badge {
          margin-left: 0.5rem;
          background: #dc3545;
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: bold;
        }

        .due-date.overdue {
          color: #dc3545;
          font-weight: 500;
        }

        /* Technician Cell */
        .technician-cell {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .assign-btn {
          background: none;
          border: 1px solid #5e0d97;
          color: #5e0d97;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .assign-btn:hover {
          background: rgba(94, 13, 151, 0.1);
        }

        /* Action Buttons */
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
          white-space: nowrap;
        }

        .action-btn:hover {
          transform: translateY(-1px);
        }

        .start-btn {
          background: #17a2b8;
          color: white;
        }

        .start-btn:hover {
          background: #138496;
        }

        .complete-btn {
          background: #28a745;
          color: white;
        }

        .complete-btn:hover {
          background: #218838;
        }

        .details-btn {
          background: #6c757d;
          color: white;
        }

        .details-btn:hover {
          background: #5a6268;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(2px);
        }

        .add-test-modal,
        .test-details-modal {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          width: 100%;
          max-width: 600px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-header h2 {
          color: #2b2d42;
          margin: 0;
        }

        .close-modal {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #6c757d;
          cursor: pointer;
          padding: 0.5rem;
        }

        .close-modal:hover {
          color: #495057;
        }

        .form-group {
          margin-bottom: 1.2rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #495057;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.8rem;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #5e0d97;
          outline: none;
        }

        .form-group textarea {
          resize: vertical;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .cancel-btn,
        .confirm-btn {
          padding: 0.7rem 1.2rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        .cancel-btn {
          background: #f8f9fa;
          color: #495057;
        }

        .cancel-btn:hover {
          background: #e9ecef;
        }

        .confirm-btn {
          background: #5e0d97;
          color: white;
        }

        .confirm-btn:hover {
          background: #7b00cc;
        }

        .confirm-btn:disabled {
          background: #adb5bd;
          cursor: not-allowed;
        }

        /* Test Details Modal */
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-item.full-width {
          grid-column: span 2;
        }

        .detail-label {
          font-size: 0.8rem;
          color: #6c757d;
          margin-bottom: 0.2rem;
        }

        .detail-value {
          font-size: 0.95rem;
          color: #2b2d42;
          font-weight: 500;
          word-break: break-word;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .tests-table {
            min-width: 1000px;
          }
        }

        @media (max-width: 768px) {
          .tests-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .controls {
            width: 100%;
            justify-content: space-between;
          }

          .filters {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            width: 100%;
          }

          .filter-group {
            width: 100%;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .detail-item.full-width {
            grid-column: span 1;
          }
        }

        @media (max-width: 576px) {
          .lab-tests {
            padding: 1rem;
            padding-bottom: 5rem;
          }

          .add-test-modal,
          .test-details-modal {
            padding: 1.5rem;
            margin: 0 1rem;
          }

          .modal-actions {
            flex-direction: column;
          }

          .cancel-btn,
          .confirm-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Test;
