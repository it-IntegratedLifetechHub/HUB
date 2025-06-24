import React, { useState } from "react";
import { MdOutlineDateRange } from "react-icons/md";
import {
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaHome,
  FaShieldAlt,
  FaCheckCircle,
  FaChevronRight,
  FaUserMd,
  FaNotesMedical,
  FaInfoCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaArrowRight,
  FaStar,
  FaCreditCard,
  FaMoneyBillWave,
  FaEnvelope,
  FaPlus,
  FaMinus,
  FaRegCalendarCheck,
  FaStethoscope,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const HomeDoctor = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    preferredDate: "",
    preferredTime: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    paymentMethod: "cod",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const timeSlots = [
    { value: "morning", label: "Morning (8am - 12pm)" },
    { value: "afternoon", label: "Afternoon (12pm - 4pm)" },
    { value: "evening", label: "Evening (4pm - 8pm)" },
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.phone) errors.phone = "Phone number is required";
    if (!formData.gender) errors.gender = "Please select gender";
    if (!formData.preferredDate)
      errors.preferredDate = "Preferred date is required";
    if (!formData.preferredTime)
      errors.preferredTime = "Preferred time is required";
    if (!formData.street) errors.street = "Street address is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.state) errors.state = "State is required";
    if (!formData.zip) errors.zip = "ZIP code is required";
    if (!formData.country) errors.country = "Country is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowConfirmation(true);
      }, 1500);
    }
  };

  const confirmBooking = () => {
    setIsSuccess(true);
    setShowConfirmation(false);

    setTimeout(() => {
      const element = document.querySelector(".success-message");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Get minimum date (tomorrow)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="book-container">
      {/* Header with gradient background */}
      <div className="book-header">
        <div className="header-content">
          <div className="header-tag">
            <FaStethoscope className="tag-icon" />
            <span>Premium Healthcare</span>
          </div>
          <h1>Book Your In-Home Doctor Visit</h1>
          <p className="header-subtitle">
            Experience personalized medical care in the comfort of your home
          </p>
          <div className="header-badges">
            <span className="badge">
              <FaShieldAlt className="badge-icon" /> HIPAA Compliant
            </span>
            <span className="badge">
              <FaUserMd className="badge-icon" /> Board Certified
            </span>
            <span className="badge">
              <FaRegCalendarCheck className="badge-icon" /> Same-Day Available
            </span>
          </div>
        </div>
        <div className="header-illustration">
          {/* <img
            src="https://cdn-icons-png.flaticon.com/512/5996/5996830.png"
            alt="Doctor illustration"
            className="doctor-illustration"
          /> */}
          <MdOutlineDateRange className="doctor-illustration" />
          <div className="illustration-bg"></div>
        </div>
      </div>

      {isSuccess && (
        <div className="success-message">
          <div className="success-content">
            <FaCheckCircle className="success-icon" />
            <div>
              <h3>Your Doctor Visit is Confirmed!</h3>
              <p>
                Dr. Sarah Johnson will arrive at {formData.preferredTime} on{" "}
                {new Date(formData.preferredDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
                . We've sent the details to {formData.email}.
              </p>
            </div>
          </div>
          <div className="success-actions">
            <button className="success-btn outline">
              <FaUserMd /> View Doctor Profile
            </button>
            <button className="success-btn primary">
              <FaCalendarAlt /> Add to Calendar
            </button>
          </div>
        </div>
      )}

      {apiError && (
        <div className="error-message">
          <FaExclamationTriangle className="error-icon" />
          <div>
            <h3>Booking Error</h3>
            <p>{apiError}</p>
          </div>
          <button className="error-close" onClick={() => setApiError("")}>
            <IoMdClose />
          </button>
        </div>
      )}

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Your Appointment</h3>
              <button
                className="modal-close"
                onClick={() => setShowConfirmation(false)}
              >
                <IoMdClose />
              </button>
            </div>
            <div className="modal-body">
              <div className="appointment-summary">
                <div className="summary-item">
                  <span className="summary-label">Date & Time:</span>
                  <span className="summary-value">
                    {new Date(formData.preferredDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      }
                    )}{" "}
                    •{" "}
                    {timeSlots.find(
                      (slot) => slot.value === formData.preferredTime
                    )?.label || formData.preferredTime}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Patient:</span>
                  <span className="summary-value">{formData.fullName}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Location:</span>
                  <span className="summary-value">
                    {formData.street}, {formData.city}, {formData.state}{" "}
                    {formData.zip}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Service:</span>
                  <span className="summary-value">
                    Comprehensive In-Home Consultation
                  </span>
                </div>
                <div className="summary-item total">
                  <span className="summary-label">Total:</span>
                  <span className="summary-value">$150</span>
                </div>
              </div>
              <div className="payment-method">
                <h4>Payment Method</h4>
                <div className="payment-selected">
                  {formData.paymentMethod === "cod" ? (
                    <>
                      <FaMoneyBillWave className="payment-icon" />
                      <span>Pay at Visit (Cash/Card)</span>
                    </>
                  ) : (
                    <>
                      <FaCreditCard className="payment-icon" />
                      <span>Online Payment</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn secondary"
                onClick={() => setShowConfirmation(false)}
              >
                Make Changes
              </button>
              <button className="modal-btn primary" onClick={confirmBooking}>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="book-content">
        {/* Service Information Card */}
        <div className="service-info-card">
          <div className="service-header">
            <div className="service-title">
              <MdOutlineDateRange className="service-icon-img" />

              <h2>Premium In-Home Consultation</h2>
            </div>
            <p className="service-description">
              A comprehensive 60-minute visit with a board-certified physician
              in the comfort of your home, including diagnosis, treatment plan,
              and prescriptions if needed.
            </p>

            <div className="service-highlights">
              <div className="highlight-item">
                <FaCheckCircle className="highlight-icon" />
                <span>60-minute dedicated visit</span>
              </div>
              <div className="highlight-item">
                <FaCheckCircle className="highlight-icon" />
                <span>Complete physical examination</span>
              </div>
              <div className="highlight-item">
                <FaCheckCircle className="highlight-icon" />
                <span>Personalized treatment plan</span>
              </div>
            </div>

            <div className="service-details-grid">
              <div className="detail-card">
                <div className="detail-icon-container">
                  <FaClock className="detail-icon" />
                </div>
                <div>
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">60 minutes</span>
                </div>
              </div>
              <div className="detail-card">
                <div className="detail-icon-container">
                  <FaUserMd className="detail-icon" />
                </div>
                <div>
                  <span className="detail-label">Doctor</span>
                  <span className="detail-value">Board Certified</span>
                </div>
              </div>
              <div className="detail-card">
                <div className="detail-icon-container">
                  <FaNotesMedical className="detail-icon" />
                </div>
                <div>
                  <span className="detail-label">Includes</span>
                  <span className="detail-value">Prescription if needed</span>
                </div>
              </div>
            </div>

            <div className="accordion-section">
              <div className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion(0)}
                  aria-expanded={activeAccordion === 0}
                >
                  <span>What to Expect</span>
                  {activeAccordion === 0 ? (
                    <FaMinus className="accordion-icon" />
                  ) : (
                    <FaPlus className="accordion-icon" />
                  )}
                </button>
                {activeAccordion === 0 && (
                  <div className="accordion-content">
                    <p>
                      Your doctor will arrive at your home with all necessary
                      medical equipment. The visit includes:
                    </p>
                    <ul className="expectation-list">
                      <li>Comprehensive medical history review</li>
                      <li>Full physical examination</li>
                      <li>
                        Vital signs check (blood pressure, temperature, etc.)
                      </li>
                      <li>Diagnosis and treatment plan</li>
                      <li>Prescription if medically necessary</li>
                      <li>Follow-up recommendations</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion(1)}
                  aria-expanded={activeAccordion === 1}
                >
                  <span>Preparation Guide</span>
                  {activeAccordion === 1 ? (
                    <FaMinus className="accordicon-icon" />
                  ) : (
                    <FaPlus className="accordion-icon" />
                  )}
                </button>
                {activeAccordion === 1 && (
                  <div className="accordion-content">
                    <p>
                      To make the most of your in-home visit, please prepare the
                      following:
                    </p>
                    <ul className="preparation-list">
                      <li>
                        <strong>Medical Information:</strong> List of current
                        medications, allergies, and medical history
                      </li>
                      <li>
                        <strong>Comfortable Clothing:</strong> Wear loose
                        clothing that allows access to arms for blood pressure
                      </li>
                      <li>
                        <strong>Fasting:</strong> Fast for 8-12 hours if blood
                        work might be needed
                      </li>
                      <li>
                        <strong>Space Preparation:</strong> Have a clean, quiet
                        space available for the examination
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="service-footer">
              <div className="service-price-container">
                <div className="service-price">
                  <span className="price-label">Total</span>
                  <span className="price-value">$150</span>
                </div>
                <div className="service-availability">
                  <FaCheckCircle className="availability-icon" />
                  <span>Available in your area</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Section */}
        <form className="booking-form" onSubmit={handleSubmit} noValidate>
          <div className="form-section">
            <h2 className="form-section-title">
              <FaUser className="section-icon" /> Patient Information
            </h2>
            <div className="form-group">
              <label htmlFor="fullName">
                <FaUser className="input-icon" /> Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={formErrors.fullName ? "error" : ""}
              />
              {formErrors.fullName && (
                <span className="error-message">
                  <FaInfoCircle /> {formErrors.fullName}
                </span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope className="input-icon" /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={formErrors.email ? "error" : ""}
                />
                {formErrors.email && (
                  <span className="error-message">
                    <FaInfoCircle /> {formErrors.email}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="phone">
                  <FaPhone className="input-icon" /> Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="(123) 456-7890"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={formErrors.phone ? "error" : ""}
                />
                {formErrors.phone && (
                  <span className="error-message">
                    <FaInfoCircle /> {formErrors.phone}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Gender</label>
              <div className="gender-options">
                {["male", "female", "other", "prefer-not-to-say"].map(
                  (gender) => (
                    <label key={gender} className="radio-option">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={handleChange}
                      />
                      <span className="radio-custom"></span>
                      <span>
                        {gender === "prefer-not-to-say"
                          ? "Prefer not to say"
                          : gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </span>
                    </label>
                  )
                )}
              </div>
              {formErrors.gender && (
                <span className="error-message">
                  <FaInfoCircle /> {formErrors.gender}
                </span>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">
              <FaCalendarAlt className="section-icon" /> Appointment Details
            </h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preferredDate">
                  <FaCalendarAlt className="input-icon" /> Preferred Date
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required
                  min={minDate}
                  className={formErrors.preferredDate ? "error" : ""}
                />
                {formErrors.preferredDate && (
                  <span className="error-message">
                    <FaInfoCircle /> {formErrors.preferredDate}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="preferredTime">
                  <FaClock className="input-icon" /> Preferred Time
                </label>
                <div className="select-wrapper">
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    required
                    className={formErrors.preferredTime ? "error" : ""}
                  >
                    <option value="">Select time slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.preferredTime && (
                  <span className="error-message">
                    <FaInfoCircle /> {formErrors.preferredTime}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">
              <FaMapMarkerAlt className="section-icon" /> Visit Location
            </h2>
            <div className="form-group">
              <label htmlFor="street">
                <FaHome className="input-icon" /> Street Address
              </label>
              <input
                type="text"
                id="street"
                name="street"
                placeholder="123 Main St"
                value={formData.street}
                onChange={handleChange}
                required
                className={formErrors.street ? "error" : ""}
              />
              {formErrors.street && (
                <span className="error-message">
                  <FaInfoCircle /> {formErrors.street}
                </span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="New York"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className={formErrors.city ? "error" : ""}
                />
                {formErrors.city && (
                  <span className="error-message">
                    <FaInfoCircle /> {formErrors.city}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="state">State/Province</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  placeholder="NY"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className={formErrors.state ? "error" : ""}
                />
                {formErrors.state && (
                  <span className="error-message">
                    <FaInfoCircle /> {formErrors.state}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zip">ZIP/Postal Code</label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  placeholder="10001"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                  className={formErrors.zip ? "error" : ""}
                />
                {formErrors.zip && (
                  <span className="error-message">
                    <FaInfoCircle /> {formErrors.zip}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <div className="select-wrapper">
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className={formErrors.country ? "error" : ""}
                  >
                    <option value="">Select country</option>
                    {[
                      "United States",
                      "Canada",
                      "United Kingdom",
                      "Australia",
                      "India",
                      "Germany",
                      "France",
                      "Japan",
                      "Singapore",
                      "United Arab Emirates",
                    ].map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.country && (
                  <span className="error-message">
                    <FaInfoCircle /> {formErrors.country}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">
              <FaMoneyBillWave className="section-icon" /> Payment Method
            </h2>
            <div className="payment-method-section">
              <div className="payment-options">
                <label
                  className={`payment-option ${
                    formData.paymentMethod === "cod" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={() =>
                      setFormData({ ...formData, paymentMethod: "cod" })
                    }
                  />
                  <div className="payment-option-content">
                    <FaMoneyBillWave className="payment-icon" />
                    <div>
                      <span>Pay at Visit</span>
                      <small>Cash, credit, or debit when doctor arrives</small>
                    </div>
                  </div>
                </label>

                <label
                  className={`payment-option ${
                    formData.paymentMethod === "online" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={() =>
                      setFormData({ ...formData, paymentMethod: "online" })
                    }
                  />
                  <div className="payment-option-content">
                    <FaCreditCard className="payment-icon" />
                    <div>
                      <span>Online Payment</span>
                      <small>Secure payment now with card/UPI</small>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">
              <FaNotesMedical className="section-icon" /> Additional Information
            </h2>
            <div className="form-group">
              <label htmlFor="notes">
                Medical Notes <span>(Optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Please describe any symptoms, medical concerns, or special instructions for the doctor..."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
              <div className="char-count">
                {formData.notes.length}/500 characters
              </div>
            </div>
          </div>

          <div className="form-footer">
            <div className="privacy-notice">
              <FaShieldAlt className="privacy-icon" />
              <p>
                Your information is protected by HIPAA privacy standards and
                will only be used for your medical care.
              </p>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spinner" /> Processing...
                  </>
                ) : (
                  <>
                    Continue to Confirmation{" "}
                    <FaArrowRight className="btn-icon" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        :root {
          --primary-color: #5e35b1;
          --primary-light: #7c4dff;
          --primary-lighter: #b388ff;
          --primary-dark: #4527a0;
          --primary-darker: #311b92;
          --secondary-color: #546e7a;
          --secondary-light: #eceff1;
          --light-color: #f8fafc;
          --dark-color: #263238;
          --success-color: #00c853;
          --success-light: #b9f6ca;
          --warning-color: #ff9100;
          --error-color: #ff3d00;
          --error-light: #ffcdd2;
          --border-radius: 8px;
          --border-radius-lg: 12px;
          --border-radius-xl: 16px;
          --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          --box-shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.1);
          --box-shadow-xl: 0 10px 15px rgba(0, 0, 0, 0.1);
          --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
            sans-serif;
          line-height: 1.6;
          color: var(--dark-color);
          background-color: #f5f7fa;
        }

        .book-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem 6rem;
        }

        /* Header Section */
        .book-header {
          margin-bottom: 2rem;
          background: linear-gradient(
            135deg,
            var(--primary-dark),
            var(--primary-color)
          );
          color: white;
          padding: 4rem 2rem;
          border-radius: 0 0 var(--border-radius-xl) var(--border-radius-xl);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 280px;
          box-shadow: var(--box-shadow-xl);
        }

        .book-header::before {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-light), #ec4899);
        }

        .header-content {
          max-width: 600px;
          z-index: 2;
          position: relative;
        }

        .header-tag {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.15);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(5px);
        }

        .tag-icon {
          margin-right: 0.5rem;
          font-size: 0.9rem;
        }

        .book-header h1 {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          margin-bottom: 1rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .header-subtitle {
          font-size: clamp(1rem, 2vw, 1.15rem);
          opacity: 0.9;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          max-width: 90%;
        }

        .header-badges {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: flex-start;
        }

        .badge {
          background: rgba(255, 255, 255, 0.15);
          padding: 0.75rem 1.25rem;
          border-radius: 20px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(5px);
          transition: var(--transition);
        }

        .badge:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        .badge-icon {
          font-size: 0.9rem;
        }

        .header-illustration {
          position: relative;
          width: 350px;
          height: 250px;
          z-index: 1;
          flex-shrink: 0;
        }

        .doctor-illustration {
          width: 100%;
          height: 100%;
          object-fit: contain;
          position: relative;
          z-index: 2;
          color: #fff;
          filter: drop-shadow(0 10px 15px rgba(255, 255, 255, 0.2));
          animation: float 6s ease-in-out infinite;
        }

        .illustration-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.2) 0%,
            transparent 70%
          );
        }

        /* Success Message */
        .success-message {
          background: var(--success-light);
          color: var(--success-color);
          padding: 2rem;
          border-radius: var(--border-radius-lg);
          margin: 2rem 0;
          border-left: 4px solid var(--success-color);
          box-shadow: var(--box-shadow-lg);
          animation: fadeIn 0.5s ease-out;
        }

        .success-content {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .success-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .success-message h3 {
          margin: 0 0 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .success-message p {
          margin: 0;
          font-size: 1rem;
          line-height: 1.6;
        }

        .success-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .success-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: var(--border-radius);
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          flex: 1;
          justify-content: center;
        }

        .success-btn.primary {
          background: var(--success-color);
          color: white;
          border: none;
        }

        .success-btn.primary:hover {
          background: #00b246;
          transform: translateY(-2px);
        }

        .success-btn.outline {
          background: transparent;
          border: 1px solid var(--success-color);
          color: var(--success-color);
        }

        .success-btn.outline:hover {
          background: rgba(0, 200, 83, 0.1);
          transform: translateY(-2px);
        }

        /* Error Message */
        .error-message {
          background: var(--error-light);
          color: var(--error-color);
          padding: 1.5rem;
          border-radius: var(--border-radius-lg);
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin: 2rem 0;
          border-left: 4px solid var(--error-color);
          position: relative;
          box-shadow: var(--box-shadow-lg);
        }

        .error-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .error-message h3 {
          margin: 0 0 0.25rem;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .error-message p {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .error-close {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: none;
          border: none;
          color: var(--error-color);
          cursor: pointer;
          font-size: 1.25rem;
          opacity: 0.7;
          transition: var(--transition);
        }

        .error-close:hover {
          opacity: 1;
        }

        /* Confirmation Modal */
        .confirmation-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          background: white;
          border-radius: var(--border-radius-xl);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--box-shadow-xl);
          animation: slideUp 0.3s ease-out;
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--secondary-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.5rem;
          color: var(--primary-dark);
        }

        .modal-close {
          background: none;
          border: none;
          color: var(--secondary-color);
          font-size: 1.5rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .modal-close:hover {
          color: var(--primary-color);
          transform: rotate(90deg);
        }

        .modal-body {
          padding: 1.5rem;
        }

        .appointment-summary {
          display: grid;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          border-bottom: 1px dashed var(--secondary-light);
        }

        .summary-item.total {
          padding-top: 0.75rem;
          border-top: 1px solid var(--secondary-light);
          border-bottom: none;
          font-weight: 600;
        }

        .summary-label {
          color: var(--secondary-color);
        }

        .summary-value {
          color: var(--dark-color);
          text-align: right;
        }

        .payment-method {
          margin-top: 2rem;
        }

        .payment-method h4 {
          margin-bottom: 1rem;
          color: var(--primary-dark);
        }

        .payment-selected {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: var(--border-radius);
          border: 1px solid var(--secondary-light);
        }

        .payment-icon {
          font-size: 1.5rem;
          color: var(--primary-color);
        }

        .modal-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--secondary-light);
          display: flex;
          gap: 1rem;
        }

        .modal-btn {
          flex: 1;
          padding: 1rem;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .modal-btn.primary {
          background: var(--primary-color);
          color: white;
          border: none;
        }

        .modal-btn.primary:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
        }

        .modal-btn.secondary {
          background: white;
          border: 1px solid var(--secondary-light);
          color: var(--dark-color);
        }

        .modal-btn.secondary:hover {
          background: #f8fafc;
          transform: translateY(-2px);
        }

        /* Main Content Layout */
        .book-content {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          margin-bottom: 2rem;
          gap: 2.5rem;
        }

        /* Service Information Card */
        .service-info-card {
          background: white;
          padding: 2.5rem;
          border-radius: var(--border-radius-xl);
          box-shadow: var(--box-shadow-lg);
          border: 1px solid var(--secondary-light);
          position: relative;
          height: fit-content;
        }

        .service-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--primary-color);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          z-index: 1;
        }

        .badge-icon {
          font-size: 0.8rem;
        }

        .service-header {
          margin-bottom: 1.5rem;
        }

        .service-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .service-info-card h2 {
          color: var(--primary-dark);
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
        }

        .service-icon-img {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }

        .service-description {
          color: var(--secondary-color);
          line-height: 1.7;
          margin-bottom: 2rem;
          font-size: 1.05rem;
        }

        .service-highlights {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .highlight-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .highlight-icon {
          color: var(--success-color);
          font-size: 1rem;
          margin-top: 0.2rem;
          flex-shrink: 0;
        }

        .service-details-grid {
          display: grid;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .detail-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          background: #f8fafc;
          border-radius: var(--border-radius-lg);
          transition: var(--transition);
        }

        .detail-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--box-shadow);
        }

        .detail-icon-container {
          background: var(--primary-lighter);
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .detail-icon {
          color: var(--primary-color);
          font-size: 1.1rem;
        }

        .detail-label {
          display: block;
          font-weight: 600;
          color: var(--dark-color);
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .detail-value {
          color: var(--secondary-color);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        /* Accordion Styles */
        .accordion-section {
          margin-bottom: 2rem;
        }

        .accordion-item {
          margin-bottom: 0.75rem;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          border: 1px solid var(--secondary-light);
        }

        .accordion-header {
          width: 100%;
          padding: 1.25rem 1.5rem;
          background: #f8fafc;
          border: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          color: var(--dark-color);
          cursor: pointer;
          transition: var(--transition);
        }

        .accordion-header:hover {
          background: #f1f5f9;
        }

        .accordion-header[aria-expanded="true"] {
          background: var(--primary-light);
          color: white;
        }

        .accordion-icon {
          font-size: 0.9rem;
          transition: var(--transition);
        }

        .accordion-header[aria-expanded="true"] .accordion-icon {
          transform: rotate(180deg);
        }

        .accordion-content {
          padding: 0 1.5rem;
          background: white;
          overflow: hidden;
        }

        .accordion-content p {
          color: var(--secondary-color);
          line-height: 1.6;
          margin: 1rem 0;
        }

        .expectation-list,
        .preparation-list {
          margin: 1rem 0 1rem 1.5rem;
          color: var(--secondary-color);
          line-height: 1.8;
        }

        .expectation-list li,
        .preparation-list li {
          margin-bottom: 0.5rem;
        }

        .preparation-list li strong {
          color: var(--dark-color);
        }

        .service-footer {
          border-top: 1px solid var(--secondary-light);
          padding-top: 1.5rem;
        }

        .service-price-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .service-price {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
        }

        .price-label {
          color: var(--dark-color);
          font-weight: 600;
        }

        .price-value {
          color: var(--primary-color);
          font-size: 1.75rem;
          font-weight: 700;
        }

        .service-availability {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--success-color);
          font-size: 0.9rem;
        }

        .availability-icon {
          font-size: 1rem;
        }

        /* Booking Form */
        .booking-form {
          background: white;
          padding: 2.5rem;
          border-radius: var(--border-radius-xl);
          box-shadow: var(--box-shadow-lg);
          margin-bottom: 2rem;
          border: 1px solid var(--secondary-light);
        }

        .form-progress {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          position: relative;
        }

        .form-progress::before {
          content: "";
          position: absolute;
          top: 15px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--secondary-light);
          z-index: 0;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .progress-step.active .step-number {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .progress-step.active .step-label {
          color: var(--primary-color);
          font-weight: 600;
        }

        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--secondary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 0.5rem;
          transition: var(--transition);
        }

        .step-label {
          font-size: 0.85rem;
          color: var(--secondary-color);
          transition: var(--transition);
          text-align: center;
          max-width: 80px;
        }

        .form-section {
          margin-bottom: 2.5rem;
        }

        .form-section-title {
          color: var(--primary-dark);
          margin: 0 0 1.75rem;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          position: relative;
          padding-bottom: 0.75rem;
        }

        .form-section-title::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50px;
          height: 3px;
          background: var(--primary-light);
          border-radius: 3px;
        }

        .section-icon {
          color: var(--primary-color);
        }

        .form-group {
          margin-bottom: 1.75rem;
          position: relative;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: var(--dark-color);
          font-size: 0.95rem;
        }

        label span {
          font-weight: normal;
          color: var(--secondary-color);
          font-size: 0.85rem;
        }

        .input-icon {
          color: var(--primary-color);
          margin-right: 0.5rem;
          font-size: 0.9rem;
        }

        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="date"],
        select,
        textarea {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 1px solid var(--secondary-light);
          border-radius: var(--border-radius);
          font-size: 1rem;
          transition: var(--transition);
          background: #f8fafc;
          font-family: "Outfit", sans-serif;
          color: var(--dark-color);
        }

        input[type="text"]:focus,
        input[type="email"]:focus,
        input[type="tel"]:focus,
        input[type="date"]:focus,
        select:focus,
        textarea:focus {
          border-color: var(--primary-light);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
          outline: none;
          background: white;
        }

        input.error,
        select.error {
          border-color: var(--error-color);
          background-color: var(--error-light);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--error-color);
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.5);
          cursor: pointer;
        }

        textarea {
          min-height: 120px;
          resize: vertical;
          line-height: 1.6;
        }

        .char-count {
          font-size: 0.8rem;
          color: var(--secondary-color);
          text-align: right;
          margin-top: 0.25rem;
        }

        select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1rem;
        }

        .select-wrapper {
          position: relative;
        }

        /* Gender Radio Buttons */
        .gender-options {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          position: relative;
          padding-left: 2rem;
        }

        .radio-option input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .radio-custom {
          position: absolute;
          top: 0;
          left: 0;
          height: 1.25rem;
          width: 1.25rem;
          background-color: #f1f5f9;
          border: 2px solid #cbd5e1;
          border-radius: 50%;
          transition: var(--transition);
        }

        .radio-option:hover .radio-custom {
          border-color: var(--primary-light);
        }

        .radio-option input:checked ~ .radio-custom {
          background-color: var(--primary-light);
          border-color: var(--primary-light);
        }

        .radio-custom::after {
          content: "";
          position: absolute;
          display: none;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: white;
        }

        .radio-option input:checked ~ .radio-custom::after {
          display: block;
        }

        /* Payment Method Section */
        .payment-method-section {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #f9f9f9;
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--secondary-light);
        }

        .payment-options {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .payment-option {
          flex: 1 1 calc(50% - 0.5rem);
          min-width: 0;
          padding: 1.5rem;
          border: 2px solid #ddd;
          border-radius: var(--border-radius-lg);
          cursor: pointer;
          transition: var(--transition);
          background: white;
        }

        .payment-option.selected {
          border-color: var(--success-color);
          background-color: var(--success-light);
        }

        .payment-option input {
          display: none;
        }

        .payment-option-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .payment-icon {
          font-size: 1.75rem;
          color: var(--success-color);
          flex-shrink: 0;
        }

        .payment-option small {
          color: var(--secondary-color);
          font-size: 0.8rem;
          display: block;
          margin-top: 0.25rem;
        }

        /* Form Footer */
        .form-footer {
          margin-top: 2.5rem;
          border-top: 1px solid var(--secondary-light);
          padding-top: 1.5rem;
        }

        .privacy-notice {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          color: var(--secondary-color);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .privacy-icon {
          color: var(--primary-color);
          font-size: 1rem;
          margin-top: 0.1rem;
          flex-shrink: 0;
        }

        /* Submit Button */
        .form-actions {
          margin-top: 1rem;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          background: linear-gradient(
            135deg,
            var(--primary-color),
            var(--primary-light)
          );
          color: white;
          border: none;
          padding: 1.25rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          width: 100%;
          box-shadow: var(--box-shadow);
          position: relative;
          overflow: hidden;
        }

        .submit-btn:hover {
          background: linear-gradient(
            135deg,
            var(--primary-light),
            var(--primary-color)
          );
          transform: translateY(-2px);
          box-shadow: var(--box-shadow-lg);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .submit-btn::after {
          content: "";
          position: absolute;
          top: -50%;
          left: -60%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(30deg);
          transition: all 0.3s ease;
        }

        .submit-btn:hover::after {
          left: 100%;
        }

        .btn-icon {
          transition: var(--transition);
        }

        .submit-btn:hover .btn-icon {
          transform: translateX(3px);
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .book-content {
            gap: 2rem;
          }

          .header-illustration {
            width: 250px;
          }

          .service-info-card,
          .booking-form {
            padding: 2rem;
          }
        }

        @media (max-width: 900px) {
          .book-content {
            grid-template-columns: 1fr;
          }

          .book-header {
            flex-direction: column;
            text-align: center;
            padding: 3rem 1.5rem;
            min-height: auto;
          }

          .header-content {
            margin-bottom: 1.5rem;
            text-align: center;
            align-items: center;
          }

          .header-subtitle {
            margin-left: auto;
            margin-right: auto;
          }

          .header-badges {
            justify-content: center;
          }

          .header-illustration {
            display: none;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }

          .service-info-card {
            order: 2;
          }

          .booking-form {
            order: 1;
            margin-bottom: 2rem;
          }

          .payment-option {
            flex: 1 1 100%;
          }
        }

        @media (max-width: 600px) {
          .book-header {
            padding: 2rem 1rem;
            border-radius: 0;
          }

          .book-header h1 {
            font-size: 2rem;
          }

          .book-header p {
            font-size: 1rem;
          }

          .service-info-card,
          .booking-form {
            padding: 1.5rem;
            border-radius: var(--border-radius-lg);
          }

          .gender-options {
            flex-direction: column;
            gap: 0.75rem;
          }

          .submit-btn {
            padding: 1rem;
            font-size: 1rem;
          }

          .service-badge {
            top: 0.5rem;
            right: 0.5rem;
          }
        }

        @media (max-width: 400px) {
          .book-header {
            padding: 1.5rem 1rem;
          }

          .badge {
            padding: 0.4rem 0.8rem;
            font-size: 0.75rem;
          }

          .service-info-card,
          .booking-form {
            padding: 1.25rem;
          }

          .detail-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .service-price {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .success-actions {
            flex-direction: column;
          }
        }

        /* Animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
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
      `}</style>
    </div>
  );
};

export default HomeDoctor;
