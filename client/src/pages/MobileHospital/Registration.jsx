import React, { useState, useEffect } from "react";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    vehicleNumber: "",
    licenseNumber: "",
    city: "",
    otp: "",
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpAlert, setShowOtpAlert] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [step, setStep] = useState(1); // 1: Basic info, 2: OTP verification

  useEffect(() => {
    if (isOtpSent && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isOtpSent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Validate basic info first
    setTimeout(() => {
      setIsOtpSent(true);
      setIsLoading(false);
      setShowOtpAlert(true);
      setStep(2);
      setCountdown(30);
      console.log("Registration data:", formData);
    }, 1500);
  };

  const handleVerifyAndRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate registration
    setTimeout(() => {
      console.log("Registration complete with OTP:", formData.otp);
      setIsLoading(false);
      // Here you would typically complete registration
    }, 1500);
  };

  const handleResendOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShowOtpAlert(true);
      setIsLoading(false);
      setCountdown(30);
    }, 1500);
  };

  return (
    <div className="registration-container">
      {/* OTP Alert Notification */}
      {showOtpAlert && (
        <div className="otp-alert">
          <div className="otp-alert-content">
            <h3>
              Your OTP is: <span className="otp-code">123456</span>
            </h3>
            <p>This OTP is valid for 5 minutes</p>
            <button onClick={() => setShowOtpAlert(false)}>OK</button>
          </div>
        </div>
      )}

      <div className="registration-card">
        <div className="registration-header">
          <div className="logo-container">
            <img
              src="/ambulance-icon.png"
              alt="Hospital Logo"
              className="hospital-logo"
            />
            <div className="logo-badge">
              <span>IND</span>
            </div>
          </div>
          <h1>Emergency Medical Dispatch</h1>
          <p>Partner Driver Registration</p>
        </div>

        <form
          onSubmit={step === 1 ? handleSendOtp : handleVerifyAndRegister}
          className="registration-form"
        >
          {step === 1 ? (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Mobile Number</label>
                <div className="phone-input-container">
                  <div className="country-code-selector">
                    <span className="flag">🇮🇳</span>
                    <span>+91</span>
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L6 6L11 1"
                        stroke="#4A5568"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="98765 43210"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="vehicleNumber">Vehicle Number</label>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. MH01AB1234"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="licenseNumber">Driving License Number</label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="Enter license number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">Operating City</label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your city</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="chennai">Chennai</option>
                  <option value="kolkata">Kolkata</option>
                </select>
              </div>
            </>
          ) : (
            <div className="otp-verification-step">
              <div className="verification-message">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="#3182CE"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16V12"
                    stroke="#3182CE"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8H12.01"
                    stroke="#3182CE"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>We've sent a 6-digit OTP to +91 {formData.phoneNumber}</p>
              </div>

              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <div className="otp-input-container">
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="• • • • • •"
                    pattern="[0-9]{6}"
                    maxLength="6"
                    required
                  />
                  <div className="otp-resend">
                    {countdown > 0 ? (
                      <span>Resend OTP in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        className="resend-link"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Resend OTP"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            {step === 2 && (
              <button
                type="button"
                className="back-button"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="registration-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner"></span>
              ) : step === 1 ? (
                "Send OTP"
              ) : (
                "Complete Registration"
              )}
            </button>
          </div>
        </form>

        <div className="registration-footer">
          <div className="emergency-contact">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 16.92V19.92C22 20.47 21.55 20.92 21 20.92H19C18.45 20.92 18 20.47 18 19.92V16.92C18 16.37 18.45 15.92 19 15.92H21C21.55 15.92 22 16.37 22 16.92Z"
                fill="#E53E3E"
              />
              <path
                d="M19 12.92H21C21.55 12.92 22 13.37 22 13.92V15.92C22 16.47 21.55 16.92 21 16.92H19C18.45 16.92 18 16.47 18 15.92V13.92C18 13.37 18.45 12.92 19 12.92Z"
                fill="#E53E3E"
              />
              <path
                d="M10.02 4.28L11.4 2.28C11.72 1.81 12.36 1.71 12.8 2.06L14.42 3.28C14.85 3.63 14.94 4.26 14.62 4.73L13.24 6.73C12.8 7.36 11.9 7.53 11.26 7.1C10.39 6.51 9.56 5.44 10.02 4.28Z"
                fill="#E53E3E"
              />
              <path
                d="M16.65 5.72L18.03 6.94C18.46 7.29 18.46 7.98 18.03 8.33L16.35 9.72C15.92 10.07 15.29 10.07 14.86 9.72C13.92 8.99 12.63 7.62 13.03 6.43L13.93 4.43C14.16 3.81 14.89 3.56 15.47 3.86L16.65 4.43C17.08 4.68 17.08 5.37 16.65 5.72Z"
                fill="#E53E3E"
              />
              <path
                d="M15.55 12.92C15.55 16.03 13.1 18.48 10 18.48C6.89 18.48 4.44 16.03 4.44 12.92C4.44 9.81 6.89 7.36 10 7.36C13.1 7.36 15.55 9.81 15.55 12.92Z"
                fill="#E53E3E"
              />
            </svg>
            For emergencies, call <a href="tel:108">108</a> immediately
          </div>
          <div className="login-link">
            Already registered? <a href="/login">Login here</a>
          </div>
        </div>
      </div>

      <style>
        {`
        /* Base styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        body {
          background-color: #f8fafc;
          background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .registration-container {
          max-width: 100%;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        /* OTP Alert */
        .otp-alert {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .otp-alert-content {
          background: white;
          padding: 25px;
          border-radius: 12px;
          width: 90%;
          max-width: 350px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .otp-alert h3 {
          color: #2d3748;
          margin-bottom: 10px;
          font-size: 18px;
        }

        .otp-code {
          color: #3182ce;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .otp-alert p {
          color: #718096;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .otp-alert button {
          background: #3182ce;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .otp-alert button:hover {
          background: #2c5282;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Registration Card */
        .registration-card {
          width: 100%;
          max-width: 480px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          padding: 30px;
          position: relative;
        }

        .registration-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #e53e3e, #dd6b20);
        }

        /* Header */
        .registration-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .logo-container {
          position: relative;
          display: inline-block;
          margin-bottom: 15px;
        }

        .hospital-logo {
          width: 80px;
          height: 80px;
          object-fit: contain;
        }

        .logo-badge {
          position: absolute;
          bottom: -5px;
          right: -5px;
          background: #e53e3e;
          color: white;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          border: 2px solid white;
        }

        .registration-header h1 {
          color: #2d3748;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .registration-header p {
          color: #718096;
          font-size: 14px;
        }

        /* Form */
        .registration-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #4a5568;
          font-weight: 500;
          font-size: 14px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 14px 15px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          background: #f8fafc;
          color: #2d3748;
          transition: all 0.2s;
        }

        .form-group select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1em;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #3182ce;
          box-shadow: 0 0 0 1px #3182ce;
          outline: none;
          background: white;
        }

        .form-group input::placeholder {
          color: #a0aec0;
        }

        /* Phone Input */
        .phone-input-container {
          display: flex;
          align-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s;
          background: #f8fafc;
        }

        .phone-input-container:focus-within {
          border-color: #3182ce;
          box-shadow: 0 0 0 1px #3182ce;
        }

        .country-code-selector {
          display: flex;
          align-items: center;
          padding: 0 12px;
          background: #edf2f7;
          color: #4a5568;
          font-weight: 500;
          height: 100%;
          gap: 5px;
          cursor: pointer;
        }

        .country-code-selector .flag {
          font-size: 16px;
        }

        /* OTP Section */
        .otp-verification-step {
          margin-top: 15px;
        }

        .verification-message {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ebf8ff;
          padding: 12px 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          color: #3182ce;
          font-size: 14px;
        }

        .verification-message svg {
          flex-shrink: 0;
        }

        .otp-input-container {
          position: relative;
        }

        .otp-input-container input {
          width: 100%;
          padding: 14px 15px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 16px;
          letter-spacing: 5px;
          text-align: center;
          font-weight: 600;
          color: #2d3748;
          background: #f8fafc;
          transition: all 0.2s;
        }

        .otp-input-container input:focus {
          border-color: #3182ce;
          box-shadow: 0 0 0 1px #3182ce;
          outline: none;
          background: white;
        }

        .otp-resend {
          font-size: 13px;
          margin-top: 10px;
          color: #718096;
          text-align: center;
        }

        .resend-link {
          background: none;
          border: none;
          color: #3182ce;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          transition: all 0.2s;
        }

        .resend-link:hover {
          text-decoration: underline;
        }

        .resend-link:disabled {
          color: #a0aec0;
          cursor: not-allowed;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .back-button {
          padding: 0 20px;
          background: #e2e8f0;
          color: #4a5568;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: #cbd5e0;
        }

        .back-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .registration-button {
          flex: 1;
          padding: 16px;
          background: linear-gradient(90deg, #e53e3e, #dd6b20);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .registration-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
        }

        .registration-button:active {
          transform: translateY(0);
        }

        .registration-button:disabled {
          background: #a0aec0;
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
          to { transform: rotate(360deg); }
        }

        /* Footer */
        .registration-footer {
          text-align: center;
          margin-top: 25px;
        }

        .emergency-contact {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #e53e3e;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 15px;
          padding: 8px 15px;
          border-radius: 20px;
          background: rgba(229, 62, 62, 0.1);
        }

        .emergency-contact a {
          color: #e53e3e;
          text-decoration: none;
          font-weight: 600;
        }

        .login-link {
          color: #718096;
          font-size: 13px;
        }

        .login-link a {
          color: #3182ce;
          text-decoration: none;
          font-weight: 500;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .registration-card {
            padding: 25px 20px;
            border-radius: 12px;
          }

          .registration-header h1 {
            font-size: 22px;
          }

          .form-group input,
          .form-group select {
            padding: 12px 14px;
          }

          .registration-button {
            padding: 14px;
          }
        }
        `}
      </style>
    </div>
  );
};

export default Registration;
