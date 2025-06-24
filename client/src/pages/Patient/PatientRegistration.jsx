import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientRegistration = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormData({
        ...formData,
        [name]: value.replace(/\D/g, "").slice(0, 10),
      });
    } else {
      setFormData({ ...formData, [name]: value.trim() });
    }
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Please enter your full name");
      return false;
    }
    if (formData.name.length < 3) {
      setError("Name must be at least 3 characters");
      return false;
    }
    if (formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle backend validation errors
        if (data.error && data.error.details) {
          // Joi validation errors
          throw new Error(data.error.details[0].message);
        }
        throw new Error(data.message || "Registration failed");
      }

      // Registration successful
      setSuccess(true);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => {
        navigate("/patient", { state: data.user });
      }, 1500);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Patient Registration</h1>

        {error && <div style={styles.error}>{error}</div>}
        {success && (
          <div style={styles.success}>
            Registration successful! Redirecting...
          </div>
        )}

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your full name"
              required
              minLength="3"
              maxLength="100"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter 10-digit number"
              required
              pattern="[0-9]{10}"
              title="10 digit phone number"
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {}),
            }}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={styles.loginText}>
          Already registered?{" "}
          <button
            style={styles.loginLink}
            onClick={() => navigate("/patient/login")}
            type="button"
          >
            Login here
          </button>
        </p>
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
    background: "linear-gradient(135deg, #5e0d97 0%, #3a0475 100%)",
    fontFamily: '"Segoe UI", Roboto, sans-serif',
    padding: "20px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    padding: "40px",
    width: "100%",
    maxWidth: "450px",
    transition: "all 0.3s ease",
  },
  title: {
    color: "#5e0d97",
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "600",
  },
  error: {
    color: "#d32f2f",
    backgroundColor: "#fde8e8",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "14px",
  },
  success: {
    color: "#388e3c",
    backgroundColor: "#ebf5eb",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "#555",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    transition: "all 0.3s",
    outline: "none",
    "::placeholder": {
      color: "#aaa",
    },
    ":focus": {
      borderColor: "#5e0d97",
      boxShadow: "0 0 0 3px rgba(94, 13, 151, 0.1)",
    },
  },
  button: {
    background: "linear-gradient(90deg, #5e0d97 0%, #7b1fa2 100%)",
    color: "white",
    border: "none",
    padding: "16px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
    marginTop: "10px",
    ":hover": {
      background: "linear-gradient(90deg, #7b1fa2 0%, #5e0d97 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 5px 15px rgba(94, 13, 151, 0.3)",
    },
    ":disabled": {
      opacity: "0.7",
      cursor: "not-allowed",
      background: "#aaa",
    },
  },
  spinner: {
    display: "inline-block",
    width: "20px",
    height: "20px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderRadius: "50%",
    borderTopColor: "white",
    animation: "spin 1s ease-in-out infinite",
    "@keyframes spin": {
      to: { transform: "rotate(360deg)" },
    },
  },
  otpText: {
    textAlign: "center",
    color: "#666",
    marginBottom: "20px",
    lineHeight: "1.5",
  },
  hint: {
    color: "#888",
    fontSize: "12px",
  },
  resendText: {
    textAlign: "center",
    color: "#666",
    marginTop: "20px",
    fontSize: "14px",
  },
  resendButton: {
    background: "none",
    border: "none",
    color: "#5e0d97",
    cursor: "pointer",
    fontWeight: "600",
    padding: "0 5px",
    ":hover": {
      textDecoration: "underline",
    },
    ":disabled": {
      color: "#999",
      cursor: "not-allowed",
    },
  },
  loginText: {
    textAlign: "center",
    color: "#666",
    marginTop: "20px",
    fontSize: "14px",
  },
  loginLink: {
    background: "none",
    border: "none",
    color: "#5e0d97",
    cursor: "pointer",
    fontWeight: "600",
    padding: "0 5px",
    ":hover": {
      textDecoration: "underline",
    },
  },
};

export default PatientRegistration;
