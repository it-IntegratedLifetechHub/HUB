import React, { useState, useEffect } from "react";
import LabNav from "../../components/LabNav";
import {
  FaSearch,
  FaFilter,
  FaFileDownload,
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaEnvelope,
  FaEye,
  FaCalendarAlt,
  FaTimes,
  FaUserMd,
  FaUserCheck,
  FaNotesMedical,
} from "react-icons/fa";
import { MdPendingActions, MdOutlineMedicalServices } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { format, parseISO, isToday, isThisWeek, isThisMonth } from "date-fns";

const Reports = () => {
  // Sample report data with more realistic dates and additional fields
  const [reports, setReports] = useState([
    {
      id: "RPT-2023-1001",
      patientId: "PT-1001",
      patientName: "John Doe",
      patientAge: 42,
      patientGender: "Male",
      testType: "Complete Blood Count",
      status: "completed",
      dateCollected: "2023-06-15T09:30:00",
      dateCompleted: "2023-06-15T14:30:00",
      technician: "Dr. Sarah Johnson",
      verifiedBy: "Dr. Michael Brown",
      notes: "All parameters within normal range",
      results: {
        hemoglobin: "14.2 g/dL",
        wbc: "6.5 × 10³/μL",
        platelets: "250 × 10³/μL",
      },
    },
    {
      id: "RPT-2023-1002",
      patientId: "PT-1002",
      patientName: "Jane Smith",
      patientAge: 35,
      patientGender: "Female",
      testType: "Lipid Profile",
      status: "completed",
      dateCollected: "2023-06-15T08:15:00",
      dateCompleted: "2023-06-15T16:45:00",
      technician: "Dr. Lisa Wong",
      verifiedBy: "Dr. Michael Brown",
      notes: "Elevated LDL levels noted. Recommend dietary changes.",
      results: {
        cholesterol: "220 mg/dL",
        hdl: "45 mg/dL",
        ldl: "160 mg/dL",
        triglycerides: "180 mg/dL",
      },
    },
    {
      id: "RPT-2023-1003",
      patientId: "PT-1003",
      patientName: "Robert Chen",
      patientAge: 58,
      patientGender: "Male",
      testType: "Thyroid Panel",
      status: "pending-review",
      dateCollected: "2023-06-14T10:20:00",
      dateCompleted: "2023-06-14T11:20:00",
      technician: "Dr. David Kim",
      verifiedBy: "",
      notes: "Pending senior review due to abnormal TSH levels",
      results: {
        tsh: "5.8 mIU/L",
        t4: "1.1 ng/dL",
        t3: "120 ng/dL",
      },
    },
    {
      id: "RPT-2023-1004",
      patientId: "PT-1004",
      patientName: "Emily Wilson",
      patientAge: 29,
      patientGender: "Female",
      testType: "Liver Function Test",
      status: "completed",
      dateCollected: "2023-06-14T08:45:00",
      dateCompleted: "2023-06-14T09:15:00",
      technician: "Dr. Sarah Johnson",
      verifiedBy: "Dr. Michael Brown",
      notes: "Slightly elevated ALT. Possible mild liver inflammation.",
      results: {
        ast: "35 U/L",
        alt: "48 U/L",
        alp: "110 U/L",
        bilirubin: "1.0 mg/dL",
      },
    },
    {
      id: "RPT-2023-1005",
      patientId: "PT-1005",
      patientName: "Michael Brown",
      patientAge: 50,
      patientGender: "Male",
      testType: "COVID-19 PCR",
      status: "completed",
      dateCollected: "2023-06-13T17:30:00",
      dateCompleted: "2023-06-13T18:30:00",
      technician: "Dr. Lisa Wong",
      verifiedBy: "Dr. Sarah Johnson",
      notes: "Negative result. No detection of SARS-CoV-2 RNA.",
      results: {
        result: "Negative",
        ctValue: "Not detected",
      },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [exportAllFormat, setExportAllFormat] = useState(null);

  // Filter reports based on search and filters
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.testType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    const reportDate = parseISO(report.dateCompleted);
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && isToday(reportDate)) ||
      (dateFilter === "week" && isThisWeek(reportDate)) ||
      (dateFilter === "month" && isThisMonth(reportDate));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <span className="status-badge completed">Completed</span>;
      case "pending-review":
        return <span className="status-badge pending">Pending Review</span>;
      default:
        return <span className="status-badge">Unknown</span>;
    }
  };

  const exportReport = (format, reportId = null) => {
    if (reportId) {
      // Single report export
      console.log(`Exporting report ${reportId} as ${format}`);
      alert(`Report ${reportId} exported as ${format.toUpperCase()}`);
    } else {
      // Export all filtered reports
      console.log(`Exporting ${filteredReports.length} reports as ${format}`);
      alert(
        `Exported ${filteredReports.length} reports as ${format.toUpperCase()}`
      );
    }
  };

  const viewReportDetails = (report) => {
    setSelectedReport(report);
  };

  const closeModal = () => {
    setSelectedReport(null);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return format(parseISO(dateString), "MMM dd, yyyy h:mm a");
  };

  const getStats = () => {
    return {
      total: reports.length,
      completed: reports.filter((r) => r.status === "completed").length,
      pending: reports.filter((r) => r.status === "pending-review").length,
      today: reports.filter((r) => isToday(parseISO(r.dateCompleted))).length,
    };
  };

  return (
    <div className="lab-reports">
      {/* Header and Controls */}
      <div className="reports-header">
        <div>
          <h1>Test Reports</h1>
          <div className="stats-summary">
            <span>
              <strong>{getStats().total}</strong> Total
            </span>
            <span>
              <strong>{getStats().completed}</strong> Completed
            </span>
            <span>
              <strong>{getStats().pending}</strong> Pending Review
            </span>
            <span>
              <strong>{getStats().today}</strong> Today
            </span>
          </div>
        </div>
        <div className="controls">
          <div className="dropdown">
            <button className="export-all-btn">
              <FaFileDownload /> Export All
            </button>
            <div className="dropdown-menu">
              <button onClick={() => exportReport("pdf")}>
                <FaFilePdf /> PDF
              </button>
              <button onClick={() => exportReport("excel")}>
                <FaFileExcel /> Excel
              </button>
            </div>
          </div>
          <button className="print-btn">
            <FaPrint /> Print All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search reports by ID, patient, or test type..."
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
            <option value="completed">Completed</option>
            <option value="pending-review">Pending Review</option>
          </select>
        </div>

        <div className="filter-group">
          <FaCalendarAlt className="filter-icon" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="reports-table-container">
        {filteredReports.length === 0 ? (
          <div className="no-results">
            <MdOutlineMedicalServices className="no-results-icon" />
            <h3>No reports found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <table className="reports-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Patient</th>
                <th>Test Type</th>
                <th>Status</th>
                <th>Date Completed</th>
                <th>Technician</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className={report.status}>
                  <td>{report.id}</td>
                  <td>
                    <div className="patient-info">
                      <div className="patient-name">{report.patientName}</div>
                      <div className="patient-id">{report.patientId}</div>
                    </div>
                  </td>
                  <td>{report.testType}</td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>{formatDateTime(report.dateCompleted)}</td>
                  <td>{report.technician}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view-btn"
                        onClick={() => viewReportDetails(report)}
                      >
                        <FaEye /> View
                      </button>
                      <div className="dropdown">
                        <button className="dropdown-toggle">
                          <BsThreeDotsVertical />
                        </button>
                        <div className="dropdown-menu">
                          <button
                            onClick={() => exportReport("pdf", report.id)}
                          >
                            <FaFilePdf /> PDF
                          </button>
                          <button
                            onClick={() => exportReport("excel", report.id)}
                          >
                            <FaFileExcel /> Excel
                          </button>
                          <button>
                            <FaEnvelope /> Email
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="modal-overlay">
          <div className="report-modal">
            <div className="modal-header">
              <h2>Report Details</h2>
              <button className="close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <div className="report-content">
              <div className="report-header">
                <div className="header-left">
                  <h3>{selectedReport.testType}</h3>
                  <div className="report-meta">
                    <span>
                      <strong>Report ID:</strong> {selectedReport.id}
                    </span>
                    <span>
                      <strong>Date Completed:</strong>{" "}
                      {formatDateTime(selectedReport.dateCompleted)}
                    </span>
                  </div>
                </div>
                <div className="status-display">
                  {getStatusBadge(selectedReport.status)}
                </div>
              </div>

              <div className="patient-section">
                <h4>Patient Information</h4>
                <div className="patient-details">
                  <div>
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">
                      {selectedReport.patientName}
                    </span>
                  </div>
                  <div>
                    <span className="detail-label">ID:</span>
                    <span className="detail-value">
                      {selectedReport.patientId}
                    </span>
                  </div>
                  <div>
                    <span className="detail-label">Age/Gender:</span>
                    <span className="detail-value">
                      {selectedReport.patientAge} /{" "}
                      {selectedReport.patientGender}
                    </span>
                  </div>
                  <div>
                    <span className="detail-label">Date Collected:</span>
                    <span className="detail-value">
                      {formatDateTime(selectedReport.dateCollected)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="results-section">
                <h4>Test Results</h4>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Result</th>
                      <th>Reference Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedReport.results).map(
                      ([key, value]) => (
                        <tr key={key}>
                          <td>{key.toUpperCase()}</td>
                          <td>{value}</td>
                          <td>--</td>{" "}
                          {/* In a real app, you'd have reference ranges */}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              <div className="personnel-section">
                <h4>Personnel</h4>
                <div className="personnel-details">
                  <div>
                    <span className="detail-label">
                      <FaUserMd /> Technician:
                    </span>
                    <span className="detail-value">
                      {selectedReport.technician}
                    </span>
                  </div>
                  <div>
                    <span className="detail-label">
                      <FaUserCheck /> Verified By:
                    </span>
                    <span className="detail-value">
                      {selectedReport.verifiedBy || "Not verified"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="notes-section">
                <h4>
                  <FaNotesMedical /> Notes
                </h4>
                <div className="notes-content">{selectedReport.notes}</div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="action-btn print-btn"
                onClick={() => exportReport("pdf", selectedReport.id)}
              >
                <FaPrint /> Print Report
              </button>
              <button
                className="action-btn export-btn"
                onClick={() => exportReport("excel", selectedReport.id)}
              >
                <FaFileDownload /> Export Data
              </button>
              <button className="action-btn email-btn">
                <FaEnvelope /> Email Report
              </button>
              <button className="action-btn close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <LabNav />

      <style jsx>{`
        .lab-reports {
          padding: 2rem;
          padding-bottom: 6rem;
          max-width: 1600px;
          margin: 0 auto;
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        /* Header Styles */
        .reports-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .reports-header h1 {
          font-size: 1.8rem;
          color: #2b2d42;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .stats-summary {
          display: flex;
          gap: 1.5rem;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .stats-summary span {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .stats-summary strong {
          color: #2b2d42;
          font-weight: 600;
        }

        .controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .print-btn,
        .export-all-btn {
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

        .print-btn {
          background: #6c757d;
          color: white;
        }

        .print-btn:hover {
          background: #5a6268;
          transform: translateY(-2px);
        }

        .export-all-btn {
          background: #17a2b8;
          color: white;
        }

        .export-all-btn:hover {
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

        /* Reports Table */
        .reports-table-container {
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

        .reports-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .reports-table th {
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

        .reports-table td {
          padding: 1rem;
          border-bottom: 1px solid #e9ecef;
          font-size: 0.9rem;
          color: #2b2d42;
          vertical-align: middle;
        }

        .reports-table tr:last-child td {
          border-bottom: none;
        }

        .reports-table tr:hover td {
          background: rgba(94, 13, 151, 0.03);
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

        /* Status Badges */
        .status-badge {
          padding: 0.4rem 0.8rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          display: inline-block;
        }

        .status-badge.completed {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .status-badge.pending {
          background: #fff3e0;
          color: #e65100;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .action-btn {
          padding: 0.5rem 0.8rem;
          border-radius: 6px;
          border: none;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .action-btn:hover {
          transform: translateY(-1px);
        }

        .view-btn {
          background: #5e0d97;
          color: white;
        }

        .view-btn:hover {
          background: #7b00cc;
        }

        /* Dropdown Menu */
        .dropdown {
          position: relative;
          display: inline-block;
        }

        .dropdown-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          color: #495057;
          font-size: 1rem;
        }

        .dropdown-menu {
          position: absolute;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1;
          min-width: 160px;
          display: none;
        }

        .dropdown:hover .dropdown-menu {
          display: block;
        }

        .dropdown-menu button {
          width: 100%;
          text-align: left;
          padding: 0.7rem 1rem;
          border: none;
          background: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #2b2d42;
          font-size: 0.9rem;
        }

        .dropdown-menu button:hover {
          background: #f8f9fa;
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

        .report-modal {
          background: white;
          border-radius: 12px;
          padding: 2rem 2rem 7rem;
          width: 100%;
          max-width: 800px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .modal-header h2 {
          color: #2b2d42;
          font-size: 1.5rem;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #6c757d;
          padding: 0.5rem;
        }

        .close-btn:hover {
          color: #495057;
        }

        /* Report Content */
        .report-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .report-header h3 {
          margin: 0;
          color: #2b2d42;
          font-size: 1.3rem;
        }

        .report-meta {
          display: flex;
          gap: 1.5rem;
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #6c757d;
        }

        .report-meta strong {
          color: #495057;
        }

        .status-display {
          align-self: flex-start;
        }

        /* Sections */
        .patient-section,
        .results-section,
        .personnel-section,
        .notes-section {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.2rem;
        }

        .patient-section h4,
        .results-section h4,
        .personnel-section h4,
        .notes-section h4 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #2b2d42;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .patient-details {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .detail-label {
          display: block;
          font-size: 0.8rem;
          color: #6c757d;
          margin-bottom: 0.2rem;
        }

        .detail-value {
          display: block;
          font-size: 0.95rem;
          color: #2b2d42;
          font-weight: 500;
        }

        /* Results Table */
        .results-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        .results-table th,
        .results-table td {
          padding: 0.8rem;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        .results-table th {
          background: #f1f3f5;
          color: #495057;
          font-size: 0.8rem;
          text-transform: uppercase;
        }

        .results-table tr:last-child td {
          border-bottom: none;
        }

        /* Personnel */
        .personnel-details {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }

        /* Notes */
        .notes-content {
          background: white;
          padding: 1rem;
          border-radius: 6px;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        /* Modal Actions */
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .modal-actions .action-btn {
          padding: 0.7rem 1.2rem;
          font-size: 0.9rem;
        }

        .print-btn {
          background: #6c757d;
          color: white;
        }

        .print-btn:hover {
          background: #5a6268;
        }

        .export-btn {
          background: #17a2b8;
          color: white;
        }

        .export-btn:hover {
          background: #138496;
        }

        .email-btn {
          background: #5e0d97;
          color: white;
        }

        .email-btn:hover {
          background: #7b00cc;
        }

        .close-btn {
          background: #f8f9fa;
          color: #495057;
        }

        .close-btn:hover {
          background: #e9ecef;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .reports-table {
            min-width: 1000px;
          }
        }

        @media (max-width: 768px) {
          .reports-header {
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

          .report-modal {
            padding: 1.5rem;
            margin: 0 1rem;
          }

          .modal-actions {
            flex-direction: column;
          }

          .modal-actions .action-btn {
            width: 100%;
          }
        }

        @media (max-width: 576px) {
          .lab-reports {
            padding: 1rem;
            padding-bottom: 5rem;
          }

          .stats-summary {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }

          .patient-details,
          .personnel-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Reports;
