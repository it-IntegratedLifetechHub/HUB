import React, { useState, useEffect } from "react";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpAlert, setShowOtpAlert] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (isOtpSent && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isOtpSent]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setIsOtpSent(true);
      setIsLoading(false);
      setShowOtpAlert(true);
      console.log("OTP sent to", phoneNumber);
      setCountdown(30); // Reset countdown
    }, 1500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login verification
    setTimeout(() => {
      console.log("Login attempt with", phoneNumber, otp);
      setIsLoading(false);
      // Here you would typically verify OTP and proceed
    }, 1500);
  };

  const handleResendOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShowOtpAlert(true);
      setIsLoading(false);
      setCountdown(30);
      console.log("OTP resent to", phoneNumber);
    }, 1500);
  };

  return (
    <div className="login-container">
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

      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-badge">
              <span>IND</span>
            </div>
          </div>
          <h1>Emergency Medical Dispatch</h1>
          <p>Partner Driver Login</p>
        </div>

        <form
          onSubmit={isOtpSent ? handleLogin : handleSendOtp}
          className="login-form"
        >
          <div className="form-group">
            <label htmlFor="phone">Mobile Number</label>
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
                id="phone"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, ""))
                }
                placeholder="98765 43210"
                pattern="[0-9]{10}"
                maxLength="10"
                required
                disabled={isOtpSent}
              />
            </div>
          </div>

          {isOtpSent && (
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <div className="otp-input-container">
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
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
          )}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner"></span>
            ) : isOtpSent ? (
              "Verify & Login"
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <div className="login-footer">
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
          <div className="support-link">
            Need help? <a href="tel:18001801234">Contact Support</a>
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

        .login-container {
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

        /* Login Card */
        .login-card {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          padding: 30px;
          position: relative;
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #e53e3e, #dd6b20);
        }

        /* Header */
        .login-header {
          text-align: center;
          margin-bottom: 30px;
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

        .login-header h1 {
          color: #2d3748;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .login-header p {
          color: #718096;
          font-size: 14px;
        }

        /* Form */
        .login-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #4a5568;
          font-weight: 500;
          font-size: 14px;
        }

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

        .form-group input {
          flex: 1;
          padding: 14px 15px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          background: #f8fafc;
          color: #2d3748;
        }

        .form-group input:focus {
          outline: none;
          background: white;
        }

        .form-group input::placeholder {
          color: #a0aec0;
        }

        /* OTP Section */
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

        /* Button */
        .login-button {
          width: 100%;
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
          margin-top: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .login-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
        }

        .login-button:active {
          transform: translateY(0);
        }

        .login-button:disabled {
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
        .login-footer {
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

        .support-link {
          color: #718096;
          font-size: 13px;
        }

        .support-link a {
          color: #3182ce;
          text-decoration: none;
          font-weight: 500;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .login-card {
            padding: 25px 20px;
            border-radius: 12px;
          }

          .login-header h1 {
            font-size: 22px;
          }

          .form-group input {
            padding: 12px 14px;
          }

          .login-button {
            padding: 14px;
          }
        }
        `}
      </style>
    </div>
  );
};

export default Login;
