import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LabRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Laboratory name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email address";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lab/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {

        setRegistrationSuccess(true);
        setTimeout(() => {
          navigate("/lab/dashboard");
        }, 1500);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          const fieldErrors = {};
          data.errors.forEach((error) => {
            fieldErrors[error.param] = error.msg;
          });
          setErrors(fieldErrors);
        }
        setApiError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setApiError("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Register Your Laboratory</h2>
          <p style={styles.subtitle}>Create your secure lab account</p>
        </div>

        {apiError && <div style={styles.errorAlert}>{apiError}</div>}

        {registrationSuccess ? (
          <div style={styles.successMessage}>
            <h3>🎉 Registration Successful!</h3>
            <p>Redirecting to dashboard...</p>
          </div>
        ) : (
          <form style={styles.form} onSubmit={handleSubmit} noValidate>
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.label}>
                Laboratory Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter lab name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.name && styles.inputError),
                }}
              />
              {errors.name && (
                <span style={styles.errorText}>{errors.name}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.email && styles.inputError),
                }}
              />
              {errors.email && (
                <span style={styles.errorText}>{errors.email}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                Create Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.password && styles.inputError),
                }}
              />
              {errors.password && (
                <span style={styles.errorText}>{errors.password}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.confirmPassword && styles.inputError),
                }}
              />
              {errors.confirmPassword && (
                <span style={styles.errorText}>{errors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.submitButton,
                ...(isSubmitting && styles.submitButtonDisabled),
              }}
            >
              {isSubmitting ? "Registering..." : "Register Lab"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    maxWidth: "480px",
    width: "100%",
  },
  header: {
    marginBottom: "24px",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "4px",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    display: "block",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    width: "100%",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#f9fafb",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "13px",
    marginTop: "6px",
  },
  submitButton: {
    padding: "12px",
    backgroundColor: "#7c3aed",
    color: "white",
    fontWeight: "600",
    borderRadius: "8px",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    transition: "0.3s ease",
  },
  submitButtonDisabled: {
    backgroundColor: "#d1d5db",
    cursor: "not-allowed",
  },
  successMessage: {
    textAlign: "center",
    padding: "20px",
    color: "#10b981",
    fontWeight: "600",
  },
  errorAlert: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
  },
};

export default LabRegistration;
