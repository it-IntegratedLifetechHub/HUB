import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Updated import

const HubRegistration = () => {
  const navigate = useNavigate(); // ✅ Replaces useHistory
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    if (apiError) setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setApiError("");

      try {
        const { email, password } = formData;
        const body = JSON.stringify({ email, password });

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/hub/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body,
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.msg || "Registration failed");
        }

        const data = await res.json();
        localStorage.setItem("adminToken", data.token);

        setIsSubmitting(false);
        setRegistrationSuccess(true);
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/hub/dashboard"); // ✅ Updated navigation
        }, 2000);
      } catch (err) {
        setIsSubmitting(false);
        setApiError(err.message || "Server error. Please try again later.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Registration</h1>
          <p style={styles.subtitle}>Create your admin account</p>
        </div>

        {apiError && (
          <div style={styles.errorAlert}>
            <svg style={styles.errorIcon} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
              />
            </svg>
            <span style={styles.errorAlertText}>{apiError}</span>
          </div>
        )}

        {registrationSuccess ? (
          <div style={styles.successMessage}>
            <svg style={styles.successIcon} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
              />
            </svg>
            <h2 style={styles.successTitle}>Registration Successful!</h2>
            <p style={styles.successText}>
              Your admin account has been created. Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.email && styles.inputError),
                }}
                placeholder="Enter your email"
              />
              {errors.email && (
                <span style={styles.errorText}>{errors.email}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.password && styles.inputError),
                }}
                placeholder="Create a password (min 8 chars)"
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
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.confirmPassword && styles.inputError),
                }}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <span style={styles.errorText}>{errors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(isSubmitting && styles.submitButtonDisabled),
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg style={styles.spinner} viewBox="0 0 50 50">
                    <circle
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                    ></circle>
                  </svg>
                  Registering...
                </>
              ) : (
                "Register Admin Account"
              )}
            </button>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                Already have an account?{" "}
                <a href="/hub/login" style={styles.footerLink}>
                  Sign in
                </a>
              </p>
            </div>
          </form>
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
    backgroundColor: "#f5f7fa",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
    width: "100%",
    maxWidth: "480px",
    padding: "40px",
    transition: "all 0.3s ease",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    color: "#2d3748",
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#718096",
    fontSize: "16px",
    margin: "0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#4a5568",
    fontSize: "14px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "16px",
    color: "#2d3748",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    backgroundColor: "#f8fafc",
  },
  inputError: {
    borderColor: "#e53e3e",
    backgroundColor: "#fff5f5",
  },
  inputFocus: {
    borderColor: "#4299e1",
    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.2)",
    outline: "none",
  },
  errorText: {
    color: "#e53e3e",
    fontSize: "14px",
    marginTop: "6px",
    display: "block",
  },
  submitButton: {
    backgroundColor: "#4299e1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "16px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
  },
  submitButtonHover: {
    backgroundColor: "#3182ce",
    transform: "translateY(-1px)",
  },
  submitButtonDisabled: {
    backgroundColor: "#a0aec0",
    cursor: "not-allowed",
  },
  spinner: {
    animation: "spin 1s linear infinite",
    width: "20px",
    height: "20px",
  },
  footer: {
    textAlign: "center",
    marginTop: "24px",
  },
  footerText: {
    color: "#718096",
    fontSize: "14px",
  },
  footerLink: {
    color: "#4299e1",
    textDecoration: "none",
    fontWeight: "600",
  },
  footerLinkHover: {
    textDecoration: "underline",
  },
  successMessage: {
    textAlign: "center",
    padding: "20px 0",
  },
  successIcon: {
    width: "64px",
    height: "64px",
    color: "#48bb78",
    marginBottom: "16px",
  },
  successTitle: {
    color: "#2d3748",
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "12px",
  },
  successText: {
    color: "#718096",
    fontSize: "16px",
    marginBottom: "24px",
  },
  successButton: {
    backgroundColor: "#48bb78",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    margin: "0 auto",
  },
  successButtonHover: {
    backgroundColor: "#38a169",
    transform: "translateY(-1px)",
  },
};

export default HubRegistration;
