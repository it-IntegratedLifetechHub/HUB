import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaNotesMedical,
  FaArrowRight,
  FaShieldAlt,
  FaRupeeSign,
  FaFlask,
  FaInfoCircle,
} from "react-icons/fa";
import BottomNavigation from "../../components/BottomNav";

const Book = () => {
  const { categoryId, test: testNameParam } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const decodedTestName = decodeURIComponent(testNameParam);

  // Get test details from location state or initialize empty
  const [testDetails, setTestDetails] = useState(
    state?.testDetails || {
      name: decodedTestName,
      categoryId,
      totalCost: 0,
      description: "",
      preparation: "",
      turnaroundTime: "",
      specialist: "",
      whyToTake: "",
    }
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    notes: "",
    preferredDate: "",
    preferredTime: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // If test details weren't passed in state, fetch them
  useEffect(() => {
    if (!state?.testDetails) {
      const fetchTestDetails = async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/categories/${categoryId}/tests`
          );
          if (!res.ok) throw new Error("Failed to fetch test details");

          const data = await res.json();
          const foundTest = data.data.find((t) => t.name === decodedTestName);

          if (!foundTest) throw new Error("Test not found");

          setTestDetails(foundTest);
        } catch (err) {
          console.error("Error fetching test details:", err);
        }
      };

      fetchTestDetails();
    }
  }, [categoryId, decodedTestName, state]);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!emailRegex.test(formData.email))
      errors.email = "Invalid email address";
    if (!phoneRegex.test(formData.phone)) errors.phone = "Invalid phone number";
    if (!formData.gender) errors.gender = "Please select a gender";
    if (!formData.preferredDate) errors.preferredDate = "Date is required";
    if (!formData.preferredTime) errors.preferredTime = "Time slot is required";
    if (!formData.street.trim()) errors.street = "Street address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zip.trim()) errors.zip = "ZIP code is required";
    if (!formData.country) errors.country = "Country is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Actual API call would go here
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            testId: testDetails._id,
            testName: testDetails.name,
            categoryId,
            price: testDetails.totalCost,
          }),
        }
      );

      if (!response.ok) throw new Error("Booking failed");

      setIsSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        navigate("/appointments"); // Redirect to appointments page
      }, 3000);
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Available time slots
  const timeSlots = [
    { value: "08:00-10:00", label: "Morning (08:00-10:00)" },
    { value: "10:00-12:00", label: "Late Morning (10:00-12:00)" },
    { value: "12:00-14:00", label: "Afternoon (12:00-14:00)" },
    { value: "14:00-16:00", label: "Early Evening (14:00-16:00)" },
  ];

  return (
    <div className="book-container">
      {/* Header with gradient background */}
      <div className="book-header">
        <div className="header-content">
          <h1>Book Your Test</h1>
          <p>Complete your booking in just a few steps</p>
          <div className="header-badges">
            <span className="badge">
              <FaShieldAlt /> Secure Booking
            </span>
            <span className="badge">
              <FaUserMd /> Certified Specialists
            </span>
            <span className="badge">
              <FaClock /> Quick Results
            </span>
          </div>
        </div>
      </div>

      {isSuccess && (
        <div className="success-message">
          <FaCheckCircle className="success-icon" />
          <div>
            <h3>Appointment Booked Successfully!</h3>
            <p>We've sent confirmation details to your email.</p>
          </div>
        </div>
      )}

      <div className="book-content">
        {/* Test Information Card */}
        <div className="test-info-card">
          <div className="test-header">
            <h2>
              <span className="test-icon">
                <FaFlask />
              </span>
              {testDetails.name}
            </h2>
            <p className="test-description">
              {testDetails.description || "Comprehensive health screening"}
            </p>

            <div className="test-details-grid">
              <div className="detail-card">
                <div className="detail-icon-container">
                  <FaClock className="detail-icon" />
                </div>
                <div>
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">
                    {testDetails.turnaroundTime || "15-30 minutes"}
                  </span>
                </div>
              </div>
              <div className="detail-card">
                <div className="detail-icon-container">
                  <FaUserMd className="detail-icon" />
                </div>
                <div>
                  <span className="detail-label">Specialist</span>
                  <span className="detail-value">
                    {testDetails.specialist || "Certified Professional"}
                  </span>
                </div>
              </div>
              <div className="detail-card">
                <div className="detail-icon-container">
                  <FaNotesMedical className="detail-icon" />
                </div>
                <div>
                  <span className="detail-label">Preparation</span>
                  <span className="detail-value">
                    {testDetails.preparation || "No special preparation needed"}
                  </span>
                </div>
              </div>
            </div>

            {testDetails.whyToTake && (
              <div className="test-benefits">
                <h4>Why Take This Test?</h4>
                <p>{testDetails.whyToTake}</p>
              </div>
            )}

            <div className="test-footer">
              <div className="test-price">
                <span className="price-label">Total Cost:</span>
                <span className="price-value">
                  <FaRupeeSign />{" "}
                  {testDetails.totalCost.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Section */}
        <form className="booking-form" onSubmit={handleSubmit} noValidate>
          <h2>
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

          <h2>
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
              {formErrors.preferredTime && (
                <span className="error-message">
                  <FaInfoCircle /> {formErrors.preferredTime}
                </span>
              )}
            </div>
          </div>

          <h2>
            <FaMapMarkerAlt className="section-icon" /> Address Information
          </h2>

          <div className="form-group">
            <label htmlFor="street">Street Address</label>
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
                ].map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {formErrors.country && (
                <span className="error-message">
                  <FaInfoCircle /> {formErrors.country}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">
              Additional Notes <span>(Optional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Any special instructions, allergies, or notes for our staff..."
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-footer">
            <div className="privacy-notice">
              <FaShieldAlt className="privacy-icon" />
              <p>
                Your information is secure and will only be used for your
                appointment. We adhere to strict privacy policies.
              </p>
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Processing..."
                ) : (
                  <>
                    Confirm Booking <FaArrowRight className="btn-icon" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <BottomNavigation />

      <style jsx>{`
        :root {
          --primary-color: #6a0dad;
          --primary-light: #8b5cf6;
          --primary-lighter: #c4b5fd;
          --primary-dark: #4c1d95;
          --primary-darker: #3b0764;
          --secondary-color: #64748b;
          --secondary-light: #e2e8f0;
          --light-color: #f8fafc;
          --dark-color: #1e293b;
          --success-color: #10b981;
          --success-light: #d1fae5;
          --warning-color: #f59e0b;
          --error-color: #ef4444;
          --error-light: #fee2e2;
          --border-radius: 10px;
          --border-radius-lg: 16px;
          --border-radius-xl: 24px;
          --box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --box-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          --box-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
          box-sizing: border-box;
        }

        .book-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem 6rem;
          font-family: "Outfit", -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--dark-color);
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
          padding: 2rem;
          border-radius: 0 0 var(--border-radius-xl) var(--border-radius-xl);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 220px;
          box-shadow: var(--box-shadow-lg);
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
        }

        .book-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .book-header p {
          font-size: 1.15rem;
          opacity: 0.9;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .header-badges {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .badge {
          background: rgba(255, 255, 255, 0.15);
          padding: 0.5rem 1rem;
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

        /* Success Message */
        .success-message {
          background: var(--success-light);
          color: var(--success-color);
          padding: 1.5rem;
          border-radius: var(--border-radius);
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1rem;
          animation: fadeIn 0.5s ease-out;
          border-left: 4px solid var(--success-color);
          box-shadow: var(--box-shadow);
        }

        .success-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .success-message h3 {
          margin: 0 0 0.25rem;
          font-size: 1.1rem;
        }

        .success-message p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Main Content Layout */
        .book-content {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          margin-bottom: 2rem;
          gap: 2.5rem;
        }

        /* Test Information Card */
        .test-info-card {
          background: white;
          padding: 2rem;
          border-radius: var(--border-radius-xl);
          box-shadow: var(--box-shadow-lg);
          border: 1px solid var(--secondary-light);
          position: relative;
          height: fit-content;
          align-self: start;
        }

        .test-badge {
          position: absolute;
          top: -10px;
          right: 20px;
          background: var(--primary-light);
          color: white;
          padding: 0.25rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }

        .test-header {
          margin-bottom: 1.5rem;
        }

        .test-info-card h2 {
          color: var(--primary-dark);
          margin: 0 0 0.5rem;
          font-size: 1.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .test-icon {
          font-size: 1.5rem;
        }

        .test-description {
          color: var(--secondary-color);
          line-height: 1.7;
          margin-bottom: 2rem;
          font-size: 1.05rem;
        }

        .test-details-grid {
          display: grid;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .detail-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .detail-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--box-shadow);
        }

        .detail-icon-container {
          background: var(--primary-lighter);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .detail-icon {
          color: var(--primary-color);
          font-size: 1rem;
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

        .test-benefits {
          background: #f5f3ff;
          padding: 1.5rem;
          border-radius: var(--border-radius);
          margin-bottom: 2rem;
        }

        .test-benefits h4 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: var(--primary-dark);
        }

        .test-benefits p {
          margin: 0;
          color: var(--secondary-color);
          line-height: 1.6;
        }

        .test-footer {
          border-top: 1px solid var(--secondary-light);
          padding-top: 1.5rem;
        }

        .test-price {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .price-label {
          color: var(--dark-color);
          font-weight: 600;
        }

        .price-value {
          color: var(--primary-color);
          font-size: 1.5rem;
          font-weight: 700;
        }

        .test-availability {
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
          margin-bottom: 7rem;
          border: 1px solid var(--secondary-light);
        }

        .booking-form h2 {
          color: var(--primary-dark);
          margin: 0 0 1.75rem;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
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
          font-family: inherit;
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

        select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1rem;
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

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .book-content {
            gap: 2rem;
          }

          .book-header h1 {
            font-size: 2.25rem;
          }

          .test-info-card,
          .booking-form {
            padding: 2rem;
          }
        }

        @media (max-width: 768px) {
          .book-content {
            grid-template-columns: 1fr;
          }

          .book-header {
            flex-direction: column;
            text-align: center;
            padding: 2.5rem 1.5rem;
            min-height: auto;
          }

          .header-content {
            margin-bottom: 1.5rem;
          }

          .header-illustration {
            display: none;
          }

          .book-header h1 {
            font-size: 2rem;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }

          .test-info-card {
            order: 2;
          }

          .booking-form {
            order: 1;
          }
        }

        @media (max-width: 480px) {
          .book-header {
            padding: 2rem 1rem;
            border-radius: 0;
          }

          .book-header h1 {
            font-size: 1.75rem;
          }

          .book-header p {
            font-size: 1rem;
          }

          .test-info-card,
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
          }

          .test-badge {
            right: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Book;
