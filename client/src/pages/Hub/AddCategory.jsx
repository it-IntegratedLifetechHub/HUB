import React, { useState, useEffect } from "react";

import { FaPlusCircle } from "react-icons/fa";
import { FaSquarePlus } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    icon: "MdHealthAndSafety",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create category");
      }

      const data = await res.json();

      setSuccessMessage("Category created successfully!");
      setFormData({
        name: "",
        icon: "fas fa-folder",
      });

      // Update categories list
      setCategories([data, ...categories]);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage(err.message || "Error creating category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <FaPlusCircle style={styles.headerIcon} />
          <h2 style={styles.title}>Create New Category</h2>
          <p style={styles.subtitle}>
            Organize your content with custom categories
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>
              Category Name
            </label>
            <div style={styles.inputContainer}>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g. Food, Travel, Electronics"
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="icon" style={styles.label}>
              Category Icon
            </label>
            <div style={styles.iconInputContainer}>
              <span style={styles.iconPreview}>
                <i className={formData.icon} style={styles.icon} />
              </span>
              <input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                style={{ ...styles.input, paddingLeft: "40px" }}
                placeholder="fas fa-icon-name"
              />
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(isSubmitting ? styles.submitButtonDisabled : {}),
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner style={styles.buttonIcon} />
                  Creating...
                </>
              ) : (
                <>
                  <FaSquarePlus style={styles.buttonIcon} />
                  Create Category
                </>
              )}
            </button>
          </div>
        </form>

        {errorMessage && (
          <div style={styles.errorMessage}>
            <FaExclamationCircle style={{ marginRight: "8px" }} />
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div style={styles.successMessage}>
            <FaCheckCircle style={{ marginRight: "8px" }} />
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f3ff",
    padding: "2rem",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "580px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(106, 13, 173, 0.1)",
    padding: "2.5rem",
    transition: "all 0.3s ease",
  },
  header: {
    textAlign: "center",
    marginBottom: "2.5rem",
  },
  headerIcon: {
    fontSize: "2.5rem",
    color: "#6a0dad",
    marginBottom: "1rem",
  },
  title: {
    color: "#2d0a50",
    marginBottom: "0.5rem",
    fontSize: "1.75rem",
    fontWeight: "700",
  },
  subtitle: {
    color: "#666",
    fontSize: "1rem",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  label: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#444",
    marginLeft: "0.25rem",
  },
  inputContainer: {
    position: "relative",
    border: "1px solid #ddd",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    backgroundColor: "#fafafa",
  },
  input: {
    padding: "0.85rem 1.25rem",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "transparent",
    outline: "none",
    color: "#333",
  },
  iconPreview: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#6a0dad",
    fontSize: "1.2rem",
    width: "24px",
    textAlign: "center",
  },
  helperText: {
    fontSize: "0.85rem",
    color: "#666",
    marginTop: "0.25rem",
    marginLeft: "0.25rem",
  },
  iconGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
    gap: "0.75rem",
    marginTop: "1rem",
  },
  iconButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #eee",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: "none",
    ":hover": {
      backgroundColor: "#f0e5ff",
      borderColor: "#d9c2ff",
    },
  },
  gridIcon: {
    fontSize: "1.25rem",
    color: "#6a0dad",
    marginBottom: "0.5rem",
  },
  iconLabel: {
    fontSize: "0.7rem",
    color: "#555",
    textTransform: "capitalize",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: "1rem",
  },
  submitButton: {
    backgroundColor: "#6a0dad",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "1rem 1.75rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    boxShadow: "0 4px 15px rgba(106, 13, 173, 0.3)",
    ":hover": {
      backgroundColor: "#5a0ba5",
    },
  },
  submitButtonDisabled: {
    backgroundColor: "#b39ddb",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  successMessage: {
    backgroundColor: "#f0fff4",
    color: "#2e7d32",
    padding: "1rem 1.5rem",
    borderRadius: "10px",
    marginTop: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "0.95rem",
    borderLeft: "4px solid #2e7d32",
    animation: "fadeIn 0.3s ease",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "#2e7d32",
    cursor: "pointer",
    fontSize: "1rem",
    padding: "0.25rem",
    marginLeft: "0.5rem",
  },
};

export default AddCategory;
