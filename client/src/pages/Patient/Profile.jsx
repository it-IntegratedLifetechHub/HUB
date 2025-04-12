import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaEdit,
  FaHeartbeat,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { MdWorkOutline, MdEmergency } from "react-icons/md";
import { IoMdFitness, IoMdMedical } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BottomNavigation from "../../components/BottomNav";

const Profile = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [activeSection, setActiveSection] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileData, setProfileData] = useState({
    personal: {},
    medical: {},
    lifestyle: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Call logout API
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }

      // Clear user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      navigate("/patient/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error.message);
      // Still clear local storage even if API fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/patient/login", { replace: true });
    }
  };

  // Enhanced field configuration with icons and validation
  const fieldConfig = {
    personal: {
      Name: {
        field: "name",
        type: "text",
        icon: <FaUserCircle className="field-icon" />,
        required: true,
      },
      "Contact Number": {
        field: "phone",
        type: "tel",
        icon: <MdEmergency className="field-icon" />,
        pattern: "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$",
      },
      "Email ID": {
        field: "email",
        type: "email",
        icon: <FaUserCircle className="field-icon" />,
      },
      Gender: {
        field: "gender",
        type: "select",
        icon: <FaUserCircle className="field-icon" />,
        options: ["Male", "Female", "Other", "Prefer not to say"],
      },
      DOB: {
        field: "dob",
        type: "date",
        icon: <FaUserCircle className="field-icon" />,
        transform: (val) => (val ? new Date(val).toLocaleDateString() : ""),
        reverse: (val) => (val ? new Date(val).toISOString() : null),
      },
      "Blood Group": {
        field: "bloodGroup",
        type: "select",
        icon: <IoMdMedical className="field-icon" />,
        options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"],
      },
      "Marital Status": {
        field: "maritalStatus",
        type: "select",
        icon: <FaUserCircle className="field-icon" />,
        options: ["Single", "Married", "Divorced", "Widowed", "Separated"],
      },
      Height: {
        field: "height",
        type: "text",
        icon: <IoMdFitness className="field-icon" />,
        suffix: "cm",
      },
      Weight: {
        field: "weight",
        type: "text",
        icon: <IoMdFitness className="field-icon" />,
        suffix: "kg",
      },
      "Emergency Contact": {
        field: "emergencyContact.phone",
        type: "tel",
        icon: <MdEmergency className="field-icon" />,
      },
      Location: {
        field: "location",
        type: "text",
        icon: <FaUserCircle className="field-icon" />,
      },
    },
    medical: {
      Allergies: {
        field: "allergies",
        type: "textarea",
        icon: <IoMdMedical className="field-icon" />,
        transform: (val) => val?.join(", ") || "",
        reverse: (val) =>
          val
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item),
        placeholder: "List allergies separated by commas",
      },
      "Current Medications": {
        field: "currentMedications",
        type: "textarea",
        icon: <IoMdMedical className="field-icon" />,
        transform: (val) =>
          val?.map((m) => `${m.name} (${m.dosage})`).join(", ") || "",
        reverse: (val) =>
          val
            .split(",")
            .map((item) => {
              const match = item.trim().match(/(.*?)\((.*?)\)/);
              return match
                ? { name: match[1].trim(), dosage: match[2].trim() }
                : null;
            })
            .filter((item) => item),
        placeholder: "Format: Medication (Dosage), e.g., Aspirin (500mg)",
      },
      "Past Medications": {
        field: "pastMedications",
        type: "textarea",
        icon: <IoMdMedical className="field-icon" />,
        transform: (val) =>
          val?.map((m) => `${m.name} (${m.year})`).join(", ") || "",
        reverse: (val) =>
          val
            .split(",")
            .map((item) => {
              const match = item.trim().match(/(.*?)\((.*?)\)/);
              return match
                ? { name: match[1].trim(), year: parseInt(match[2].trim()) }
                : null;
            })
            .filter((item) => item),
        placeholder: "Format: Medication (Year), e.g., Penicillin (2020)",
      },
      Injuries: {
        field: "injuries",
        type: "textarea",
        icon: <IoMdMedical className="field-icon" />,
        transform: (val) =>
          val?.map((i) => `${i.description} (${i.year})`).join(", ") || "",
        reverse: (val) =>
          val
            .split(",")
            .map((item) => {
              const match = item.trim().match(/(.*?)\((.*?)\)/);
              return match
                ? {
                    description: match[1].trim(),
                    year: parseInt(match[2].trim()),
                  }
                : null;
            })
            .filter((item) => item),
        placeholder: "Format: Injury (Year), e.g., Broken arm (2018)",
      },
      Surgeries: {
        field: "surgeries",
        type: "textarea",
        icon: <IoMdMedical className="field-icon" />,
        transform: (val) =>
          val?.map((s) => `${s.name} (${s.year})`).join(", ") || "",
        reverse: (val) =>
          val
            .split(",")
            .map((item) => {
              const match = item.trim().match(/(.*?)\((.*?)\)/);
              return match
                ? { name: match[1].trim(), year: parseInt(match[2].trim()) }
                : null;
            })
            .filter((item) => item),
        placeholder: "Format: Surgery (Year), e.g., Appendectomy (2015)",
      },
      "Chronic Conditions": {
        field: "chronicConditions",
        type: "textarea",
        icon: <IoMdMedical className="field-icon" />,
        transform: (val) => val?.join(", ") || "",
        reverse: (val) =>
          val
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item),
        placeholder: "List conditions separated by commas",
      },
      "Family History": {
        field: "familyHistory",
        type: "textarea",
        icon: <IoMdMedical className="field-icon" />,
        transform: (val) => val?.join(", ") || "",
        reverse: (val) =>
          val
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item),
        placeholder: "List family medical history separated by commas",
      },
    },
    lifestyle: {
      "Smoking Habits": {
        field: "smokingHabits",
        type: "select",
        icon: <MdWorkOutline className="field-icon" />,
        options: ["Non-smoker", "Former smoker", "Current smoker"],
      },
      "Alcohol Consumption": {
        field: "alcoholConsumption",
        type: "select",
        icon: <MdWorkOutline className="field-icon" />,
        options: ["Non-drinker", "Occasional", "Regular"],
      },
      "Activity Level": {
        field: "activityLevel",
        type: "select",
        icon: <IoMdFitness className="field-icon" />,
        options: [
          "Sedentary",
          "Lightly active",
          "Moderately active",
          "Very active",
          "Extremely active",
        ],
      },
      "Food Preference": {
        field: "foodPreference",
        type: "select",
        icon: <MdWorkOutline className="field-icon" />,
        options: [
          "Vegetarian",
          "Vegan",
          "Non-vegetarian",
          "Pescatarian",
          "Other",
        ],
      },
      Occupation: {
        field: "occupation",
        type: "text",
        icon: <MdWorkOutline className="field-icon" />,
      },
      "Sleep Pattern": {
        field: "sleepPattern",
        type: "text",
        icon: <MdWorkOutline className="field-icon" />,
        placeholder: "e.g., 7-8 hours/night",
      },
      "Stress Level": {
        field: "stressLevel",
        type: "select",
        icon: <MdWorkOutline className="field-icon" />,
        options: ["Low", "Moderate", "High"],
      },
    },
  };

  // Section icons for tabs
  const sectionIcons = {
    personal: <FaUserCircle className="section-icon" />,
    medical: <FaHeartbeat className="section-icon" />,
    lifestyle: <MdWorkOutline className="section-icon" />,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/patient/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const { data: patient } = await response.json();
        transformPatientData(patient);
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [API_URL]);

  const transformPatientData = (patient) => {
    const transformedData = {};

    Object.keys(fieldConfig).forEach((section) => {
      transformedData[section] = {};
      Object.entries(fieldConfig[section]).forEach(([displayName, config]) => {
        const value = config.field
          .split(".")
          .reduce(
            (obj, key) => (obj && obj[key] !== undefined ? obj[key] : null),
            patient
          );
        transformedData[section][displayName] = config.transform
          ? config.transform(value)
          : value || "";
      });
    });

    setProfileData(transformedData);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData(profileData[activeSection]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const updates = {};

      // Validate required fields
      const requiredFields = Object.entries(fieldConfig[activeSection])
        .filter(([_, config]) => config.required)
        .map(([displayName]) => displayName);

      const missingFields = requiredFields.filter(
        (field) => !formData[field] || formData[field].trim() === ""
      );

      if (missingFields.length > 0) {
        throw new Error(
          `Please fill in required fields: ${missingFields.join(", ")}`
        );
      }

      // Transform form data back to backend structure
      Object.entries(formData).forEach(([displayName, value]) => {
        if (value === "" || !value) return;

        const config = fieldConfig[activeSection][displayName];
        if (!config) return;

        const fieldPath = config.field.split(".");
        const finalField = fieldPath.pop();
        let target = updates;

        // Handle nested fields
        fieldPath.forEach((part) => {
          target[part] = target[part] || {};
          target = target[part];
        });

        target[finalField] = config.reverse ? config.reverse(value) : value;
      });

      const updateResponse = await fetch(`${API_URL}/api/patient/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const responseData = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(responseData.message || "Failed to update profile");
      }

      transformPatientData(responseData.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const renderInputField = (name, value, config) => {
    const inputId = `input-${name.replace(/\s+/g, "-").toLowerCase()}`;

    return (
      <div className="form-field">
        <label htmlFor={inputId} className="form-label">
          {config.icon}
          {name}
          {config.required && <span className="required-asterisk">*</span>}
        </label>

        {config.type === "textarea" ? (
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={handleInputChange}
            className="form-input"
            rows={3}
            placeholder={config.placeholder}
            required={config.required}
          />
        ) : config.type === "select" ? (
          <select
            id={inputId}
            name={name}
            value={value}
            onChange={handleInputChange}
            className="form-input"
            required={config.required}
          >
            <option value="">Select an option</option>
            {config.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <div className="input-with-suffix">
            <input
              id={inputId}
              type={config.type || "text"}
              name={name}
              value={value}
              onChange={handleInputChange}
              className="form-input"
              placeholder={config.placeholder}
              pattern={config.pattern}
              required={config.required}
            />
            {config.suffix && (
              <span className="input-suffix">{config.suffix}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="avatar-wrapper">
          <FaUserCircle className="profile-avatar" />
          <button className="avatar-edit-button">
            <FaEdit />
          </button>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">
            {profileData.personal.Name || "Your Profile"}
          </h1>
          <p className="profile-email">
            {profileData.personal["Email ID"] || "No email provided"}
          </p>
          <div className="profile-meta">
            {profileData.personal["Blood Group"] && (
              <span className="meta-tag blood-group">
                {profileData.personal["Blood Group"]}
              </span>
            )}
            {profileData.personal.DOB &&
              !isNaN(new Date(profileData.personal.DOB)) && (
                <span className="meta-tag age">
                  {new Date().getFullYear() -
                    new Date(profileData.personal.DOB).getFullYear()}{" "}
                  years
                </span>
              )}
          </div>
        </div>
        <div className="profile-logout">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">
              <CiLogout />
            </span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>

      {/* Profile Navigation */}
      <nav className="profile-nav">
        {Object.keys(profileData).map((section) => (
          <button
            key={section}
            className={`nav-button ${
              activeSection === section ? "active" : ""
            }`}
            onClick={() => setActiveSection(section)}
          >
            {sectionIcons[section]}
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </nav>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="section-header">
          <h2 className="section-title">
            {sectionIcons[activeSection]}
            {activeSection.charAt(0).toUpperCase() +
              activeSection.slice(1)}{" "}
            Information
          </h2>
          {!isEditing && (
            <button className="edit-button" onClick={handleEditClick}>
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form className="edit-form">
            <div className="form-grid">
              {Object.entries(formData).map(([name, value]) => {
                const config = fieldConfig[activeSection][name];
                return (
                  <div key={name} className="form-item">
                    {renderInputField(name, value, config)}
                  </div>
                );
              })}
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                <FaTimes /> Cancel
              </button>
              <button
                type="button"
                className="save-button"
                onClick={handleSave}
              >
                <FaSave /> Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            {Object.entries(profileData[activeSection]).map(([name, value]) => (
              <div key={name} className="detail-row">
                <span className="detail-label">
                  {fieldConfig[activeSection][name]?.icon}
                  {name}:
                </span>
                <span className={`detail-value ${!value ? "empty-value" : ""}`}>
                  {value || "Not specified"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* CSS Styles */}
      <style jsx="true">{`
        :root {
          --primary-color: #5e0d97;
          --primary-light: #9900ff;
          --secondary-color: #6c757d;
          --success-color: #28a745;
          --danger-color: #dc3545;
          --light-color: #f8f9fa;
          --dark-color: #343a40;
          --border-radius: 8px;
          --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }

        .profile-container {
          max-width: 1000px;
          margin: 2rem auto 6rem;
          padding: 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: var(--box-shadow);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Profile Header */
        .profile-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding-bottom: 2rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }

        .avatar-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .profile-avatar {
          width: 100%;
          height: 100%;
          color: var(--primary-color);
          transition: var(--transition);
        }

        .avatar-edit-button {
          position: absolute;
          bottom: 0;
          right: 0;
          background: var(--primary-light);
          color: white;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .avatar-edit-button:hover {
          background: var(--primary-color);
          transform: scale(1.1);
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 2rem;
          font-weight: 700;
          color: var(--dark-color);
          margin: 0 0 0.5rem;
        }

        .profile-email {
          font-size: 1rem;
          color: var(--secondary-color);
          margin: 0 0 1rem;
        }

        .profile-meta {
          display: flex;
          gap: 0.5rem;
        }

        .meta-tag {
          font-size: 0.875rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-weight: 500;
        }

        .blood-group {
          background: #f0e5ff;
          color: var(--primary-light);
        }

        .age {
          background: #e5f0ff;
          color: #0d6efd;
        }

        /* Profile Navigation */
        .profile-nav {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .nav-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: 2px solid var(--primary-light);
          border-radius: 30px;
          background: transparent;
          color: var(--primary-light);
          cursor: pointer;
          font-weight: 600;
          transition: var(--transition);
        }

        .nav-button.active {
          background: var(--primary-light);
          color: white;
          box-shadow: 0 4px 15px rgba(153, 0, 255, 0.2);
        }

        .nav-button:hover:not(.active) {
          background: rgba(153, 0, 255, 0.1);
        }

        .section-icon {
          font-size: 1.25rem;
        }

        /* Profile Content */
        .profile-content {
          background: linear-gradient(135deg, #ffffff, #f3f6ff);
          border-radius: var(--border-radius);
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          color: var(--primary-color);
          margin: 0;
        }

        .edit-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--primary-light);
          color: white;
          border: none;
          border-radius: 30px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .edit-button:hover {
          background: var(--primary-color);
          transform: translateY(-2px);
        }

        /* Profile Details */
        .profile-details {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;

          justify-content: center;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          background: white;
          border-radius: var(--border-radius);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          transition: var(--transition);
        }

        .detail-row:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .detail-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: var(--dark-color);
        }

        .detail-value {
          color: var(--secondary-color);
          text-align: right;
        }

        .empty-value {
          color: #999;
          font-style: italic;
        }

        .field-icon {
          color: var(--primary-light);
          font-size: 1.1rem;
        }

        /* Edit Form */
        .edit-form {
          margin-top: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .form-item {
          margin-bottom: 1rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: var(--dark-color);
          font-size: 0.95rem;
        }

        .required-asterisk {
          color: var(--danger-color);
          margin-left: 0.25rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: var(--border-radius);
          font-size: 1rem;
          transition: var(--transition);
        }

        .form-input:focus {
          border-color: var(--primary-light);
          box-shadow: 0 0 0 3px rgba(153, 0, 255, 0.1);
          outline: none;
        }

        textarea.form-input {
          min-height: 100px;
          resize: vertical;
        }

        .input-with-suffix {
          position: relative;
        }

        .input-suffix {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--secondary-color);
          font-size: 0.9rem;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #eee;
        }

        .save-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--success-color);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .save-button:hover {
          background: #218838;
          transform: translateY(-2px);
        }

        .cancel-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--light-color);
          color: var(--secondary-color);
          border: none;
          border-radius: var(--border-radius);
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .cancel-button:hover {
          background: #e2e6ea;
          transform: translateY(-2px);
        }

        /* Loading State */
        .profile-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          gap: 1rem;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid var(--primary-light);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .avatar-wrapper {
            margin: 0 auto 1rem;
          }

          .profile-meta {
            justify-content: center;
          }

          .profile-nav {
            flex-direction: column;
            align-items: stretch;
          }

          .nav-button {
            justify-content: center;
          }

          .profile-details,
          .form-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .edit-button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .profile-container {
            padding: 1rem;
            margin: 1rem auto 5rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .save-button,
          .cancel-button {
            width: 100%;
            justify-content: center;
          }
        }
        .profile-logout {
          display: flex;
          justify-content: flex-end;
          padding: 1rem;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background-color: #d32f2f;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .logout-btn:active {
          transform: translateY(0);
          box-shadow: none;
        }

        .logout-icon {
          display: flex;
          align-items: center;
        }

        .logout-text {
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default Profile;
