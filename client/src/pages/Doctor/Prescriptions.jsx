import React, { useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiPrinter,
  FiDownload,
  FiClock,
  FiUser,
  FiCalendar,
} from "react-icons/fi";
import {
  FaPills,
  FaPrescriptionBottleAlt,
  FaRegCalendarCheck,
} from "react-icons/fa";
import DoctorNav from "../../components/DoctorNav";

const Prescriptions = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    refills: 0,
  });

  // Mock prescription data
  const prescriptionHistory = [
    {
      id: "RX20230615-001",
      patientId: "PT1001",
      patientName: "John Doe",
      date: "2023-06-15",
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      status: "Active",
      refills: 2,
    },
    {
      id: "RX20230610-002",
      patientId: "PT1002",
      patientName: "Jane Smith",
      date: "2023-06-10",
      medication: "Topiramate",
      dosage: "25mg",
      frequency: "Twice daily",
      status: "Completed",
      refills: 0,
    },
    {
      id: "RX20230528-003",
      patientId: "PT1003",
      patientName: "Robert Johnson",
      date: "2023-05-28",
      medication: "Albuterol Inhaler",
      dosage: "2 puffs",
      frequency: "Every 4 hours as needed",
      status: "Active",
      refills: 1,
    },
    {
      id: "RX20230515-004",
      patientId: "PT1001",
      patientName: "John Doe",
      date: "2023-05-15",
      medication: "Atorvastatin",
      dosage: "20mg",
      frequency: "At bedtime",
      status: "Completed",
      refills: 0,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Prescription submitted:", formData);
    setShowCreateModal(false);
    // Reset form
    setFormData({
      patientId: "",
      patientName: "",
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      refills: 0,
    });
  };

  const filteredPrescriptions = prescriptionHistory.filter(
    (prescription) =>
      prescription.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.medication
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="prescriptions-container">
      <DoctorNav />

      <div className="prescriptions-content">
        <div className="prescriptions-header">
          <h1>
            <FaPrescriptionBottleAlt /> Prescriptions Management
          </h1>
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === "create" ? "active" : ""}`}
              onClick={() => setActiveTab("create")}
            >
              <FiPlus /> Create Prescription
            </button>
            <button
              className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              <FaPills /> Prescription History
            </button>
          </div>
        </div>

        {activeTab === "create" ? (
          <div className="create-prescription-section">
            <div className="create-prescription-card">
              <h2>New Prescription</h2>
              <p>Select a patient to begin writing a new prescription</p>

              <div className="patient-search">
                <div className="search-bar">
                  <FiSearch className="search-icon" />
                  <input type="text" placeholder="Search patients..." />
                </div>
                <button
                  className="primary-btn"
                  onClick={() => setShowCreateModal(true)}
                >
                  <FiPlus /> Create New Prescription
                </button>
              </div>

              <div className="recent-patients">
                <h3>Recent Patients</h3>
                <div className="patient-grid">
                  {prescriptionHistory.slice(0, 3).map((patient) => (
                    <div
                      key={patient.patientId}
                      className="patient-card"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          patientId: patient.patientId,
                          patientName: patient.patientName,
                        });
                        setShowCreateModal(true);
                      }}
                    >
                      <div className="patient-avatar">
                        {patient.patientName.charAt(0)}
                      </div>
                      <h4>{patient.patientName}</h4>
                      <p>Last prescription: {patient.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="prescription-history-section">
            <div className="history-header">
              <div className="search-bar">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search prescriptions by patient, medication, or ID..."
                />
              </div>
              <div className="filter-options">
                <select>
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Completed</option>
                </select>
                <select>
                  <option>All Time</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 6 Months</option>
                </select>
              </div>
            </div>

            <div className="prescriptions-table">
              <div className="table-header">
                <div className="header-item">Prescription ID</div>
                <div className="header-item">Patient</div>
                <div className="header-item">Medication</div>
                <div className="header-item">Date</div>
                <div className="header-item">Status</div>
                <div className="header-item">Actions</div>
              </div>

              <div className="table-body">
                {filteredPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="table-row">
                    <div className="table-cell prescription-id">
                      {prescription.id}
                    </div>
                    <div className="table-cell patient-info">
                      <div className="patient-avatar-sm">
                        {prescription.patientName.charAt(0)}
                      </div>
                      {prescription.patientName}
                    </div>
                    <div className="table-cell medication">
                      <FaPills /> {prescription.medication}
                      <span className="dosage">{prescription.dosage}</span>
                    </div>
                    <div className="table-cell date">
                      <FiCalendar /> {prescription.date}
                    </div>
                    <div className="table-cell status">
                      <span
                        className={`status-badge ${prescription.status.toLowerCase()}`}
                      >
                        {prescription.status}
                      </span>
                    </div>
                    <div className="table-cell actions">
                      <button className="action-btn print">
                        <FiPrinter />
                      </button>
                      <button className="action-btn download">
                        <FiDownload />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Prescription Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Prescription</h2>
              <button
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Patient</label>
                <div className="patient-display">
                  <div className="patient-avatar-sm">
                    {formData.patientName.charAt(0) || "P"}
                  </div>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    placeholder="Search patient..."
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Medication</label>
                  <input
                    type="text"
                    name="medication"
                    value={formData.medication}
                    onChange={handleInputChange}
                    placeholder="e.g. Amoxicillin"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Dosage</label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    placeholder="e.g. 500mg"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Frequency</label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select frequency</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Every 4 hours">Every 4 hours</option>
                    <option value="As needed">As needed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g. 7 days"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Instructions</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  placeholder="Special instructions for the patient..."
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Refills</label>
                <input
                  type="number"
                  name="refills"
                  value={formData.refills}
                  onChange={handleInputChange}
                  min="0"
                  max="12"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Save & Print Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Main container styles */
        .prescriptions-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
        }

        .prescriptions-content {
          padding: 2rem;
          flex: 1;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .prescriptions-header {
          margin-bottom: 2rem;
        }

        .prescriptions-header h1 {
          color: #1e293b;
          font-size: 1.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        /* Tabs styles */
        .tabs-container {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 1.5rem;
        }

        .tab-btn {
          background: none;
          border: none;
          padding: 0.75rem 1.5rem;
          cursor: pointer;
          font-size: 0.95rem;
          color: #64748b;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 6px 6px 0 0;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: #6366f1;
          background-color: #f1f5f9;
        }

        .tab-btn.active {
          color: #6366f1;
          font-weight: 500;
          background-color: #f8fafc;
        }

        .tab-btn.active::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #6366f1;
        }

        /* Create Prescription Section */
        .create-prescription-section {
          background-color: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .create-prescription-card h2 {
          color: #1e293b;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .create-prescription-card p {
          color: #64748b;
          margin-bottom: 1.5rem;
        }

        .patient-search {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .search-bar {
          position: relative;
          flex: 1;
        }

        .search-bar input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .search-bar input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .primary-btn {
          background-color: #6366f1;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .primary-btn:hover {
          background-color: #4f46e5;
        }

        .recent-patients h3 {
          color: #1e293b;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .patient-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }

        .patient-card {
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.25rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .patient-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.05);
          border-color: #c7d2fe;
        }

        .patient-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .patient-card h4 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
          font-size: 1rem;
        }

        .patient-card p {
          margin: 0;
          color: #64748b;
          font-size: 0.85rem;
        }

        /* Prescription History Section */
        .prescription-history-section {
          background-color: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .filter-options {
          display: flex;
          gap: 0.75rem;
        }

        .filter-options select {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.9rem;
          color: #334155;
          background-color: white;
        }

        .prescriptions-table {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 0.8fr 0.8fr;
          background-color: #f1f5f9;
          padding: 0.75rem 1.25rem;
          font-weight: 600;
          color: #334155;
          font-size: 0.85rem;
        }

        .header-item {
          padding: 0.5rem;
        }

        .table-body {
          max-height: 500px;
          overflow-y: auto;
        }

        .table-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 0.8fr 0.8fr;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #e2e8f0;
          transition: background-color 0.2s;
        }

        .table-row:hover {
          background-color: #f8fafc;
        }

        .table-cell {
          padding: 0.5rem;
          display: flex;
          align-items: center;
          font-size: 0.9rem;
          color: #334155;
        }

        .prescription-id {
          font-family: "Roboto Mono", monospace;
          font-weight: 500;
          color: #6366f1;
        }

        .patient-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .patient-avatar-sm {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .medication {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dosage {
          margin-left: 0.5rem;
          font-size: 0.8rem;
          color: #64748b;
        }

        .date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.active {
          background-color: #dcfce7;
          color: #16a34a;
        }

        .status-badge.completed {
          background-color: #e0f2fe;
          color: #0369a1;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background-color: #f1f5f9;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background-color: #e2e8f0;
          color: #475569;
        }

        .action-btn.print:hover {
          color: #3b82f6;
        }

        .action-btn.download:hover {
          color: #10b981;
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background-color: white;
          border-radius: 12px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2rem;
          position: relative;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-header h2 {
          margin: 0;
          color: #1e293b;
          font-size: 1.5rem;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #94a3b8;
          padding: 0.25rem;
          transition: all 0.2s;
          border-radius: 4px;
        }

        .close-btn:hover {
          color: #ef4444;
          background-color: #fee2e2;
        }

        /* Form styles */
        form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-row {
          display: flex;
          gap: 1.25rem;
        }

        .form-group {
          flex: 1;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: #334155;
        }

        input,
        select,
        textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.95rem;
          transition: all 0.2s;
          background-color: white;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        textarea {
          min-height: 80px;
          resize: vertical;
        }

        .patient-display {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .patient-display input {
          flex: 1;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .secondary-btn {
          background-color: white;
          color: #64748b;
          border: 1px solid #e2e8f0;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .secondary-btn:hover {
          background-color: #f1f5f9;
          border-color: #cbd5e1;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .patient-search {
            flex-direction: column;
          }

          .history-header {
            flex-direction: column;
          }

          .filter-options {
            width: 100%;
          }

          .filter-options select {
            flex: 1;
          }

          .table-header,
          .table-row {
            grid-template-columns: repeat(3, 1fr);
          }

          .header-item:nth-child(4),
          .header-item:nth-child(5),
          .header-item:nth-child(6),
          .table-cell:nth-child(4),
          .table-cell:nth-child(5),
          .table-cell:nth-child(6) {
            display: none;
          }

          .form-row {
            flex-direction: column;
            gap: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .prescriptions-content {
            padding: 1rem;
          }

          .tabs-container {
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }

          .tab-btn {
            white-space: nowrap;
          }

          .create-prescription-section,
          .prescription-history-section {
            padding: 1.25rem;
          }

          .modal-content {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Prescriptions;
