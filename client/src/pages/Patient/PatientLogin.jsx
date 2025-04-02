import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PatientLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [formData, setFormData] = useState({
    phone: "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [staticOTP] = useState("123456"); // Static OTP for demo

  const OTP_RESEND_DELAY = 30; // Seconds

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    } else if (name === "otp") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    }

    setError("");
  };

  const validateForm = () => {
    if (step === 1) {
      if (!/^\d{10}$/.test(formData.phone)) {
        setError("Please enter a valid 10-digit phone number");
        return false;
      }
    } else {
      if (!/^\d{6}$/.test(formData.otp)) {
        setError("Please enter a valid 6-digit OTP");
        return false;
      }
    }
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/patients/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: formData.phone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      alert(`OTP sent to ${formData.phone}\nDemo OTP: ${staticOTP}`);
      setCountdown(OTP_RESEND_DELAY);
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/patients/verify-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: formData.phone,
            otp: formData.otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      navigate("/patient", {
        state: {
          phone: data.data.phone,
          name: data.data.name,
        },
      });
    } catch (err) {
      setError(err.message || "OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    alert(`OTP resent to ${formData.phone}\nDemo OTP: ${staticOTP}`);
    setCountdown(OTP_RESEND_DELAY);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {step === 1 ? "Patient Login" : "Verify OTP"}
        </h1>

        {error && <div style={styles.error}>{error}</div>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            step === 1 ? handleSendOTP() : handleVerifyOTP();
          }}
          style={styles.form}
        >
          {step === 1 ? (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                pattern="[0-9]{10}"
                placeholder="Enter 10-digit phone number"
                required
              />
            </div>
          ) : (
            <>
              <p style={styles.otpText}>
                We've sent a 6-digit OTP to {formData.phone}
                <br />
                <small style={styles.hint}>Demo OTP: {staticOTP}</small>
              </p>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Enter OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  style={styles.input}
                  pattern="[0-9]{6}"
                  maxLength="6"
                  placeholder="Enter 6-digit OTP"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            style={styles.button}
            disabled={isLoading || (step === 2 && !formData.otp)}
          >
            {isLoading ? (
              <span style={styles.spinner}></span>
            ) : step === 1 ? (
              "Send OTP"
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        {step === 2 && (
          <p style={styles.resendText}>
            Didn't receive OTP?{" "}
            <button
              type="button"
              style={styles.resendButton}
              onClick={handleResendOTP}
              disabled={countdown > 0}
            >
              Resend {countdown > 0 ? `(${countdown}s)` : ""}
            </button>
          </p>
        )}

        {step === 1 && (
          <p style={styles.registerText}>
            New patient?{" "}
            <button
              style={styles.registerLink}
              onClick={() => navigate("/patient/registration")}
            >
              Register here
            </button>
          </p>
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
      background: "#aaa",
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
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
  registerText: {
    textAlign: "center",
    color: "#666",
    marginTop: "20px",
    fontSize: "14px",
  },
  registerLink: {
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

export default PatientLogin;
