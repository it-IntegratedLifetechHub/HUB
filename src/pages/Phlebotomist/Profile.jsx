import React, { useState } from "react";
import {
  FaUser,
  FaIdCard,
  FaHospital,
  FaCalendarAlt,
  FaChartLine,
  FaCertificate,
  FaShieldAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaEdit,
  FaClock,
} from "react-icons/fa";
import PhlebotomistBottomNavigation from "../../components/PhlebotomistNav";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Dr. Sarah Johnson",
    employeeId: "PHLEB-2023-0456",
    specialization: "Pediatric & Geriatric Phlebotomy",
    hospital: "Metropolitan Medical Center",
    experience: "5 years",
    certifications: ["CPT", "NPA", "OSHA Bloodborne Pathogens"],
    contact: "+1 (555) 123-4567",
    email: "s.johnson@metromedical.com",
    address: "123 Medical Drive, Suite 456, Boston, MA 02115",
    workingHours: "Mon-Fri: 7:00 AM - 4:00 PM",
    emergencyContact: "+1 (555) 987-6543",
    bio: "Specialized in gentle blood collection techniques for pediatric and elderly patients. Committed to patient comfort and accurate specimen collection.",
  });

  const stats = {
    totalCollections: 1245,
    successRate: "98.7%",
    patientSatisfaction: "4.9/5.0",
    avgTimePerCollection: "3.2 mins",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setEditMode(false);
    // Here you would typically make an API call to save the data
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar">SJ</div>
        <div className="header-info">
          <h1>{profileData.name}</h1>
          <p className="role">Senior Phlebotomist</p>
          <div className="badges">
            <span className="badge certified">
              <FaCertificate /> Certified
            </span>
            <span className="badge verified">
              <FaShieldAlt /> Verified
            </span>
          </div>
        </div>
        <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
          <FaEdit /> {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="profile-content">
        {/* Personal Information Section */}
        <div className="profile-section">
          <h2>
            <FaUser /> Personal Information
          </h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Employee ID</label>
              <div className="info-value">{profileData.employeeId}</div>
            </div>
            <div className="info-item">
              <label>Specialization</label>
              {editMode ? (
                <input
                  type="text"
                  name="specialization"
                  value={profileData.specialization}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="info-value">{profileData.specialization}</div>
              )}
            </div>
            <div className="info-item">
              <label>Hospital/Clinic</label>
              {editMode ? (
                <input
                  type="text"
                  name="hospital"
                  value={profileData.hospital}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="info-value">
                  <FaHospital /> {profileData.hospital}
                </div>
              )}
            </div>
            <div className="info-item">
              <label>Experience</label>
              {editMode ? (
                <input
                  type="text"
                  name="experience"
                  value={profileData.experience}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="info-value">{profileData.experience}</div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="profile-section">
          <h2>
            <FaPhone /> Contact Information
          </h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Phone</label>
              {editMode ? (
                <input
                  type="tel"
                  name="contact"
                  value={profileData.contact}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="info-value">
                  <FaPhone /> {profileData.contact}
                </div>
              )}
            </div>
            <div className="info-item">
              <label>Email</label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="info-value">
                  <FaEnvelope /> {profileData.email}
                </div>
              )}
            </div>
            <div className="info-item">
              <label>Address</label>
              {editMode ? (
                <textarea
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="info-value">
                  <FaMapMarkerAlt /> {profileData.address}
                </div>
              )}
            </div>
            <div className="info-item">
              <label>Emergency Contact</label>
              {editMode ? (
                <input
                  type="tel"
                  name="emergencyContact"
                  value={profileData.emergencyContact}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="info-value">
                  <FaPhone /> {profileData.emergencyContact}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="profile-section">
          <h2>
            <FaIdCard /> Professional Details
          </h2>
          <div className="info-item">
            <label>Certifications</label>
            {editMode ? (
              <textarea
                name="certifications"
                value={profileData.certifications.join(", ")}
                onChange={(e) => {
                  setProfileData((prev) => ({
                    ...prev,
                    certifications: e.target.value.split(", "),
                  }));
                }}
              />
            ) : (
              <div className="info-value">
                <ul className="certification-list">
                  {profileData.certifications.map((cert, index) => (
                    <li key={index}>
                      <FaCertificate /> {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="info-item">
            <label>Working Hours</label>
            {editMode ? (
              <input
                type="text"
                name="workingHours"
                value={profileData.workingHours}
                onChange={handleInputChange}
              />
            ) : (
              <div className="info-value">
                <FaClock /> {profileData.workingHours}
              </div>
            )}
          </div>

          <div className="info-item">
            <label>Bio</label>
            {editMode ? (
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
              />
            ) : (
              <div className="info-value bio">{profileData.bio}</div>
            )}
          </div>
        </div>

        {/* Performance Statistics */}
        <div className="profile-section">
          <h2>
            <FaChartLine /> Performance Statistics
          </h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalCollections}</div>
              <div className="stat-label">Total Collections</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.successRate}</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.patientSatisfaction}</div>
              <div className="stat-label">Patient Satisfaction</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.avgTimePerCollection}</div>
              <div className="stat-label">Avg. Time/Collection</div>
            </div>
          </div>
        </div>

        {/* My Recommendations Section */}
        <div className="profile-section recommendations">
          <h2>My Professional Recommendations</h2>
          <div className="recommendation-item">
            <h3>Specialized Training</h3>
            <p>
              Consider advanced certification in pediatric phlebotomy to enhance
              your skills with young patients.
            </p>
          </div>
          <div className="recommendation-item">
            <h3>Equipment Upgrade</h3>
            <p>
              Butterfly needles (23G or 25G) would improve patient comfort
              during blood draws.
            </p>
          </div>
          <div className="recommendation-item">
            <h3>Continuing Education</h3>
            <p>
              Upcoming workshop on difficult venipuncture techniques would be
              valuable for your practice.
            </p>
          </div>
          <div className="recommendation-item">
            <h3>Patient Communication</h3>
            <p>
              Implementing a simple explanation card for patients about the
              blood draw process could reduce anxiety.
            </p>
          </div>
        </div>

        {editMode && (
          <div className="action-buttons">
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        )}
      </div>

      <PhlebotomistBottomNavigation />

      <style jsx="true">{`
        /* Color Variables */
        :root {
          --primary-color: #5e0d97;
          --primary-light: #f0e6fa;
          --secondary-color: #28a745;
          --warning-color: #ff9800;
          --danger-color: #dc3545;
          --info-color: #17a2b8;
          --text-dark: #2c3e50;
          --text-medium: #495057;
          --text-light: #6c757d;
          --border-radius: 12px;
          --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }

        /* Base Styles */
        .profile-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px 16px 100px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: var(--text-dark);
        }

        /* Header Section */
        .profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .avatar {
          width: 80px;
          height: 80px;
          background-color: var(--primary-color);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
        }

        .header-info {
          flex: 1;
          min-width: 200px;
        }

        .header-info h1 {
          margin: 0;
          font-size: 28px;
        }

        .role {
          margin: 5px 0;
          color: var(--text-medium);
          font-size: 16px;
        }

        .badges {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .badge {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .certified {
          background-color: #e6f7ff;
          color: var(--info-color);
        }

        .verified {
          background-color: #e6ffed;
          color: var(--secondary-color);
        }

        .edit-btn {
          background-color: white;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
          padding: 10px 15px;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: var(--transition);
        }

        .edit-btn:hover {
          background-color: var(--primary-light);
        }

        /* Profile Sections */
        .profile-section {
          background: white;
          border-radius: var(--border-radius);
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: var(--box-shadow);
        }

        .profile-section h2 {
          font-size: 20px;
          margin-top: 0;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--primary-color);
        }

        /* Information Grid */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .info-item {
          margin-bottom: 15px;
        }

        .info-item label {
          display: block;
          font-size: 14px;
          color: var(--text-light);
          margin-bottom: 5px;
          font-weight: 500;
        }

        .info-value {
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .info-value svg {
          color: var(--primary-color);
        }

        .bio {
          line-height: 1.6;
        }

        /* Input Fields */
        input,
        textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-family: inherit;
          font-size: 16px;
        }

        textarea {
          min-height: 80px;
          resize: vertical;
        }

        /* Certification List */
        .certification-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .certification-list li {
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .certification-list svg {
          color: var(--secondary-color);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }

        .stat-card {
          background: var(--primary-light);
          border-radius: var(--border-radius);
          padding: 15px;
          text-align: center;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-medium);
        }

        /* Recommendations */
        .recommendations {
          background: #f8f9fa;
        }

        .recommendation-item {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .recommendation-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .recommendation-item h3 {
          margin: 0 0 10px 0;
          color: var(--primary-color);
          font-size: 18px;
        }

        .recommendation-item p {
          margin: 0;
          color: var(--text-medium);
          line-height: 1.6;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .save-btn {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .save-btn:hover {
          background-color: var(--primary-hover);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .header-info {
            text-align: center;
          }

          .badges {
            justify-content: center;
          }

          .edit-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .info-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
