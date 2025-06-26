import React, { useState, useEffect } from "react";
import {
  FaUserMd,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaHospital,
  FaUser,
  FaIdCard,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { MdEmail, MdDateRange, MdVerifiedUser } from "react-icons/md";
import { RiHospitalLine, RiStethoscopeLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    doctorId: "",
    specialization: "",
    phone: "",
    hospital: "",
    licenseNumber: "",
    password: "",
    confirmPassword: "",
    address: "",
    dateOfBirth: "",
    termsAgreed: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    else {
      const dob = new Date(formData.dateOfBirth);
      const ageDiff = Date.now() - dob.getTime();
      const ageDate = new Date(ageDiff);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (age < 25) newErrors.dateOfBirth = "You must be at least 25 years old";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.doctorId.trim()) newErrors.doctorId = "Doctor ID is required";
    if (!formData.specialization)
      newErrors.specialization = "Specialization is required";
    if (!formData.licenseNumber.trim())
      newErrors.licenseNumber = "License number is required";
    else if (!/^[A-Za-z0-9-]+$/.test(formData.licenseNumber))
      newErrors.licenseNumber = "Invalid license format";
    if (!formData.hospital.trim()) newErrors.hospital = "Hospital is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[\d\s+-]+$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (passwordStrength < 3) newErrors.password = "Password too weak";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.termsAgreed)
      newErrors.termsAgreed = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep3()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Registration submitted:", formData);
        setIsLoading(false);
        // Here you would typically redirect to success page
      }, 1500);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "#e74c3c";
      case 1:
        return "#e74c3c";
      case 2:
        return "#f39c12";
      case 3:
        return "#27ae60";
      case 4:
        return "#2ecc71";
      default:
        return "#e0e0e0";
    }
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Moderate";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  return (
    <div className="register-container">
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="register-left">
        <div className="register-hero">
          <div className="logo-brand">
            <RiStethoscopeLine className="logo-icon" />
            <span>MediCare Pro</span>
          </div>

          <div className="illustration-container"></div>

          <h1>Join Our Medical Network</h1>
          <p className="hero-subtitle">
            Register for exclusive access to our advanced healthcare platform
          </p>

          <div className="security-badge">
            <FaShieldAlt className="security-icon" />
            <span>HIPAA Compliant • End-to-End Encrypted</span>
          </div>

          <div className="medical-benefits">
            <div className="benefit-item">
              <div className="benefit-icon">
                <RiHospitalLine />
              </div>
              <div className="benefit-text">
                <h3>Patient Records</h3>
                <p>Full access to medical histories and test results</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
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

      <div className="register-right">
        <div className="register-form-container">
          <div className="auth-header">
            <div className="doctor-icon-container">
              <FaUserMd className="doctor-icon" />
              <div className="online-indicator"></div>
            </div>
            <h2>Doctor Registration</h2>
            <p className="register-subtitle">
              <span className="secure-connection">
                <FaLock className="lock-icon" /> Secure registration process
              </span>
            </p>
          </div>

          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
              <div className="step-number">1</div>
              <p>Personal Info</p>
            </div>
            <div
              className={`connector ${currentStep >= 2 ? "active" : ""}`}
            ></div>
            <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
              <div className="step-number">2</div>
              <p>Professional</p>
            </div>
            <div
              className={`connector ${currentStep >= 3 ? "active" : ""}`}
            ></div>
            <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
              <div className="step-number">3</div>
              <p>Account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {currentStep === 1 && (
              <div className="step-content">
                <div className="input-group">
                  <label htmlFor="firstName">
                    First Name{" "}
                    {errors.firstName && (
                      <span className="error-indicator">!</span>
                    )}
                  </label>
                  <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className={errors.firstName ? "error" : ""}
                    />
                  </div>
                  {errors.firstName && (
                    <span className="error-message">
                      <span className="error-arrow">▲</span>
                      {errors.firstName}
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="lastName">
                    Last Name{" "}
                    {errors.lastName && (
                      <span className="error-indicator">!</span>
                    )}
                  </label>
                  <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className={errors.lastName ? "error" : ""}
                    />
                  </div>
                  {errors.lastName && (
                    <span className="error-message">
                      <span className="error-arrow">▲</span>
                      {errors.lastName}
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="email">
                    Email Address{" "}
                    {errors.email && <span className="error-indicator">!</span>}
                  </label>
                  <div className="input-wrapper">
                    <MdEmail className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={errors.email ? "error" : ""}
                    />
                  </div>
                  {errors.email && (
                    <span className="error-message">
                      <span className="error-arrow">▲</span>
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="dateOfBirth">
                    Date of Birth{" "}
                    {errors.dateOfBirth && (
                      <span className="error-indicator">!</span>
                    )}
                  </label>
                  <div className="input-wrapper">
                    <MdDateRange className="input-icon" />
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={errors.dateOfBirth ? "error" : ""}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <span className="error-message">
                      <span className="error-arrow">▲</span>
                      {errors.dateOfBirth}
                    </span>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content">
                <div className="input-group">
                  <label htmlFor="doctorId">
                    Doctor ID{" "}
                    {errors.doctorId && (
                      <span className="error-indicator">!</span>
                    )}
                  </label>
                  <div className="input-wrapper">
                    <FaIdCard className="input-icon" />
                    <input
                      type="text"
                      id="doctorId"
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleChange}
                      placeholder="Hospital issued ID"
                      className={errors.doctorId ? "error" : ""}
                    />
                  </div>
                  {errors.doctorId && (
                    <span className="error-message">
                      <span className="error-arrow">▲</span>
                      {errors.doctorId}
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="specialization">
                    Specialization{" "}
                    {errors.specialization && (
                      <span className="error-indicator">!</span>
                    )}
                  </label>
                  <div className="input-wrapper">
                    <FaUserMd className="input-icon" />
                    <select
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className={errors.specialization ? "error" : ""}
                    >
                      <option value="">Select your specialization</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Endocrinology">Endocrinology</option>
                      <option value="Family Medicine">Family Medicine</option>
                      <option value="Gastroenterology">Gastroenterology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Oncology">Oncology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Psychiatry">Psychiatry</option>
                      <option value="Surgery">Surgery</option>
                    </select>
                  </div>
                  {errors.specialization && (
                    <span className="error-message">
                      <span className="error-arrow">▲</span>
                      {errors.specialization}
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="licenseNumber">
                    Medical License{" "}
                    {errors.licenseNumber && (
                      <span className="error-indicator">!</span>
                    )}
                  </label>
                  <div className="input-wrapper">
                    <MdVerifiedUser className="input-icon" />
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="State issued license number"
                      className={errors.licenseNumber ? "error" : ""}
                    />
                  </div>
                  {errors.licenseNumber && (
                    <span className="error-message">
                      <span className="error-arrow">▲</span>
                      {errors.licenseNumber}
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="hospital">
                    Hospital/Clinic{" "}
                    {errors.hospital && (
                      <span className="error-indicator">!</span>
                    )}
                  </label>
                  <div className="input-wrapper">
                    <FaHospital className="input-icon" />
                    <input
                      type="text"
                      id="hospital"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleChange}
                      placeholder="Where you practice"
                      className={errors.hospital ? "error" : ""}
                    />
                  </div>
                  {errors.hospital && (
                    <span className="error-message">
                      <span className="error-arrow">▲</span>
                      {errors.hospital}
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="phone">
                    Phone Number{" "}
                    {errors.phone && <span className="error-indicator">!</span>}
                  </label>
                  <div className="input-wrapper">
                    <FaPhone className="input-icon" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (___) ___-____"
                      className={errors.phone ? "error" : ""}
                    />
                  </div>
                  {errors.phone && (
                    <span className="error-message">
                      <span className="error-arrow">▲</span>
                      {errors.phone}
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="address">Practice Address</label>
                  <div className="input-wrapper">
                    <FaMapMarkerAlt className="input-icon" />
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Full practice address"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-content">
                <div className="input-group">
                  <label htmlFor="password">
                    Password{" "}
                    {errors.password && (
                      <span className="error-indicator">!</span>
                    )}
                  </label>
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className={errors.password ? "error" : ""}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error-message">
                      <span className="error-arrow">▲</span>
                      {errors.password}
                    </span>
                  )}
                  <div className="password-strength">
                    <div className="strength-meter">
                      <div
                        className="strength-bar"
                        style={{
                          width: `${passwordStrength * 25}%`,
                          backgroundColor: getPasswordStrengthColor(),
                        }}
                      ></div>
                    </div>
                    <span className="strength-label">
                      Strength:{" "}
                      <strong style={{ color: getPasswordStrengthColor() }}>
                        {getPasswordStrengthLabel()}
                      </strong>
                    </span>
                  </div>
                  <div className="password-requirements">
                    <p>Password must contain:</p>
                    <ul>
                      <li
                        className={formData.password.length >= 8 ? "met" : ""}
                      >
                        At least 8 characters
                      </li>
                      <li
                        className={/[A-Z]/.test(formData.password) ? "met" : ""}
                      >
                        One uppercase letter
                      </li>
                      <li
                        className={/[0-9]/.test(formData.password) ? "met" : ""}
                      >
                        One number
                      </li>
                      <li
                        className={
                          /[^A-Za-z0-9]/.test(formData.password) ? "met" : ""
                        }
                      >
                        One special character
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="confirmPassword">
                    Confirm Password{" "}
                    {errors.confirmPassword && (
                      <span className="error-indicator">!</span>
                    )}
                  </label>
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className={errors.confirmPassword ? "error" : ""}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="error-message">
                      <span className="error-arrow">▲</span>
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>

                <div className="terms-agreement">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      id="termsAgreed"
                      name="termsAgreed"
                      checked={formData.termsAgreed}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-label">
                      I agree to the <Link to="/terms">Terms of Service</Link>{" "}
                      and <Link to="/privacy">Privacy Policy</Link>
                    </span>
                  </label>
                  {errors.termsAgreed && (
                    <span className="error-message terms-error">
                      <span className="error-arrow">▲</span>
                      {errors.termsAgreed}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="form-navigation">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="back-button"
                  onClick={prevStep}
                >
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  className="next-button"
                  onClick={nextStep}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="register-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              )}
            </div>
          </form>

          <p className="login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>

        <div className="register-footer">
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

        .register-container {
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
        .register-left {
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

        .register-left::before {
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

        .register-hero {
          position: relative;
          z-index: 2;
          max-width: 600px;
        }

        .register-left h1 {
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

        /* Right Side - Registration Form */
        .register-right {
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

        .register-form-container {
          width: 100%;
          max-width: 500px;
          background: white;
          padding: 50px;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--box-shadow);
          transition: var(--transition);
          position: relative;
        }

        .register-form-container:hover {
          box-shadow: var(--box-shadow-hover);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 30px;
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

        .register-form-container h2 {
          font-size: 28px;
          color: var(--text-dark);
          margin-bottom: 8px;
          font-weight: 700;
        }

        .register-subtitle {
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

        .progress-steps {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          position: relative;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e0e0e0;
          color: var(--text-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          font-weight: 600;
          transition: var(--transition);
        }

        .step.active .step-number {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .step p {
          font-size: 13px;
          color: var(--text-light);
          font-weight: 500;
          transition: var(--transition);
        }

        .step.active p {
          color: var(--primary-color);
          font-weight: 600;
        }

        .connector {
          flex: 1;
          height: 2px;
          background: #e0e0e0;
          margin: 0 10px;
          position: relative;
          top: -15px;
          transition: var(--transition);
        }

        .connector.active {
          background: var(--primary-color);
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .step-content {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0.5;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .input-group {
          text-align: left;
          position: relative;
        }

        .input-group label {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          font-size: 14px;
          color: var(--text-medium);
          font-weight: 500;
          transition: var(--transition);
        }

        .error-indicator {
          margin-left: 6px;
          color: var(--error-color);
          font-weight: bold;
          font-size: 12px;
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

        .input-wrapper input,
        .input-wrapper select {
          width: 100%;
          padding: 16px 16px 16px 50px;
          border: 1px solid #e2e8f0;
          border-radius: var(--border-radius);
          font-size: 15px;
          transition: var(--transition);
          background-color: #f8fafc;
          font-family: "Inter", sans-serif;
        }

        .input-wrapper input:focus,
        .input-wrapper select:focus {
          outline: none;
          border-color: var(--primary-color);
          background-color: white;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .input-wrapper input.error,
        .input-wrapper select.error {
          border-color: var(--error-color);
          background-color: #fff5f5;
        }

        .error-message {
          color: var(--error-color);
          font-size: 12px;
          margin-top: 8px;
          display: block;
          position: relative;
          padding-left: 12px;
        }

        .error-arrow {
          position: absolute;
          left: 0;
          top: 0;
          font-size: 12px;
        }

        .terms-error {
          margin-top: 5px;
          margin-left: 28px;
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
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
        }

        .strength-meter {
          flex: 1;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .strength-bar {
          height: 100%;
          width: 0%;
          transition: var(--transition);
        }

        .strength-label {
          font-size: 12px;
          color: var(--text-light);
        }

        .password-requirements {
          margin-top: 15px;
          text-align: left;
        }

        .password-requirements p {
          font-size: 12px;
          color: var(--text-light);
          margin-bottom: 8px;
        }

        .password-requirements ul {
          list-style: none;
          padding-left: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .password-requirements li {
          font-size: 12px;
          color: var(--text-light);
          position: relative;
          padding-left: 18px;
        }

        .password-requirements li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #cbd5e1;
        }

        .password-requirements li.met:before {
          color: var(--secondary-color);
        }

        .terms-agreement {
          margin: 25px 0 15px;
        }

        .checkbox-container {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          user-select: none;
          position: relative;
        }

        .checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkmark {
          min-width: 18px;
          height: 18px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          margin-top: 2px;
        }

        .checkbox-container input:checked ~ .checkmark {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
        }

        .checkmark:after {
          content: "✓";
          color: white;
          font-size: 12px;
          display: none;
        }

        .checkbox-container input:checked ~ .checkmark:after {
          display: block;
        }

        .checkbox-label {
          font-size: 14px;
          color: var(--text-medium);
          line-height: 1.5;
        }

        .checkbox-label a {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
        }

        .checkbox-label a:hover {
          text-decoration: underline;
        }

        .form-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
          gap: 15px;
        }

        .back-button {
          background: white;
          border: 1px solid #e2e8f0;
          color: var(--text-medium);
          padding: 16px;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          flex: 1;
        }

        .back-button:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }

        .next-button,
        .register-button {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 16px;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          flex: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .next-button:hover,
        .register-button:hover {
          background-color: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .register-button:disabled {
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

        .login-link {
          color: var(--text-light);
          font-size: 15px;
          margin-top: 25px;
          text-align: center;
        }

        .login-link a {
          color: var(--primary-color);
          font-weight: 500;
          text-decoration: none;
          transition: var(--transition);
        }

        .login-link a:hover {
          text-decoration: underline;
        }

        .register-footer {
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
          .register-left h1 {
            font-size: 36px;
          }

          .doctor-illustration {
            max-width: 350px;
          }
        }

        @media (max-width: 992px) {
          .register-left {
            padding: 40px;
          }

          .register-right {
            padding: 40px;
          }

          .register-form-container {
            padding: 40px;
          }
        }

        @media (max-width: 768px) {
          .register-container {
            flex-direction: column;
            min-height: auto;
          }

          .register-left,
          .register-right {
            padding: 60px 30px;
            flex: none;
          }

          .register-left {
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

          .register-footer {
            margin-top: 40px;
          }
        }

        @media (max-width: 576px) {
          .register-left,
          .register-right {
            padding: 40px 20px;
          }

          .register-left h1 {
            font-size: 32px;
          }

          .register-form-container {
            padding: 30px 25px;
          }

          .progress-steps p {
            font-size: 11px;
          }

          .form-navigation {
            flex-direction: column;
            gap: 12px;
          }

          .next-button,
          .register-button {
            flex: 1;
            width: 100%;
          }

          .password-requirements ul {
            grid-template-columns: 1fr;
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
          .register-left h1 {
            font-size: 28px;
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .register-form-container h2 {
            font-size: 24px;
          }

          .step p {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Registration;
