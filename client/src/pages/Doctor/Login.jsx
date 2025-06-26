import React, { useState, useEffect } from "react";
import {
  FaUserMd,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaHospital,
  FaShieldAlt,
  FaStethoscope,
} from "react-icons/fa";
import { MdEmail, MdFingerprint } from "react-icons/md";
import { RiHospitalLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  useEffect(() => {
    // Check for saved credentials if "Remember me" was checked previously
    const savedEmail = localStorage.getItem("doctorEmail");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    if (savedEmail && savedRememberMe) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      triggerValidationError();
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Login attempted with:", { email, password, rememberMe });

      if (rememberMe) {
        localStorage.setItem("doctorEmail", email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("doctorEmail");
        localStorage.removeItem("rememberMe");
      }

      setIsLoading(false);
    }, 1500);
  };

  const triggerValidationError = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="login-container">
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="login-left">
        <div className="login-hero">
          <div className="logo-brand">
            <FaStethoscope className="logo-icon" />
            <span>MediCare Pro</span>
          </div>

          <div className="illustration-container"></div>

          <h1>Welcome Back, Doctor</h1>
          <p className="hero-subtitle">
            Secure access to your professional medical dashboard
          </p>

          <div className="security-badge">
            <FaShieldAlt className="security-icon" />
            <span>HIPAA Compliant • End-to-End Encrypted</span>
          </div>

          <div className="medical-benefits">
            <div className="benefit-item">
              <div className="benefit-icon pulse-animation">
                <RiHospitalLine />
              </div>
              <div className="benefit-text">
                <h3>Patient Records</h3>
                <p>Full access to medical histories and test results</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon pulse-animation">
                <FaUserMd />
              </div>
              <div className="benefit-text">
                <h3>Appointments</h3>
                <p>Manage your schedule and patient visits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className={`login-form-container ${shake ? "shake" : ""}`}>
          <div className="auth-header">
            <div className="doctor-icon-container">
              <FaUserMd className="doctor-icon" />
              <div className="online-indicator"></div>
            </div>
            <h2>Doctor Portal Login</h2>
            <p className="login-subtitle">
              <span className="secure-connection">
                <FaLock className="lock-icon" /> Secure connection
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div
              className={`input-group ${
                activeInput === "email" ? "active" : ""
              }`}
            >
              <label htmlFor="email">Hospital Email or ID</label>
              <div className="input-wrapper">
                <MdEmail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@hospital.org"
                  required
                  onFocus={() => setActiveInput("email")}
                  onBlur={() => setActiveInput(null)}
                />
              </div>
            </div>

            <div
              className={`input-group ${
                activeInput === "password" ? "active" : ""
              }`}
            >
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  onFocus={() => setActiveInput("password")}
                  onBlur={() => setActiveInput(null)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="password-strength">
                <div
                  className={`strength-bar ${
                    password.length > 0 ? "active" : ""
                  } ${password.length >= 8 ? "strong" : ""}`}
                ></div>
              </div>
            </div>

            <div className="login-options">
              <div className="remember-me">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Remember me</span>
                </label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Authenticating...</span>
                </>
              ) : (
                "Access Medical Dashboard"
              )}
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="alternative-auth">
              <button type="button" className="auth-method">
                <MdFingerprint className="auth-icon" />
                <span>Biometric Login</span>
              </button>
              <button type="button" className="auth-method">
                <FaHospital className="auth-icon" />
                <span>Hospital SSO</span>
              </button>
            </div>

            <p className="signup-text">
              New to MediCare Pro?{" "}
              <Link to="/register" className="signup-link">
                Request physician access
              </Link>
            </p>
          </form>
        </div>

        <div className="login-footer">
          <div className="compliance-badges">
            <span className="compliance-item">HIPAA Compliant</span>
            <span className="compliance-item">GDPR Ready</span>
            <span className="compliance-item">ISO 27001 Certified</span>
          </div>
          <p>
            © {new Date().getFullYear()} MediCare Pro EHR System. All rights
            reserved.
          </p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/security">Security</Link>
            <Link to="/contact">Support</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        :root {
          --primary-color: #2563eb;
          --primary-dark: #1d4ed8;
          --primary-light: #dbeafe;
          --secondary-color: #10b981;
          --accent-color: #f59e0b;
          --error-color: #ef4444;
          --text-dark: #1e293b;
          --text-medium: #475569;
          --text-light: #64748b;
          --bg-light: #f8fafc;
          --border-radius: 12px;
          --border-radius-lg: 16px;
          --box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
          --box-shadow-hover: 0 8px 40px rgba(0, 0, 0, 0.12);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Base Styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-5px);
          }
          40%,
          80% {
            transform: translateX(5px);
          }
        }

        .login-container {
          display: flex;
          min-height: 100vh;
          font-family: "Inter", "Poppins", sans-serif;
          position: relative;
          overflow: hidden;
        }

        .background-elements {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.05);
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          left: -100px;
        }

        .circle-2 {
          width: 200px;
          height: 200px;
          bottom: 50px;
          right: 100px;
        }

        .circle-3 {
          width: 150px;
          height: 150px;
          top: 200px;
          right: -50px;
        }

        /* Left Side - Hero Section */
        .login-left {
          flex: 1;
          background: linear-gradient(
            135deg,
            var(--primary-color),
            var(--primary-dark)
          );
          color: white;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .login-left::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0V0zm20 20v60h60V20H20zm20 10a10 10 0 0 1 10-10 10 10 0 0 1 10 10 10 10 0 0 1-10 10 10 10 0 0 1-10-10z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
          z-index: -1;
        }

        .logo-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 60px;
          font-size: 20px;
          font-weight: 600;
        }

        .logo-icon {
          font-size: 28px;
          color: white;
        }

        .illustration-container {
          margin: 40px 0;
          animation: float 6s ease-in-out infinite;
        }

        .doctor-illustration {
          width: 100%;
          max-width: 400px;
          height: auto;
        }

        .login-hero {
          position: relative;
          z-index: 2;
          max-width: 600px;
        }

        .login-left h1 {
          font-size: 40px;
          margin-bottom: 16px;
          font-weight: 700;
          line-height: 1.3;
        }

        .hero-subtitle {
          font-size: 18px;
          margin-bottom: 40px;
          opacity: 0.9;
          line-height: 1.6;
          max-width: 500px;
        }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          padding: 12px 16px;
          border-radius: var(--border-radius);
          margin: 30px 0;
          width: fit-content;
          font-size: 14px;
        }

        .security-icon {
          color: var(--secondary-color);
          font-size: 18px;
        }

        .medical-benefits {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 40px;
        }

        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .benefit-icon {
          width: 40px;
          height: 40px;
          background-color: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          color: white;
        }

        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }

        .benefit-text h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .benefit-text p {
          font-size: 15px;
          opacity: 0.8;
          line-height: 1.5;
        }

        /* Right Side - Login Form */
        .login-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 40px;
          background-color: var(--bg-light);
          position: relative;
          z-index: 1;
        }

        .login-form-container {
          width: 100%;
          max-width: 480px;
          background: white;
          padding: 50px;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--box-shadow);
          transition: var(--transition);
          position: relative;
        }

        .login-form-container:hover {
          box-shadow: var(--box-shadow-hover);
        }

        .shake {
          animation: shake 0.5s;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .doctor-icon-container {
          position: relative;
          display: inline-block;
          margin-bottom: 20px;
        }

        .doctor-icon {
          font-size: 50px;
          color: var(--primary-color);
          background: var(--primary-light);
          padding: 20px;
          border-radius: 50%;
        }

        .online-indicator {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 16px;
          height: 16px;
          background-color: var(--secondary-color);
          border-radius: 50%;
          border: 3px solid white;
        }

        .login-form-container h2 {
          font-size: 28px;
          color: var(--text-dark);
          margin-bottom: 8px;
          font-weight: 700;
        }

        .login-subtitle {
          color: var(--text-light);
          font-size: 15px;
        }

        .secure-connection {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--secondary-color);
          font-weight: 500;
        }

        .lock-icon {
          font-size: 14px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group {
          text-align: left;
          position: relative;
        }

        .input-group.active label {
          color: var(--primary-color);
        }

        .input-group label {
          display: block;
          margin-bottom: 10px;
          font-size: 14px;
          color: var(--text-medium);
          font-weight: 500;
          transition: var(--transition);
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
          font-size: 18px;
          transition: var(--transition);
        }

        .input-group.active .input-icon {
          color: var(--primary-color);
        }

        .input-wrapper input {
          width: 100%;
          padding: 16px 16px 16px 50px;
          border: 1px solid #e2e8f0;
          border-radius: var(--border-radius);
          font-size: 15px;
          transition: var(--transition);
          background-color: #f8fafc;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: var(--primary-color);
          background-color: white;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          font-size: 18px;
          transition: var(--transition);
        }

        .password-toggle:hover {
          color: var(--primary-color);
        }

        .password-strength {
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          margin-top: 8px;
          overflow: hidden;
        }

        .strength-bar {
          height: 100%;
          width: 0%;
          background: var(--error-color);
          transition: var(--transition);
        }

        .strength-bar.active {
          width: 30%;
          background: var(--accent-color);
        }

        .strength-bar.strong {
          width: 100%;
          background: var(--secondary-color);
        }

        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkmark {
          height: 18px;
          width: 18px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .checkbox-container input:checked ~ .checkmark {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
        }

        .checkmark::after {
          content: "✓";
          color: white;
          font-size: 12px;
          display: none;
        }

        .checkbox-container input:checked ~ .checkmark::after {
          display: block;
        }

        .checkbox-label {
          color: var(--text-medium);
        }

        .forgot-password {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
        }

        .forgot-password:hover {
          text-decoration: underline;
          color: var(--primary-dark);
        }

        .login-button {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 16px;
          border-radius: var(--border-radius);
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .login-button:hover {
          background-color: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .login-button:disabled {
          background-color: #cbd5e1;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .divider {
          display: flex;
          align-items: center;
          color: var(--text-light);
          font-size: 14px;
          margin: 20px 0;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid #e2e8f0;
        }

        .divider::before {
          margin-right: 10px;
        }

        .divider::after {
          margin-left: 10px;
        }

        .alternative-auth {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .auth-method {
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: var(--border-radius);
          background-color: white;
          color: var(--text-dark);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .auth-method:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }

        .auth-icon {
          font-size: 18px;
        }

        .signup-text {
          color: var(--text-light);
          font-size: 15px;
          margin-top: 20px;
          text-align: center;
        }

        .signup-link {
          color: var(--primary-color);
          font-weight: 500;
          text-decoration: none;
          transition: var(--transition);
        }

        .signup-link:hover {
          text-decoration: underline;
        }

        .login-footer {
          margin-top: 60px;
          text-align: center;
          color: var(--text-light);
          font-size: 13px;
          width: 100%;
        }

        .compliance-badges {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .compliance-item {
          background: rgba(203, 213, 225, 0.3);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 15px;
          flex-wrap: wrap;
        }

        .footer-links a {
          color: var(--text-light);
          text-decoration: none;
          transition: var(--transition);
        }

        .footer-links a:hover {
          color: var(--primary-color);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .login-left h1 {
            font-size: 36px;
          }

          .doctor-illustration {
            max-width: 350px;
          }
        }

        @media (max-width: 992px) {
          .login-left {
            padding: 40px;
          }

          .login-right {
            padding: 40px;
          }

          .login-form-container {
            padding: 40px;
          }
        }

        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
            min-height: auto;
          }

          .login-left,
          .login-right {
            padding: 60px 30px;
            flex: none;
          }

          .login-left {
            text-align: center;
            padding-bottom: 40px;
          }

          .medical-benefits {
            align-items: center;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          }

          .security-badge {
            margin-left: auto;
            margin-right: auto;
          }

          .logo-brand {
            margin-bottom: 40px;
          }

          .illustration-container {
            margin: 30px 0;
          }

          .login-footer {
            margin-top: 40px;
          }
        }

        @media (max-width: 576px) {
          .login-left,
          .login-right {
            padding: 40px 20px;
          }

          .login-left h1 {
            font-size: 32px;
          }

          .login-form-container {
            padding: 30px 25px;
          }

          .alternative-auth {
            grid-template-columns: 1fr;
          }

          .login-options {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .compliance-badges {
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }

          .footer-links {
            gap: 12px;
          }
        }

        @media (max-width: 400px) {
          .login-left h1 {
            font-size: 28px;
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .login-form-container h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
