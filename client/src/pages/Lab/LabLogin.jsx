import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LabLogin = () => {
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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoginError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lab/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem("labToken", data.token);

        // Redirect to dashboard
        navigate("/lab/dashboard");
      } else {
        setLoginError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <svg style={styles.logoIcon} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V11.99z"
              />
            </svg>
            <span style={styles.logoText}>Laboratory</span>
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your Laboratory dashboard</p>
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
            <div style={styles.inputContainer}>
              <svg style={styles.inputIcon} viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                />
              </svg>
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
            </div>
            {errors.email && (
              <span style={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <div style={styles.inputContainer}>
              <svg style={styles.inputIcon} viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                />
              </svg>
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
            </div>
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
            <a href="/lab/forgot-password" style={styles.forgotPassword}>
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
              <>
                <svg style={styles.buttonIcon} viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                  />
                </svg>
                Sign In
              </>
            )}
          </button>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Don't have an account?{" "}
              <a href="/lab/registration" style={styles.footerLink}>
                Register here
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
    padding: "20px",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    width: "100%",
    maxWidth: "480px",
    padding: "48px 40px",
    transition: "all 0.3s ease",
    overflow: "hidden",
    position: "relative",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
  },
  logoIcon: {
    width: "32px",
    height: "32px",
    color: "#7c3aed",
    marginRight: "12px",
  },
  logoText: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#7c3aed",
    letterSpacing: "-0.5px",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    color: "#1f2937",
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "16px",
    margin: "0",
    fontWeight: "500",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
  },
  inputContainer: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "20px",
    height: "20px",
    color: "#9ca3af",
    zIndex: "1",
  },
  input: {
    width: "100%",
    padding: "14px 16px 14px 48px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    fontSize: "15px",
    color: "#1f2937",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    backgroundColor: "#f9fafb",
    fontWeight: "500",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "13px",
    marginTop: "6px",
    display: "block",
    fontWeight: "500",
  },
  rememberForgot: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  rememberMe: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  checkbox: {
    marginRight: "10px",
    width: "16px",
    height: "16px",
    accentColor: "#7c3aed",
    cursor: "pointer",
  },
  rememberText: {
    color: "#4b5563",
    fontSize: "14px",
    fontWeight: "500",
  },
  forgotPassword: {
    color: "#7c3aed",
    fontSize: "14px",
    textDecoration: "none",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  submitButton: {
    background: "linear-gradient(to right, #7c3aed, #6d28d9)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "16px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 4px 6px rgba(124, 58, 237, 0.2)",
    marginBottom: "24px",
  },
  submitButtonDisabled: {
    background: "#d1d5db",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  buttonIcon: {
    width: "20px",
    height: "20px",
  },
  spinner: {
    animation: "spin 1s linear infinite",
    width: "20px",
    height: "20px",
  },
  divider: {
    position: "relative",
    margin: "20px 0",
    textAlign: "center",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "0",
      right: "0",
      height: "1px",
      backgroundColor: "#e5e7eb",
      zIndex: "1",
    },
  },
  dividerText: {
    position: "relative",
    display: "inline-block",
    padding: "0 12px",
    backgroundColor: "#fff",
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "500",
    zIndex: "2",
  },
  socialButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginBottom: "32px",
  },
  socialButton: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "1px solid #e5e7eb",
    backgroundColor: "transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f9fafb",
    },
  },
  socialIcon: {
    width: "24px",
    height: "24px",
  },
  footer: {
    textAlign: "center",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
  footerText: {
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "500",
  },
  footerLink: {
    color: "#7c3aed",
    textDecoration: "none",
    fontWeight: "600",
    transition: "all 0.2s ease",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  errorAlert: {
    backgroundColor: "#fef2f2",
    borderLeft: "4px solid #ef4444",
    padding: "16px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    borderRadius: "6px",
  },
  errorIcon: {
    width: "20px",
    height: "20px",
    color: "#ef4444",
    marginRight: "12px",
    flexShrink: "0",
  },
  errorAlertText: {
    color: "#ef4444",
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

export default LabLogin;
