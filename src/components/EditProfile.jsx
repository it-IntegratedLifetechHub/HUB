import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { field, value } = location.state || {};

  const [newValue, setNewValue] = useState(value || "");

  useEffect(() => {
    // Autofocus on input when the component mounts
    document.getElementById("edit-input")?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${field} updated to: ${newValue}`);
    navigate("/profile"); // Go back to the profile page after update
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2 className="edit-profile-title">Edit {field}</h2>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="edit-profile-group">
            <label className="edit-profile-label">{field}:</label>
            <input
              id="edit-input"
              type="text"
              className="edit-profile-input"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>

          <div className="edit-profile-actions">
            <button type="submit" className="edit-profile-save">
              Save Changes
            </button>
            <button
              type="button"
              className="edit-profile-cancel"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
