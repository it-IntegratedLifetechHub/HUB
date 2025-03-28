import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../../components/BottomNav";

const Profile = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const navigate = useNavigate();

  const profileData = {
    personal: {
      Name: "John Doe",
      "Contact Number": "+1 234 567 890",
      "Email ID": "johndoe@example.com",
      Gender: "Male",
      DOB: "Jan 1, 1990",
      "Blood Group": "O+",
      "Marital Status": "Single",
      Height: "5'9\"",
      Weight: "70kg",
      "Emergency Contact": "+1 987 654 321",
      Location: "New York, USA",
    },
    medical: {
      Allergies: "Peanuts",
      "Current Medications": "None",
      "Past Medications": "Antibiotics (2023)",
      Injuries: "None",
      Surgeries: "Appendectomy (2015)",
    },
    lifestyle: {
      "Smoking Habits": "Non-Smoker",
      "Alcohol Consumption": "Occasional",
      "Activity Level": "Active",
      "Food Preference": "Vegetarian",
      Occupation: "Software Engineer",
    },
  };

  return (
    <>
      <div className="profile-container">
        <h1 className="page-title">Profile</h1>
        <div className="profile-header">
          <FaUserCircle size={120} className="profile-icon" />
          <h2 className="profile-name">{profileData.personal.Name}</h2>
          <p className="profile-email">{profileData.personal["Email ID"]}</p>
        </div>

        {/* Toggle Section */}
        <div className="toggle-container">
          {["personal", "medical", "lifestyle"].map((section) => (
            <button
              key={section}
              className={`toggle-btn ${
                activeSection === section ? "active" : ""
              }`}
              onClick={() => setActiveSection(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Profile Details Section */}
        <div className="profile-details">
          {Object.entries(profileData[activeSection]).map(([key, value]) => (
            <div
              key={key}
              className="profile-row"
              onClick={() =>
                navigate(`/edit-field`, { state: { field: key, value } })
              }
            >
              <span className="profile-label">{key}:</span>
              <span className="profile-value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </>
  );
};

export default Profile;
