import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HubLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (loginError) setLoginError("");
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      setLoginError("");

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/hub/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Login failed");
        }

        if (rememberMe) {
          localStorage.setItem("adminToken", data.token);
        } else {
          localStorage.setItem("adminToken", data.token);
        }

        navigate("/hub/dashboard");
      } catch (err) {
        setIsSubmitting(false);
        setLoginError(err.message || "Server error. Please try again later.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Login</h1>
          <p style={styles.subtitle}>Access your admin dashboard</p>
        </div>

        {loginError && (
          <div style={styles.errorAlert}>
            <svg style={styles.errorIcon} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
              />
            </svg>
            <span style={styles.errorAlertText}>{loginError}</span>
          </div>
        )}

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
              autoFocus
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
              placeholder="Enter your password"
            />
            {errors.password && (
              <span style={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <div style={styles.rememberForgot}>
            <label style={styles.rememberMe}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span style={styles.rememberText}>Remember me</span>
            </label>
            <a href="/forgot-password" style={styles.forgotPassword}>
              Forgot password?
            </a>
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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Don't have an account?{" "}
              <a href="/hub/registration" style={styles.footerLink}>
                Register
              </a>
            </p>
          </div>
        </form>
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
  errorText: {
    color: "#e53e3e",
    fontSize: "14px",
    marginTop: "6px",
    display: "block",
  },
  rememberForgot: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  rememberMe: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  checkbox: {
    marginRight: "8px",
    width: "16px",
    height: "16px",
    accentColor: "#4299e1",
  },
  rememberText: {
    color: "#4a5568",
    fontSize: "14px",
  },
  forgotPassword: {
    color: "#4299e1",
    fontSize: "14px",
    textDecoration: "none",
    fontWeight: "600",
  },
  forgotPasswordHover: {
    textDecoration: "underline",
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
    paddingTop: "16px",
    borderTop: "1px solid #e2e8f0",
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
  errorAlert: {
    backgroundColor: "#fff5f5",
    borderLeft: "4px solid #e53e3e",
    padding: "16px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    borderRadius: "4px",
  },
  errorIcon: {
    width: "20px",
    height: "20px",
    color: "#e53e3e",
    marginRight: "12px",
    flexShrink: "0",
  },
  errorAlertText: {
    color: "#e53e3e",
    fontSize: "14px",
    fontWeight: "500",
  },
};

// Add keyframes for spinner animation
const styleTag = document.createElement("style");
styleTag.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleTag);

export default HubLogin;
