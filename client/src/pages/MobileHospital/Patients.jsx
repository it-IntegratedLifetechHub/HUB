import React, { useState, useEffect } from "react";
import MobileHospitalNav from "../../components/MobileHospitalNav";

const Patients = () => {
  // Enhanced patient data structure
  const [patients, setPatients] = useState([
    {
      id: 1,
      personalInfo: {
        name: "Rahul Sharma",
        age: 45,
        gender: "Male",
        contact: "+91 9876543210",
        aadhar: "XXXX-XXXX-1234",
        address: "201, Sunshine Apartments, Andheri East, Mumbai 400069",
      },
      medicalInfo: {
        bloodGroup: "B+",
        allergies: "Penicillin",
        chronicConditions: ["Hypertension", "Diabetes"],
        medications: ["Metformin", "Amlodipine"],
      },
      visitDetails: {
        status: "active", // active, discharged, transferred, deceased
        emergencyType: "Cardiac Arrest",
        priority: "Critical",
        admissionDate: "2023-05-15T10:30:00",
        dischargeDate: null,
        attendingPhysician: "Dr. Patel",
        mobileUnit: "MH-AMB-001",
        location: { lat: 19.076, lng: 72.8777 },
        triageNotes: "Patient unconscious, family on scene",
      },
      vitals: [
        {
          timestamp: "2023-05-15T10:35:00",
          bp: "190/110",
          pulse: 120,
          temp: 98.6,
          oxygen: 96,
          glucose: "N/A",
          respiratoryRate: 22,
        },
        {
          timestamp: "2023-05-15T12:45:00",
          bp: "160/100",
          pulse: 98,
          temp: 98.4,
          oxygen: 97,
          glucose: "180 mg/dL",
          respiratoryRate: 18,
        },
      ],
      treatments: [
        {
          timestamp: "2023-05-15T10:40:00",
          treatment: "ECG Monitoring",
          medication: "Aspirin 325mg",
          notes: "ST elevation noted",
          staff: "Nurse Priya",
        },
        {
          timestamp: "2023-05-15T11:15:00",
          treatment: "IV Line",
          medication: "Nitroglycerin",
          notes: "BP stabilizing",
          staff: "Dr. Patel",
        },
      ],
      lastUpdated: "2023-05-15T14:45:00",
    },
    {
      id: 2,
      personalInfo: {
        name: "Priya Patel",
        age: 32,
        gender: "Female",
        contact: "+91 8765432109",
        aadhar: "XXXX-XXXX-5678",
        address: "34, Green Park Society, Kothrud, Pune 411038",
      },
      medicalInfo: {
        bloodGroup: "O+",
        allergies: "None",
        chronicConditions: [],
        medications: [],
      },
      visitDetails: {
        status: "discharged",
        emergencyType: "Fracture (Left Tibia)",
        priority: "Moderate",
        admissionDate: "2023-05-14T08:15:00",
        dischargeDate: "2023-05-15T11:20:00",
        attendingPhysician: "Dr. Kumar",
        mobileUnit: "MH-AMB-002",
        location: { lat: 18.5204, lng: 73.8567 },
        triageNotes: "Road accident, frontal collision",
      },
      vitals: [
        {
          timestamp: "2023-05-14T08:20:00",
          bp: "130/85",
          pulse: 90,
          temp: 98.2,
          oxygen: 98,
          glucose: "N/A",
          respiratoryRate: 16,
        },
      ],
      treatments: [
        {
          timestamp: "2023-05-14T08:30:00",
          treatment: "Splint Application",
          medication: "Ibuprofen 400mg",
          notes: "Closed fracture, no open wounds",
          staff: "Nurse Arjun",
        },
        {
          timestamp: "2023-05-14T09:45:00",
          treatment: "X-ray Imaging",
          medication: "None",
          notes: "Confirmed non-displaced fracture",
          staff: "Dr. Kumar",
        },
      ],
      lastUpdated: "2023-05-15T11:20:00",
    },
    {
      id: 3,
      personalInfo: {
        name: "Amit Singh",
        age: 28,
        gender: "Male",
        contact: "+91 7654321098",
        aadhar: "XXXX-XXXX-9012",
        address: "5th Cross, Koramangala, Bengaluru 560034",
      },
      medicalInfo: {
        bloodGroup: "A-",
        allergies: "Shellfish",
        chronicConditions: ["Type 1 Diabetes"],
        medications: ["Insulin Glargine"],
      },
      visitDetails: {
        status: "active",
        emergencyType: "Diabetic Emergency (Hypoglycemia)",
        priority: "High",
        admissionDate: "2023-05-16T09:45:00",
        dischargeDate: null,
        attendingPhysician: "Dr. Desai",
        mobileUnit: "MH-AMB-003",
        location: { lat: 12.9716, lng: 77.5946 },
        triageNotes: "Known diabetic, last ate 6 hours ago",
      },
      vitals: [
        {
          timestamp: "2023-05-16T09:50:00",
          bp: "100/60",
          pulse: 110,
          temp: 99.1,
          oxygen: 92,
          glucose: "45 mg/dL",
          respiratoryRate: 20,
        },
        {
          timestamp: "2023-05-16T10:30:00",
          bp: "110/70",
          pulse: 95,
          temp: 98.8,
          oxygen: 96,
          glucose: "120 mg/dL",
          respiratoryRate: 18,
        },
      ],
      treatments: [
        {
          timestamp: "2023-05-16T09:55:00",
          treatment: "IV Dextrose",
          medication: "D50W 25ml",
          notes: "Conscious but confused",
          staff: "Nurse Anjali",
        },
        {
          timestamp: "2023-05-16T10:15:00",
          treatment: "Oral Glucose",
          medication: "Juice + Crackers",
          notes: "Patient alert and oriented",
          staff: "Dr. Desai",
        },
      ],
      lastUpdated: "2023-05-16T12:30:00",
    },
  ]);

  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "admissionDate",
    direction: "desc",
  });
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState("overview");
  const [newVital, setNewVital] = useState({
    bp: "",
    pulse: "",
    temp: "",
    oxygen: "",
    glucose: "",
    respiratoryRate: "",
  });
  const [newTreatment, setNewTreatment] = useState({
    treatment: "",
    medication: "",
    notes: "",
    staff: "",
  });

  // Filter patients based on active tab and search term
  const filteredPatients = patients.filter((patient) => {
    const matchesTab =
      activeTab === "all" || patient.visitDetails.status === activeTab;
    const matchesSearch =
      patient.personalInfo.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.visitDetails.emergencyType
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.personalInfo.contact.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const aValue = a.visitDetails[sortConfig.key] || a[sortConfig.key];
    const bValue = b.visitDetails[sortConfig.key] || b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Handle sort request
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Update patient status
  const updatePatientStatus = (id, newStatus) => {
    const updatedPatients = patients.map((patient) => {
      if (patient.id === id) {
        const updatedVisitDetails = {
          ...patient.visitDetails,
          status: newStatus,
          dischargeDate:
            newStatus !== "active" ? new Date().toISOString() : null,
        };

        return {
          ...patient,
          visitDetails: updatedVisitDetails,
          lastUpdated: new Date().toISOString(),
        };
      }
      return patient;
    });
    setPatients(updatedPatients);
  };

  // View patient details
  const viewPatientDetails = (patient) => {
    setCurrentPatient(patient);
    setShowPatientModal(true);
    setActiveModalTab("overview");
  };

  // Close modal
  const closeModal = () => {
    setShowPatientModal(false);
    setCurrentPatient(null);
    setNewVital({
      bp: "",
      pulse: "",
      temp: "",
      oxygen: "",
      glucose: "",
      respiratoryRate: "",
    });
    setNewTreatment({
      treatment: "",
      medication: "",
      notes: "",
      staff: "",
    });
  };

  // Get status count
  const getStatusCount = (status) => {
    return patients.filter((p) => p.visitDetails.status === status).length;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time from date
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const options = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "priority-critical";
      case "High":
        return "priority-high";
      case "Moderate":
        return "priority-moderate";
      case "Low":
        return "priority-low";
      default:
        return "";
    }
  };

  // Add new vital signs
  const addVitalSigns = () => {
    if (!currentPatient) return;

    const vitalEntry = {
      timestamp: new Date().toISOString(),
      ...newVital,
    };

    const updatedPatients = patients.map((patient) => {
      if (patient.id === currentPatient.id) {
        return {
          ...patient,
          vitals: [...patient.vitals, vitalEntry],
          lastUpdated: new Date().toISOString(),
        };
      }
      return patient;
    });

    setPatients(updatedPatients);
    setCurrentPatient({
      ...currentPatient,
      vitals: [...currentPatient.vitals, vitalEntry],
      lastUpdated: new Date().toISOString(),
    });
    setNewVital({
      bp: "",
      pulse: "",
      temp: "",
      oxygen: "",
      glucose: "",
      respiratoryRate: "",
    });
  };

  // Add new treatment
  const addTreatment = () => {
    if (!currentPatient) return;

    const treatmentEntry = {
      timestamp: new Date().toISOString(),
      ...newTreatment,
    };

    const updatedPatients = patients.map((patient) => {
      if (patient.id === currentPatient.id) {
        return {
          ...patient,
          treatments: [...patient.treatments, treatmentEntry],
          lastUpdated: new Date().toISOString(),
        };
      }
      return patient;
    });

    setPatients(updatedPatients);
    setCurrentPatient({
      ...currentPatient,
      treatments: [...currentPatient.treatments, treatmentEntry],
      lastUpdated: new Date().toISOString(),
    });
    setNewTreatment({
      treatment: "",
      medication: "",
      notes: "",
      staff: "",
    });
  };

  // Open Google Maps with patient location
  const openPatientLocation = (lat, lng, address) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(
        address
      )}&travelmode=driving`
    );
  };

  return (
    <>
      <MobileHospitalNav />
      <div className="patients-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Patient Management Dashboard</h1>
              <p className="subtitle">Monitor and manage all patient cases</p>
            </div>
            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search patients by name, condition, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="stats-container">
            <div className="stat-card total-stat">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 12h2v5H7zm4-7h2v12h-2zm4 4h2v8h-2z"
                  />
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-count">{patients.length}</div>
                <div className="stat-label">Total Patients</div>
              </div>
            </div>
            <div className="stat-card active-stat">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"
                  />
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-count">{getStatusCount("active")}</div>
                <div className="stat-label">Active Cases</div>
              </div>
            </div>
            <div className="stat-card discharged-stat">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                  />
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-count">{getStatusCount("discharged")}</div>
                <div className="stat-label">Discharged</div>
              </div>
            </div>
            <div className="stat-card critical-stat">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                  />
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-count">
                  {
                    patients.filter(
                      (p) => p.visitDetails.priority === "Critical"
                    ).length
                  }
                </div>
                <div className="stat-label">Critical Cases</div>
              </div>
            </div>
          </div>

          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All Patients
              </button>
              <button
                className={`tab ${activeTab === "active" ? "active" : ""}`}
                onClick={() => setActiveTab("active")}
              >
                Active
              </button>
              <button
                className={`tab ${activeTab === "discharged" ? "active" : ""}`}
                onClick={() => setActiveTab("discharged")}
              >
                Discharged
              </button>
              <button
                className={`tab ${activeTab === "transferred" ? "active" : ""}`}
                onClick={() => setActiveTab("transferred")}
              >
                Transferred
              </button>
            </div>
            <div className="tab-indicator"></div>
          </div>
        </div>

        <div className="patients-table-container">
          <div className="table-wrapper">
            <table className="patients-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort("name")}>
                    <div className="th-content">
                      Patient Name
                      <span className="sort-icon">
                        {sortConfig.key === "name" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </span>
                    </div>
                  </th>
                  <th onClick={() => requestSort("age")}>
                    <div className="th-content">
                      Age
                      <span className="sort-icon">
                        {sortConfig.key === "age" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </span>
                    </div>
                  </th>
                  <th>Contact</th>
                  <th onClick={() => requestSort("emergencyType")}>
                    <div className="th-content">
                      Condition
                      <span className="sort-icon">
                        {sortConfig.key === "emergencyType" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </span>
                    </div>
                  </th>
                  <th>Priority</th>
                  <th onClick={() => requestSort("admissionDate")}>
                    <div className="th-content">
                      Admission
                      <span className="sort-icon">
                        {sortConfig.key === "admissionDate" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </span>
                    </div>
                  </th>
                  <th>Mobile Unit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedPatients.length > 0 ? (
                  sortedPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>
                        <span
                          className="patient-name"
                          onClick={() => viewPatientDetails(patient)}
                        >
                          {patient.personalInfo.name}
                        </span>
                      </td>
                      <td>{patient.personalInfo.age}</td>
                      <td>{patient.personalInfo.contact}</td>
                      <td>{patient.visitDetails.emergencyType}</td>
                      <td>
                        <span
                          className={`priority-badge ${getPriorityColor(
                            patient.visitDetails.priority
                          )}`}
                        >
                          {patient.visitDetails.priority}
                        </span>
                      </td>
                      <td>{formatDate(patient.visitDetails.admissionDate)}</td>
                      <td>{patient.visitDetails.mobileUnit}</td>
                      <td>
                        <span
                          className={`status-badge status-${patient.visitDetails.status}`}
                        >
                          {patient.visitDetails.status.charAt(0).toUpperCase() +
                            patient.visitDetails.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="view-button"
                            onClick={() => viewPatientDetails(patient)}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16">
                              <path
                                fill="currentColor"
                                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                              />
                            </svg>
                            View
                          </button>
                          {patient.visitDetails.status === "active" && (
                            <select
                              className="status-select"
                              value=""
                              onChange={(e) =>
                                updatePatientStatus(patient.id, e.target.value)
                              }
                            >
                              <option value="">Update Status</option>
                              <option value="discharged">Discharge</option>
                              <option value="transferred">Transfer</option>
                              <option value="deceased">Mark Deceased</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-patients">
                      <div className="empty-state">
                        <svg viewBox="0 0 24 24" width="48" height="48">
                          <path
                            fill="#bdc3c7"
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                          />
                        </svg>
                        <p>No patients found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient Details Modal */}
        {showPatientModal && currentPatient && (
          <div className="modal-overlay">
            <div className="patient-modal">
              <div className="modal-header">
                <div className="patient-header-info">
                  <h2>
                    {currentPatient.personalInfo.name}
                    <span className="patient-age-gender">
                      {currentPatient.personalInfo.age} /{" "}
                      {currentPatient.personalInfo.gender}
                    </span>
                  </h2>
                  <div className="patient-status">
                    <span
                      className={`status-badge status-${currentPatient.visitDetails.status}`}
                    >
                      {currentPatient.visitDetails.status
                        .charAt(0)
                        .toUpperCase() +
                        currentPatient.visitDetails.status.slice(1)}
                    </span>
                    <span
                      className={`priority-badge ${getPriorityColor(
                        currentPatient.visitDetails.priority
                      )}`}
                    >
                      {currentPatient.visitDetails.priority}
                    </span>
                  </div>
                </div>
                <button className="close-button" onClick={closeModal}>
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path
                      fill="currentColor"
                      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                    />
                  </svg>
                </button>
              </div>

              <div className="modal-tabs-container">
                <div className="modal-tabs">
                  <button
                    className={`modal-tab ${
                      activeModalTab === "overview" ? "active" : ""
                    }`}
                    onClick={() => setActiveModalTab("overview")}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path
                        fill="currentColor"
                        d={
                          activeModalTab === "overview"
                            ? "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                            : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                        }
                      />
                    </svg>
                    Overview
                  </button>
                  <button
                    className={`modal-tab ${
                      activeModalTab === "vitals" ? "active" : ""
                    }`}
                    onClick={() => setActiveModalTab("vitals")}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path
                        fill="currentColor"
                        d={
                          activeModalTab === "vitals"
                            ? "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 12h2v5H7zm4-7h2v12h-2zm4 4h2v8h-2z"
                            : "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"
                        }
                      />
                    </svg>
                    Vitals
                  </button>
                  <button
                    className={`modal-tab ${
                      activeModalTab === "treatments" ? "active" : ""
                    }`}
                    onClick={() => setActiveModalTab("treatments")}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path
                        fill="currentColor"
                        d={
                          activeModalTab === "treatments"
                            ? "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.26.33-.02.81.39.81h8.98c.41 0 .65-.47.4-.8l-2.55-3.39c-.19-.26-.59-.26-.79 0z"
                            : "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.26.33-.02.81.39.81h8.98c.41 0 .65-.47.4-.8l-2.55-3.39c-.19-.26-.59-.26-.79 0z"
                        }
                      />
                    </svg>
                    Treatments
                  </button>
                  <button
                    className={`modal-tab ${
                      activeModalTab === "location" ? "active" : ""
                    }`}
                    onClick={() => setActiveModalTab("location")}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path
                        fill="currentColor"
                        d={
                          activeModalTab === "location"
                            ? "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                            : "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"
                        }
                      />
                    </svg>
                    Location
                  </button>
                </div>
                <div className="modal-tab-indicator"></div>
              </div>

              <div className="modal-content">
                {activeModalTab === "overview" && (
                  <div className="overview-tab">
                    <div className="patient-info-section">
                      <h3>
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path
                            fill="currentColor"
                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                          />
                        </svg>
                        Personal Information
                      </h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-label">Name:</span>
                          <span className="info-value">
                            {currentPatient.personalInfo.name}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Age/Gender:</span>
                          <span className="info-value">
                            {currentPatient.personalInfo.age} /{" "}
                            {currentPatient.personalInfo.gender}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Contact:</span>
                          <span className="info-value">
                            {currentPatient.personalInfo.contact}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Aadhar:</span>
                          <span className="info-value">
                            {currentPatient.personalInfo.aadhar}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Address:</span>
                          <span className="info-value">
                            {currentPatient.personalInfo.address}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="medical-info-section">
                      <h3>
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path
                            fill="currentColor"
                            d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"
                          />
                        </svg>
                        Medical Information
                      </h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-label">Blood Group:</span>
                          <span className="info-value">
                            {currentPatient.medicalInfo.bloodGroup}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Allergies:</span>
                          <span className="info-value">
                            {currentPatient.medicalInfo.allergies || "None"}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">
                            Chronic Conditions:
                          </span>
                          <span className="info-value">
                            {currentPatient.medicalInfo.chronicConditions.join(
                              ", "
                            ) || "None"}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Medications:</span>
                          <span className="info-value">
                            {currentPatient.medicalInfo.medications.join(
                              ", "
                            ) || "None"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="visit-info-section">
                      <h3>
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path
                            fill="currentColor"
                            d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"
                          />
                        </svg>
                        Visit Information
                      </h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-label">Status:</span>
                          <span
                            className={`info-value status-${currentPatient.visitDetails.status}`}
                          >
                            {currentPatient.visitDetails.status
                              .charAt(0)
                              .toUpperCase() +
                              currentPatient.visitDetails.status.slice(1)}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Priority:</span>
                          <span
                            className={`info-value ${getPriorityColor(
                              currentPatient.visitDetails.priority
                            )}`}
                          >
                            {currentPatient.visitDetails.priority}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Admission Date:</span>
                          <span className="info-value">
                            {formatDate(
                              currentPatient.visitDetails.admissionDate
                            )}
                          </span>
                        </div>
                        {currentPatient.visitDetails.dischargeDate && (
                          <div className="info-item">
                            <span className="info-label">Discharge Date:</span>
                            <span className="info-value">
                              {formatDate(
                                currentPatient.visitDetails.dischargeDate
                              )}
                            </span>
                          </div>
                        )}
                        <div className="info-item">
                          <span className="info-label">
                            Attending Physician:
                          </span>
                          <span className="info-value">
                            {currentPatient.visitDetails.attendingPhysician}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Mobile Unit:</span>
                          <span className="info-value">
                            {currentPatient.visitDetails.mobileUnit}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Triage Notes:</span>
                          <span className="info-value">
                            {currentPatient.visitDetails.triageNotes}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="latest-vitals">
                      <h3>
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path
                            fill="currentColor"
                            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 12h2v5H7zm4-7h2v12h-2zm4 4h2v8h-2z"
                          />
                        </svg>
                        Latest Vitals
                      </h3>
                      {currentPatient.vitals.length > 0 ? (
                        <div className="vitals-grid">
                          <div className="vital-item">
                            <span className="vital-label">Blood Pressure:</span>
                            <span className="vital-value">
                              {currentPatient.vitals[0].bp}
                            </span>
                          </div>
                          <div className="vital-item">
                            <span className="vital-label">Pulse:</span>
                            <span className="vital-value">
                              {currentPatient.vitals[0].pulse} bpm
                            </span>
                          </div>
                          <div className="vital-item">
                            <span className="vital-label">Temperature:</span>
                            <span className="vital-value">
                              {currentPatient.vitals[0].temp} °F
                            </span>
                          </div>
                          <div className="vital-item">
                            <span className="vital-label">
                              Oxygen Saturation:
                            </span>
                            <span className="vital-value">
                              {currentPatient.vitals[0].oxygen}%
                            </span>
                          </div>
                          {currentPatient.vitals[0].glucose !== "N/A" && (
                            <div className="vital-item">
                              <span className="vital-label">Glucose:</span>
                              <span className="vital-value">
                                {currentPatient.vitals[0].glucose}
                              </span>
                            </div>
                          )}
                          <div className="vital-item">
                            <span className="vital-label">
                              Respiratory Rate:
                            </span>
                            <span className="vital-value">
                              {currentPatient.vitals[0].respiratoryRate} /min
                            </span>
                          </div>
                          <div className="vital-item">
                            <span className="vital-label">Time:</span>
                            <span className="vital-value">
                              {formatTime(currentPatient.vitals[0].timestamp)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p>No vitals recorded</p>
                      )}
                    </div>
                  </div>
                )}

                {activeModalTab === "vitals" && (
                  <div className="vitals-tab">
                    <div className="section-header">
                      <h3>Vital Signs History</h3>
                      <button
                        className="export-button"
                        onClick={() => alert("Export vitals data")}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path
                            fill="currentColor"
                            d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"
                          />
                        </svg>
                        Export
                      </button>
                    </div>
                    {currentPatient.vitals.length > 0 ? (
                      <>
                        <div className="table-responsive">
                          <table className="vitals-table">
                            <thead>
                              <tr>
                                <th>Time</th>
                                <th>BP</th>
                                <th>Pulse</th>
                                <th>Temp (°F)</th>
                                <th>O2 Sat (%)</th>
                                <th>Glucose</th>
                                <th>Resp. Rate</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentPatient.vitals.map((vital, index) => (
                                <tr key={index}>
                                  <td>{formatTime(vital.timestamp)}</td>
                                  <td>{vital.bp}</td>
                                  <td>{vital.pulse}</td>
                                  <td>{vital.temp}</td>
                                  <td>{vital.oxygen}</td>
                                  <td>{vital.glucose}</td>
                                  <td>{vital.respiratoryRate}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="add-vital-form">
                          <h4>Add New Vital Signs</h4>
                          <div className="form-grid">
                            <div className="form-group">
                              <label>Blood Pressure</label>
                              <input
                                type="text"
                                placeholder="120/80"
                                value={newVital.bp}
                                onChange={(e) =>
                                  setNewVital({
                                    ...newVital,
                                    bp: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Pulse (bpm)</label>
                              <input
                                type="number"
                                placeholder="72"
                                value={newVital.pulse}
                                onChange={(e) =>
                                  setNewVital({
                                    ...newVital,
                                    pulse: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Temperature (°F)</label>
                              <input
                                type="number"
                                step="0.1"
                                placeholder="98.6"
                                value={newVital.temp}
                                onChange={(e) =>
                                  setNewVital({
                                    ...newVital,
                                    temp: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>O2 Saturation (%)</label>
                              <input
                                type="number"
                                placeholder="98"
                                value={newVital.oxygen}
                                onChange={(e) =>
                                  setNewVital({
                                    ...newVital,
                                    oxygen: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Glucose</label>
                              <input
                                type="text"
                                placeholder="120 mg/dL"
                                value={newVital.glucose}
                                onChange={(e) =>
                                  setNewVital({
                                    ...newVital,
                                    glucose: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Respiratory Rate</label>
                              <input
                                type="number"
                                placeholder="16"
                                value={newVital.respiratoryRate}
                                onChange={(e) =>
                                  setNewVital({
                                    ...newVital,
                                    respiratoryRate: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <button
                            className="add-button"
                            onClick={addVitalSigns}
                            disabled={!newVital.bp || !newVital.pulse}
                          >
                            <svg viewBox="0 0 24 24" width="18" height="18">
                              <path
                                fill="currentColor"
                                d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                              />
                            </svg>
                            Add Vital Signs
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="no-vitals">
                        <div className="empty-state">
                          <svg viewBox="0 0 24 24" width="48" height="48">
                            <path
                              fill="#bdc3c7"
                              d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 12h2v5H7zm4-7h2v12h-2zm4 4h2v8h-2z"
                            />
                          </svg>
                          <p>No vitals recorded for this patient</p>
                        </div>
                        <div className="add-vital-form">
                          <h4>Add First Vital Signs</h4>
                          {/* Same form as above */}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeModalTab === "treatments" && (
                  <div className="treatments-tab">
                    <div className="section-header">
                      <h3>Treatment History</h3>
                      <button
                        className="export-button"
                        onClick={() => alert("Export treatment data")}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path
                            fill="currentColor"
                            d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"
                          />
                        </svg>
                        Export
                      </button>
                    </div>
                    {currentPatient.treatments.length > 0 ? (
                      <>
                        <div className="table-responsive">
                          <table className="treatments-table">
                            <thead>
                              <tr>
                                <th>Time</th>
                                <th>Treatment</th>
                                <th>Medication</th>
                                <th>Notes</th>
                                <th>Staff</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentPatient.treatments.map(
                                (treatment, index) => (
                                  <tr key={index}>
                                    <td>{formatTime(treatment.timestamp)}</td>
                                    <td>{treatment.treatment}</td>
                                    <td>{treatment.medication}</td>
                                    <td>{treatment.notes}</td>
                                    <td>{treatment.staff}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="add-treatment-form">
                          <h4>Add New Treatment</h4>
                          <div className="form-grid">
                            <div className="form-group">
                              <label>Treatment</label>
                              <input
                                type="text"
                                placeholder="IV Line, Splint, etc."
                                value={newTreatment.treatment}
                                onChange={(e) =>
                                  setNewTreatment({
                                    ...newTreatment,
                                    treatment: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Medication</label>
                              <input
                                type="text"
                                placeholder="Aspirin 325mg, etc."
                                value={newTreatment.medication}
                                onChange={(e) =>
                                  setNewTreatment({
                                    ...newTreatment,
                                    medication: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Notes</label>
                              <textarea
                                placeholder="Additional notes..."
                                value={newTreatment.notes}
                                onChange={(e) =>
                                  setNewTreatment({
                                    ...newTreatment,
                                    notes: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Staff</label>
                              <input
                                type="text"
                                placeholder="Your name"
                                value={newTreatment.staff}
                                onChange={(e) =>
                                  setNewTreatment({
                                    ...newTreatment,
                                    staff: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <button
                            className="add-button"
                            onClick={addTreatment}
                            disabled={
                              !newTreatment.treatment || !newTreatment.staff
                            }
                          >
                            <svg viewBox="0 0 24 24" width="18" height="18">
                              <path
                                fill="currentColor"
                                d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                              />
                            </svg>
                            Add Treatment
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="no-treatments">
                        <div className="empty-state">
                          <svg viewBox="0 0 24 24" width="48" height="48">
                            <path
                              fill="#bdc3c7"
                              d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.26.33-.02.81.39.81h8.98c.41 0 .65-.47.4-.8l-2.55-3.39c-.19-.26-.59-.26-.79 0z"
                            />
                          </svg>
                          <p>No treatments recorded for this patient</p>
                        </div>
                        <div className="add-treatment-form">
                          <h4>Add First Treatment</h4>
                          {/* Same form as above */}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeModalTab === "location" && (
                  <div className="location-tab">
                    <h3>Patient Location</h3>
                    <div className="location-info">
                      <div className="location-details">
                        <div className="location-item">
                          <span className="location-label">Address:</span>
                          <span className="location-value">
                            {currentPatient.personalInfo.address}
                          </span>
                        </div>
                        <div className="location-item">
                          <span className="location-label">Mobile Unit:</span>
                          <span className="location-value">
                            {currentPatient.visitDetails.mobileUnit}
                          </span>
                        </div>
                        <div className="location-item">
                          <span className="location-label">Coordinates:</span>
                          <span className="location-value">
                            {currentPatient.visitDetails.location.lat.toFixed(
                              4
                            )}
                            ,{" "}
                            {currentPatient.visitDetails.location.lng.toFixed(
                              4
                            )}
                          </span>
                        </div>
                      </div>

                      <button
                        className="map-button"
                        onClick={() =>
                          openPatientLocation(
                            currentPatient.visitDetails.location.lat,
                            currentPatient.visitDetails.location.lng,
                            currentPatient.personalInfo.address
                          )
                        }
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18">
                          <path
                            fill="currentColor"
                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                          />
                        </svg>
                        Open in Google Maps
                      </button>

                      <div className="map-container">
                        <iframe
                          width="100%"
                          height="300"
                          frameBorder="0"
                          style={{ border: 0 }}
                          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCyuT-iBobF8yIYhECIqGzoQDTh6rWN_HM&q=${currentPatient.visitDetails.location.lat},${currentPatient.visitDetails.location.lng}&zoom=15`}
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <div className="last-updated">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path
                      fill="#7f8c8d"
                      d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
                    />
                  </svg>
                  Last updated: {formatDate(currentPatient.lastUpdated)}
                </div>
                <div className="footer-buttons">
                  <button className="print-button">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path
                        fill="currentColor"
                        d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"
                      />
                    </svg>
                    Print Record
                  </button>
                  <button className="close-button" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Base Styles */
        :root {
          --primary-color: #4361ee;
          --primary-light: #e0e7ff;
          --secondary-color: #3f37c9;
          --success-color: #4cc9f0;
          --danger-color: #f72585;
          --warning-color: #f8961e;
          --info-color: #4895ef;
          --dark-color: #212529;
          --light-color: #f8f9fa;
          --gray-color: #6c757d;
          --border-color: #dee2e6;
          --border-radius: 8px;
          --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
            sans-serif;
          line-height: 1.6;
          color: var(--dark-color);
          background-color: #f5f7fb;
        }

        .patients-dashboard {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        /* Dashboard Header */
        .dashboard-header {
          margin-bottom: 30px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }

        .header-text h1 {
          color: var(--dark-color);
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
        }

        .header-text .subtitle {
          color: var(--gray-color);
          margin: 8px 0 0;
          font-size: 16px;
          font-weight: 400;
        }

        .search-container {
          position: relative;
          min-width: 300px;
          flex: 1;
          max-width: 500px;
        }

        .search-container input {
          width: 100%;
          padding: 12px 15px 12px 42px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          font-size: 14px;
          transition: var(--transition);
          background-color: white;
          box-shadow: var(--box-shadow);
        }

        .search-container input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: var(--gray-color);
        }

        /* Stats Container */
        .stats-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border-radius: var(--border-radius);
          padding: 20px;
          box-shadow: var(--box-shadow);
          display: flex;
          align-items: center;
          gap: 15px;
          transition: var(--transition);
          border-left: 4px solid transparent;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
        }

        .stat-count {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 5px;
          line-height: 1;
        }

        .stat-label {
          font-size: 14px;
          color: var(--gray-color);
          font-weight: 500;
        }

        .total-stat {
          border-left-color: var(--primary-color);
        }

        .total-stat .stat-icon {
          background-color: rgba(67, 97, 238, 0.1);
          color: var(--primary-color);
        }

        .active-stat {
          border-left-color: var(--success-color);
        }

        .active-stat .stat-icon {
          background-color: rgba(76, 201, 240, 0.1);
          color: var(--success-color);
        }

        .discharged-stat {
          border-left-color: #9b59b6;
        }

        .discharged-stat .stat-icon {
          background-color: rgba(155, 89, 182, 0.1);
          color: #9b59b6;
        }

        .critical-stat {
          border-left-color: var(--danger-color);
        }

        .critical-stat .stat-icon {
          background-color: rgba(247, 37, 133, 0.1);
          color: var(--danger-color);
        }

        /* Tabs */
        .tabs-container {
          position: relative;
          margin-bottom: 20px;
        }

        .tabs {
          display: flex;
          position: relative;
          z-index: 1;
        }

        .tab {
          padding: 12px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          color: var(--gray-color);
          position: relative;
          transition: var(--transition);
          font-size: 14px;
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          color: var(--primary-color);
          font-weight: 600;
        }

        .tab-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: var(--primary-color);
          transition: var(--transition);
        }

        /* Patients Table */
        .patients-table-container {
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          margin-bottom: 30px;
          overflow: hidden;
        }

        .table-wrapper {
          overflow-x: auto;
          padding: 5px;
        }

        .patients-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1000px;
        }

        .patients-table th {
          text-align: left;
          padding: 15px;
          background: #f8f9fa;
          color: var(--dark-color);
          font-weight: 600;
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .patients-table th:hover {
          background: #e9ecef;
        }

        .th-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sort-icon {
          font-size: 12px;
          color: var(--gray-color);
        }

        .patients-table td {
          padding: 15px;
          border-top: 1px solid var(--border-color);
          color: var(--dark-color);
          white-space: nowrap;
        }

        .patients-table tr:hover td {
          background: #f8f9fa;
        }

        .patient-name {
          color: var(--primary-color);
          cursor: pointer;
          font-weight: 500;
          transition: var(--transition);
          display: inline-block;
        }

        .patient-name:hover {
          text-decoration: underline;
          color: var(--secondary-color);
        }

        /* Badges */
        .priority-badge,
        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .priority-badge::before,
        .status-badge::before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 4px;
        }

        .priority-critical {
          background: #fee2e2;
          color: #b91c1c;
        }

        .priority-critical::before {
          background: #b91c1c;
        }

        .priority-high {
          background: #ffedd5;
          color: #9a3412;
        }

        .priority-high::before {
          background: #9a3412;
        }

        .priority-moderate {
          background: #fef3c7;
          color: #92400e;
        }

        .priority-moderate::before {
          background: #92400e;
        }

        .priority-low {
          background: #ecfccb;
          color: #365314;
        }

        .priority-low::before {
          background: #365314;
        }

        .status-active {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-active::before {
          background: #1e40af;
        }

        .status-discharged {
          background: #dcfce7;
          color: #166534;
        }

        .status-discharged::before {
          background: #166534;
        }

        .status-transferred {
          background: #f3e8ff;
          color: #5b21b6;
        }

        .status-transferred::before {
          background: #5b21b6;
        }

        .status-deceased {
          background: #fce7f3;
          color: #9d174d;
        }

        .status-deceased::before {
          background: #9d174d;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .view-button {
          padding: 8px 12px;
          background: var(--primary-light);
          color: var(--primary-color);
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition);
        }

        .view-button:hover {
          background: #d0d7ff;
        }

        .status-select {
          padding: 8px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          font-size: 13px;
          background: white;
          min-width: 120px;
          cursor: pointer;
          transition: var(--transition);
        }

        .status-select:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        /* No Patients */
        .no-patients {
          text-align: center;
          padding: 40px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: var(--gray-color);
        }

        .empty-state p {
          font-size: 16px;
          font-weight: 500;
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
          backdrop-filter: blur(5px);
        }

        .patient-modal {
          background: white;
          border-radius: var(--border-radius);
          width: 90%;
          max-width: 1000px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
        }

        .patient-header-info {
          flex: 1;
        }

        .modal-header h2 {
          margin: 0;
          color: var(--dark-color);
          font-size: 22px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .patient-age-gender {
          font-size: 16px;
          color: var(--gray-color);
          font-weight: 400;
        }

        .patient-status {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--gray-color);
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          border-radius: 50%;
          width: 32px;
          height: 32px;
        }

        .close-button:hover {
          background: #f5f5f5;
          color: var(--dark-color);
        }

        /* Modal Tabs */
        .modal-tabs-container {
          position: relative;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-tabs {
          display: flex;
          position: relative;
          z-index: 1;
        }

        .modal-tab {
          padding: 15px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          color: var(--gray-color);
          position: relative;
          transition: var(--transition);
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-tab.active {
          color: var(--primary-color);
          font-weight: 600;
        }

        .modal-tab-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: var(--primary-color);
          transition: var(--transition);
        }

        .modal-content {
          padding: 20px;
          flex: 1;
          overflow-y: auto;
        }

        /* Overview Tab */
        .overview-tab {
          display: grid;
          gap: 25px;
        }

        .patient-info-section,
        .medical-info-section,
        .visit-info-section,
        .latest-vitals {
          background: #f8f9fa;
          border-radius: var(--border-radius);
          padding: 20px;
        }

        .patient-info-section h3,
        .medical-info-section h3,
        .visit-info-section h3,
        .latest-vitals h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: var(--dark-color);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
        }

        .info-label {
          font-size: 13px;
          color: var(--gray-color);
          margin-bottom: 5px;
        }

        .info-value {
          font-weight: 500;
          font-size: 15px;
        }

        .vitals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }

        .vital-item {
          background: white;
          padding: 15px;
          border-radius: var(--border-radius);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .vital-label {
          display: block;
          color: var(--gray-color);
          font-size: 13px;
          margin-bottom: 6px;
        }

        .vital-value {
          font-weight: 600;
          font-size: 16px;
        }

        /* Vitals Tab */
        .vitals-tab {
          display: grid;
          gap: 25px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .section-header h3 {
          margin: 0;
          font-size: 18px;
        }

        .export-button {
          padding: 8px 12px;
          background: white;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
          border-radius: var(--border-radius);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition);
        }

        .export-button:hover {
          background: var(--primary-light);
        }

        .table-responsive {
          overflow-x: auto;
          margin-bottom: 20px;
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
        }

        .vitals-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }

        .vitals-table th,
        .vitals-table td {
          padding: 12px 15px;
          border: 1px solid var(--border-color);
          text-align: left;
        }

        .vitals-table th {
          background: #f8f9fa;
          font-weight: 600;
          position: sticky;
          top: 0;
        }

        .vitals-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .vitals-table tr:hover {
          background-color: #f1f1f1;
        }

        .add-vital-form {
          background: #f8f9fa;
          border-radius: var(--border-radius);
          padding: 20px;
        }

        .add-vital-form h4 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 16px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-size: 13px;
          margin-bottom: 8px;
          color: var(--dark-color);
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea {
          padding: 10px 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          font-size: 14px;
          transition: var(--transition);
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }

        .add-button {
          padding: 10px 16px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: var(--transition);
        }

        .add-button:hover {
          background: var(--secondary-color);
        }

        .add-button:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        /* Treatments Tab */
        .treatments-tab {
          display: grid;
          gap: 25px;
        }

        .treatments-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .treatments-table th,
        .treatments-table td {
          padding: 12px 15px;
          border: 1px solid var(--border-color);
          text-align: left;
        }

        .treatments-table th {
          background: #f8f9fa;
          font-weight: 600;
          position: sticky;
          top: 0;
        }

        .treatments-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .treatments-table tr:hover {
          background-color: #f1f1f1;
        }

        .add-treatment-form {
          background: #f8f9fa;
          border-radius: var(--border-radius);
          padding: 20px;
        }

        /* Location Tab */
        .location-tab {
          display: grid;
          gap: 15px;
        }

        .location-info {
          display: grid;
          gap: 15px;
        }

        .location-details {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 15px;
        }

        .location-item {
          display: flex;
          flex-direction: column;
        }

        .location-label {
          font-size: 13px;
          color: var(--gray-color);
          margin-bottom: 5px;
        }

        .location-value {
          font-weight: 500;
          font-size: 15px;
        }

        .map-button {
          padding: 10px 16px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-weight: 500;
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: var(--transition);
        }

        .map-button:hover {
          background: var(--secondary-color);
        }

        .map-container {
          margin-top: 15px;
          border-radius: var(--border-radius);
          overflow: hidden;
          border: 1px solid var(--border-color);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Modal Footer */
        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-top: 1px solid var(--border-color);
          background: #f8f9fa;
          position: sticky;
          bottom: 0;
        }

        .last-updated {
          font-size: 13px;
          color: var(--gray-color);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .footer-buttons {
          display: flex;
          gap: 10px;
        }

        .print-button {
          padding: 10px 16px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: var(--transition);
        }

        .print-button:hover {
          background: var(--secondary-color);
        }

        /* Responsive Styles */
        @media (max-width: 1200px) {
          .stats-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: stretch;
          }

          .search-container {
            width: 100%;
            max-width: 100%;
          }

          .tabs {
            overflow-x: auto;
            white-space: nowrap;
            padding-bottom: 5px;
          }

          .info-grid,
          .vitals-grid,
          .form-grid,
          .location-details {
            grid-template-columns: 1fr;
          }

          .patients-table th,
          .patients-table td {
            padding: 12px 10px;
            font-size: 14px;
          }

          .modal-tabs {
            overflow-x: auto;
            white-space: nowrap;
            padding-bottom: 5px;
          }

          .patient-modal {
            width: 95%;
          }
        }

        @media (max-width: 576px) {
          .stats-container {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .status-select {
            width: 100%;
          }

          .modal-footer {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }

          .footer-buttons {
            justify-content: flex-end;
          }
        }
      `}</style>
    </>
  );
};

export default Patients;
