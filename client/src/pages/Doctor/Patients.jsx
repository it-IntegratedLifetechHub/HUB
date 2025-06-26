import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorNav from "../../components/DoctorNav";
import {
  FiSearch,
  FiUser,
  FiCalendar,
  FiFileText,
  FiPlus,
  FiX,
  FiMail,
  FiPhone,
  FiClock,
} from "react-icons/fi";
import { FaNotesMedical, FaPills, FaStethoscope } from "react-icons/fa";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockPatients = [
            {
              id: 1,
              name: "John Doe",
              age: 35,
              gender: "Male",
              email: "john@example.com",
              phone: "555-0101",
              lastVisit: "2023-05-15",
              conditions: ["Hypertension", "Type 2 Diabetes"],
              medicalHistory: [
                {
                  date: "2023-05-15",
                  diagnosis: "Hypertension follow-up",
                  treatment: "Increased dosage of medication",
                },
              ],
              prescriptions: [
                {
                  id: "RX001",
                  date: "2023-05-15",
                  medication: "Lisinopril",
                  dosage: "10mg daily",
                  refills: 3,
                },
              ],
              appointments: [
                {
                  id: "APT001",
                  date: "2023-05-15",
                  reason: "Follow-up",
                  status: "Completed",
                },
              ],
              consultations: [
                {
                  id: "CONS001",
                  date: "2023-05-15",
                  notes: "Patient reports improved blood pressure control",
                  feedback: "Very satisfied with treatment",
                },
              ],
              notes: ["Patient needs to monitor blood pressure daily"],
            },
            {
              id: 2,
              name: "Jane Smith",
              age: 28,
              gender: "Female",
              email: "jane@example.com",
              phone: "555-0102",
              lastVisit: "2023-06-10",
              conditions: ["Migraine"],
              medicalHistory: [
                {
                  date: "2023-06-10",
                  diagnosis: "Chronic migraine",
                  treatment: "Prescribed preventive medication",
                },
              ],
              prescriptions: [
                {
                  id: "RX002",
                  date: "2023-06-10",
                  medication: "Topiramate",
                  dosage: "25mg twice daily",
                  refills: 2,
                },
              ],
              appointments: [
                {
                  id: "APT002",
                  date: "2023-06-10",
                  reason: "Migraine evaluation",
                  status: "Completed",
                },
              ],
              consultations: [
                {
                  id: "CONS002",
                  date: "2023-06-10",
                  notes: "Patient reports 8-10 migraine days per month",
                  feedback: "Satisfied with consultation",
                },
              ],
              notes: ["Patient to track migraine frequency and triggers"],
            },
            {
              id: 3,
              name: "Robert Johnson",
              age: 42,
              gender: "Male",
              email: "robert@example.com",
              phone: "555-0103",
              lastVisit: "2023-06-20",
              conditions: ["Asthma", "Allergies"],
              medicalHistory: [
                {
                  date: "2023-06-20",
                  diagnosis: "Asthma control check",
                  treatment: "Adjust inhaler usage",
                },
              ],
              prescriptions: [
                {
                  id: "RX003",
                  date: "2023-06-20",
                  medication: "Albuterol",
                  dosage: "2 puffs every 4 hours as needed",
                  refills: 1,
                },
              ],
              appointments: [
                {
                  id: "APT003",
                  date: "2023-06-20",
                  reason: "Asthma follow-up",
                  status: "Completed",
                },
              ],
              consultations: [
                {
                  id: "CONS003",
                  date: "2023-06-20",
                  notes:
                    "Patient reports better breathing with current treatment",
                  feedback: "Satisfied with care",
                },
              ],
              notes: ["Patient to monitor peak flow readings"],
            },
          ];
          setPatients(mockPatients);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
    setActiveTab("profile");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  const handleNewConsultation = () => {
    if (selectedPatient) {
      navigate(`/consultation/new/${selectedPatient.id}`);
    }
  };

  const handleAddNote = () => {
    if (newNote.trim() && selectedPatient) {
      const updatedPatient = {
        ...selectedPatient,
        notes: [...selectedPatient.notes, newNote],
      };

      setSelectedPatient(updatedPatient);
      setPatients(
        patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
      );
      setNewNote("");
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patients-container">
      <DoctorNav />

      <div className="patients-content">
        <div className="patient-list-header">
          <h2>Patient List</h2>
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients by name..."
            />
          </div>
        </div>

        {isLoading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading patients...</p>
          </div>
        ) : (
          <div className="patient-grid">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="patient-card"
                onClick={() => handlePatientSelect(patient)}
              >
                <div className="patient-avatar">
                  {patient.name.charAt(0).toUpperCase()}
                </div>
                <h3>{patient.name}</h3>
                <div className="patient-meta">
                  <span>
                    <FiUser /> {patient.age} yrs
                  </span>
                  <span>{patient.gender}</span>
                </div>
                <div className="patient-footer">
                  <span className="last-visit">
                    <FiClock /> {patient.lastVisit}
                  </span>
                  <div className="conditions">
                    {patient.conditions.map((condition, index) => (
                      <span key={index} className="condition-tag">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      {showModal && selectedPatient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={handleCloseModal}>
              <FiX size={24} />
            </button>

            <div className="patient-header">
              <div className="patient-avatar-large">
                {selectedPatient.name.charAt(0).toUpperCase()}
              </div>
              <div className="patient-info">
                <h2>{selectedPatient.name}</h2>
                <div className="patient-details">
                  <span>
                    <FiUser /> {selectedPatient.age} yrs |{" "}
                    {selectedPatient.gender}
                  </span>
                  <span>
                    <FiMail /> {selectedPatient.email}
                  </span>
                  <span>
                    <FiPhone /> {selectedPatient.phone}
                  </span>
                </div>
              </div>
              <button
                className="new-consultation-btn"
                onClick={handleNewConsultation}
              >
                <FiPlus /> New Consultation
              </button>
            </div>

            <div className="patient-tabs">
              <button
                className={activeTab === "profile" ? "active" : ""}
                onClick={() => setActiveTab("profile")}
              >
                <FaStethoscope /> Profile
              </button>
              <button
                className={activeTab === "consultations" ? "active" : ""}
                onClick={() => setActiveTab("consultations")}
              >
                <FaNotesMedical /> Consultation History
              </button>
            </div>

            {activeTab === "profile" ? (
              <div className="profile-content">
                <div className="section">
                  <h3>
                    <FaStethoscope /> Medical History
                  </h3>
                  {selectedPatient.medicalHistory.map((item, index) => (
                    <div key={index} className="medical-history-item">
                      <div className="history-date">{item.date}</div>
                      <h4>{item.diagnosis}</h4>
                      <p className="treatment">Treatment: {item.treatment}</p>
                    </div>
                  ))}
                </div>

                <div className="section">
                  <h3>
                    <FaPills /> Prescriptions
                  </h3>
                  {selectedPatient.prescriptions.map((prescription) => (
                    <div key={prescription.id} className="prescription-item">
                      <div className="prescription-header">
                        <span className="prescription-date">
                          {prescription.date}
                        </span>
                        <span className="prescription-id">
                          #{prescription.id}
                        </span>
                      </div>
                      <h4>{prescription.medication}</h4>
                      <div className="prescription-details">
                        <span>Dosage: {prescription.dosage}</span>
                        <span>Refills: {prescription.refills}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="section">
                  <h3>
                    <FiCalendar /> Appointment History
                  </h3>
                  {selectedPatient.appointments.map((appointment) => (
                    <div key={appointment.id} className="appointment-item">
                      <div className="appointment-header">
                        <span className="appointment-date">
                          {appointment.date}
                        </span>
                        <span
                          className={`appointment-status ${appointment.status.toLowerCase()}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      <p className="appointment-reason">{appointment.reason}</p>
                    </div>
                  ))}
                </div>

                <div className="section">
                  <h3>
                    <FiFileText /> Notes
                  </h3>
                  <div className="notes-list">
                    {selectedPatient.notes.map((note, index) => (
                      <div key={index} className="note-item">
                        <div className="note-content">
                          <p>{note}</p>
                          <span className="note-date">
                            Added: {new Date().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="add-note">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a new note about this patient..."
                    />
                    <button onClick={handleAddNote} className="add-note-btn">
                      <FiPlus /> Add Note
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="consultations-content">
                <h3>Consultation History</h3>
                {selectedPatient.consultations.map((consultation) => (
                  <div key={consultation.id} className="consultation-item">
                    <div className="consultation-header">
                      <span className="consultation-date">
                        {consultation.date}
                      </span>
                      <span className="consultation-id">
                        #{consultation.id}
                      </span>
                    </div>
                    <div className="consultation-details">
                      <div className="consultation-notes">
                        <h4>Notes:</h4>
                        <p>{consultation.notes}</p>
                      </div>
                      <div className="consultation-feedback">
                        <h4>Patient Feedback:</h4>
                        <p>{consultation.feedback}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        /* Main container styles */
        .patients-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
        }

        .patients-content {
          padding: 2rem;
          flex: 1;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .patient-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .patient-list-header h2 {
          color: #1e293b;
          margin: 0;
          font-size: 1.75rem;
          font-weight: 600;
        }

        .search-bar {
          position: relative;
          margin: 0;
          min-width: 300px;
        }

        .search-bar input {
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          width: 100%;
          background-color: #fff;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
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

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: #64748b;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Patient grid styles */
        .patient-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .patient-card {
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .patient-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border-color: #c7d2fe;
        }

        .patient-avatar {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 600;
          margin: 0 auto 1rem;
          box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3),
            0 2px 4px -1px rgba(99, 102, 241, 0.2);
        }

        .patient-card h3 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .patient-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          color: #64748b;
          font-size: 0.875rem;
          align-items: center;
        }

        .patient-meta svg {
          margin-right: 0.25rem;
          opacity: 0.7;
        }

        .patient-footer {
          width: 100%;
          margin-top: auto;
        }

        .last-visit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.75rem;
        }

        .conditions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .condition-tag {
          font-size: 0.75rem;
          color: #6366f1;
          background-color: #e0e7ff;
          padding: 0.25rem 0.5rem;
          border-radius: 999px;
          font-weight: 500;
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
          width: 90%;
          max-width: 1000px;
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

        .close-modal {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          padding: 0.25rem;
          transition: all 0.2s;
          border-radius: 4px;
        }

        .close-modal:hover {
          color: #ef4444;
          background-color: #fee2e2;
        }

        /* Patient details styles */
        .patient-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          flex-wrap: wrap;
        }

        .patient-avatar-large {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 600;
          flex-shrink: 0;
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3),
            0 4px 6px -2px rgba(99, 102, 241, 0.2);
        }

        .patient-info {
          flex: 1;
          min-width: 200px;
        }

        .patient-header h2 {
          color: #1e293b;
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .patient-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        .patient-details span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .new-consultation-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3),
            0 2px 4px -1px rgba(99, 102, 241, 0.2);
          margin-left: auto;
          flex-shrink: 0;
        }

        .new-consultation-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3),
            0 4px 6px -2px rgba(99, 102, 241, 0.2);
        }

        /* Tabs styles */
        .patient-tabs {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 1.5rem;
          gap: 0.5rem;
        }

        .patient-tabs button {
          background: none;
          border: none;
          padding: 0.75rem 1.25rem;
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

        .patient-tabs button:hover {
          color: #6366f1;
          background-color: #f1f5f9;
        }

        .patient-tabs button.active {
          color: #6366f1;
          font-weight: 500;
          background-color: #f8fafc;
        }

        .patient-tabs button.active::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #6366f1;
        }

        /* Profile content styles */
        .profile-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .section {
          background-color: white;
          border-radius: 10px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .section h3 {
          margin-top: 0;
          margin-bottom: 1.25rem;
          color: #1e293b;
          font-size: 1.1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .medical-history-item,
        .prescription-item,
        .appointment-item,
        .consultation-item,
        .note-item {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 1.25rem;
          margin-bottom: 1rem;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }

        .medical-history-item:hover,
        .prescription-item:hover,
        .appointment-item:hover,
        .consultation-item:hover,
        .note-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05),
            0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }

        .history-date,
        .prescription-date,
        .appointment-date,
        .consultation-date {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        .prescription-header,
        .appointment-header,
        .consultation-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .prescription-id,
        .consultation-id {
          font-size: 0.8rem;
          background-color: #e0e7ff;
          color: #6366f1;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
        }

        .prescription-item h4,
        .medical-history-item h4 {
          margin: 0.5rem 0;
          color: #1e293b;
          font-size: 1rem;
        }

        .treatment {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0;
        }

        .prescription-details {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #64748b;
        }

        .appointment-status {
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          border-radius: 999px;
        }

        .appointment-status.completed {
          background-color: #dcfce7;
          color: #16a34a;
        }

        .appointment-status.scheduled {
          background-color: #e0f2fe;
          color: #0369a1;
        }

        .appointment-reason {
          margin: 0;
          color: #475569;
          font-size: 0.95rem;
        }

        .notes-list {
          margin-bottom: 1.5rem;
        }

        .note-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .note-content {
          flex: 1;
        }

        .note-content p {
          margin: 0 0 0.5rem 0;
          color: #475569;
        }

        .note-date {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .add-note {
          margin-top: 1.5rem;
        }

        .add-note textarea {
          width: 100%;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          min-height: 100px;
          margin-bottom: 1rem;
          resize: vertical;
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .add-note textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .add-note-btn {
          background-color: #6366f1;
          color: white;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .add-note-btn:hover {
          background-color: #4f46e5;
        }

        /* Consultation content styles */
        .consultations-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .consultation-item {
          background-color: white;
          border-radius: 10px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .consultation-header {
          margin-bottom: 1rem;
        }

        .consultation-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .consultation-notes,
        .consultation-feedback {
          background-color: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .consultation-notes h4,
        .consultation-feedback h4 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
          font-size: 0.95rem;
        }

        .consultation-notes p,
        .consultation-feedback p {
          margin: 0;
          color: #475569;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        /* Responsive styles */
        @media (max-width: 1024px) {
          .profile-content {
            grid-template-columns: 1fr;
          }

          .consultation-details {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .patient-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }

          .modal-content {
            padding: 1.5rem;
          }

          .patient-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .new-consultation-btn {
            margin-left: 0;
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .patients-content {
            padding: 1rem;
          }

          .patient-list-header {
            flex-direction: column;
            align-items: stretch;
          }

          .search-bar {
            width: 100%;
          }

          .patient-tabs {
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }

          .patient-tabs button {
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default Patients;
