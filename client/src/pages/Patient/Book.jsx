import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import * as BiIcons from "react-icons/bi";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as PiIcons from "react-icons/pi";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";
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
  FaCheckCircle,
  FaExclamationTriangle,
  FaHome,
  FaPlus,
  FaMinus,
  FaSpinner,
} from "react-icons/fa";
import BottomNavigation from "../../components/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const Book = () => {
  function getIconComponent(iconName) {
    const iconSets = [
      MdIcons,
      FaIcons,
      BiIcons,
      GiIcons,
      PiIcons,
      RiIcons,
      FiIcons,
      AiIcons,
    ];

    for (const iconSet of iconSets) {
      if (iconSet[iconName]) {
        return iconSet[iconName];
      }
    }
    return FaFlask;
  }
  const { categoryId, test: testNameParam } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const decodedTestName = decodeURIComponent(testNameParam);

  // State management
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
    paymentMethod: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [loadingTestDetails, setLoadingTestDetails] = useState(false);

  // Load test details from mock data
  useEffect(() => {
    if (!state?.testDetails) {
      setLoadingTestDetails(true);
      setTimeout(() => {
        try {
          const categoryTests = MOCK_TESTS[categoryId] || [];
          const foundTest = categoryTests.find(
            (t) => t.name === decodedTestName
          );

          if (!foundTest) throw new Error("Test not found");
          setTestDetails(foundTest);
        } catch (err) {
          console.error("Error loading test details:", err);
          setApiError(
            err.message || "Failed to load test details. Please try again."
          );
        } finally {
          setLoadingTestDetails(false);
        }
      }, 500);
    }
  }, [categoryId, decodedTestName, state]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const zipRegex = /^[0-9]{5,6}(?:-[0-9]{4})?$/;

    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    else if (formData.fullName.length > 100)
      errors.fullName = "Name must be less than 100 characters";

    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      errors.email = "Invalid email address";

    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    else if (!phoneRegex.test(formData.phone))
      errors.phone = "Invalid phone number (10-15 digits)";

    if (!formData.gender) errors.gender = "Please select a gender";

    if (!formData.preferredDate) errors.preferredDate = "Date is required";
    else {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today)
        errors.preferredDate = "Date must be today or in the future";
    }

    if (!formData.preferredTime) errors.preferredTime = "Time slot is required";

    if (!formData.street.trim()) errors.street = "Street address is required";
    else if (formData.street.length > 200)
      errors.street = "Address must be less than 200 characters";

    if (!formData.city.trim()) errors.city = "City is required";
    else if (formData.city.length > 50)
      errors.city = "City name must be less than 50 characters";

    if (!formData.state.trim()) errors.state = "State is required";
    else if (formData.state.length > 50)
      errors.state = "State name must be less than 50 characters";

    if (!formData.zip.trim()) errors.zip = "ZIP code is required";
    else if (!zipRegex.test(formData.zip))
      errors.zip = "Invalid ZIP code format";

    if (!formData.country) errors.country = "Country is required";

    if (!formData.paymentMethod)
      errors.paymentMethod = "Please select a payment method";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name])
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };
  const saveOrderToDatabase = async (orderData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save order");
      }

      const data = await response.json();

      // Ensure the response contains the order ID
      if (!data.data?.id && !data.data?._id) {
        throw new Error("Order ID not received from server");
      }

      return {
        ...data.data,
        id: data.data.id || data.data._id, // Use either id or _id
      };
    } catch (error) {
      console.error("Error saving order:", error);
      throw error;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      const firstError = Object.keys(formErrors).find((key) => formErrors[key]);
      if (firstError)
        document
          .getElementById(firstError)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        throw new Error("User not authenticated. Please login again.");
      }

      const orderData = {
        testDetails: {
          name: testDetails.name,
          categoryId: testDetails.categoryId,
          totalCost: testDetails.totalCost,
          description: testDetails.description,
          preparation: testDetails.preparation,
          turnaroundTime: testDetails.turnaroundTime,
          specialist: testDetails.specialist,
          whyToTake: testDetails.whyToTake,
        },
        ...formData,
        userId: userData.id,
        paymentStatus: formData.paymentMethod === "online" ? "pending" : "cod",
        amount: testDetails.totalCost,
      };

      if (formData.paymentMethod === "online") {
        const orderResponse = await saveOrderToDatabase(orderData);

        // Validate orderResponse.id exists before navigation
        if (!orderResponse?.id) {
          throw new Error("Failed to get order ID from server response");
        }

        navigate(`/payment/${orderResponse.id}`, {
          state: {
            amount: testDetails.totalCost,
            testDetails,
            formData,
            userId: userData.id,
            orderDetails: orderResponse, // Pass full order details
          },
          replace: true,
        });
        return;
      }

      // For COD payment
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      setIsSuccess(true);
      toast.success("Booking created successfully!");

      setTimeout(() => {
        navigate("/orders", {
          state: {
            bookingSuccess: true,
            bookingData: data.data,
            userId: userData.id,
          },
          replace: true,
        });
      }, 2000);
    } catch (err) {
      console.error("Booking error:", err);
      setApiError(
        err.message || "Failed to process your request. Please try again."
      );
      toast.error(err.message || "Failed to process your request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const timeSlots = [
    { value: "08:00 AM - 10:00 AM", label: "Morning • 08:00 AM – 10:00 AM" },
    {
      value: "10:00 AM - 12:00 PM",
      label: "Late Morning • 10:00 AM – 12:00 PM",
    },
    { value: "12:00 PM - 02:00 PM", label: "Afternoon • 12:00 PM – 02:00 PM" },
    {
      value: "02:00 PM - 04:00 PM",
      label: "Early Evening • 02:00 PM – 04:00 PM",
    },
    { value: "04:00 PM - 06:00 PM", label: "Evening • 04:00 PM – 06:00 PM" },
    {
      value: "06:00 PM - 08:00 PM",
      label: "Late Evening • 06:00 PM – 08:00 PM",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  if (loadingTestDetails) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading test details...</p>
      </div>
    );
  }

  if (apiError && !state?.testDetails) {
    return (
      <div className="error-container">
        <div className="error-message">
          <FaExclamationTriangle className="error-icon" />
          <h3>{apiError}</h3>
          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-container">
      {/* Header with gradient background */}
      <motion.div
        className="book-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
        <div className="header-illustration">
          <div className="illustration-circle"></div>
          <div className="illustration-dots"></div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isSuccess && (
          <motion.div
            className="success-message"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <FaCheckCircle className="success-icon" />
            <div>
              <h3>Appointment Booked Successfully!</h3>
              <p>We've sent confirmation details to your email.</p>
            </div>
          </motion.div>
        )}

        {apiError && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <FaExclamationTriangle className="error-icon" />
            <div>
              <h3>Booking Error</h3>
              <p>{apiError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="book-content">
        {/* Test Information Card */}
        <motion.div
          className="test-info-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="test-header">
            <h2>
              <span className="test-icon">
                {React.createElement(getIconComponent(testDetails.icon), {
                  size: 50,
                })}{" "}
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

            <div className="accordion-section">
              {testDetails.whyToTake && (
                <div className="accordion-item">
                  <button
                    className="accordion-header"
                    onClick={() => toggleAccordion(0)}
                    aria-expanded={activeAccordion === 0}
                  >
                    <span>Why Take This Test?</span>
                    {activeAccordion === 0 ? <FaMinus /> : <FaPlus />}
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 0 && (
                      <motion.div
                        className="accordion-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p>{testDetails.whyToTake}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion(1)}
                  aria-expanded={activeAccordion === 1}
                >
                  <span>What to Expect</span>
                  {activeAccordion === 1 ? <FaMinus /> : <FaPlus />}
                </button>
                <AnimatePresence>
                  {activeAccordion === 1 && (
                    <motion.div
                      className="accordion-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>
                        Our professional will arrive at your location at the
                        scheduled time with all necessary equipment. The test
                        will be conducted in a clean, professional manner with
                        your comfort in mind.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="test-footer">
              <div className="test-price">
                <span className="price-label">Total Cost:</span>
                <span className="price-value">
                  <FaRupeeSign />{" "}
                  {testDetails.totalCost?.toLocaleString("en-IN") || "0"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Booking Form Section */}
        <motion.form
          className="booking-form"
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
              maxLength="100"
              className={formErrors.fullName ? "error" : ""}
              aria-invalid={!!formErrors.fullName}
              aria-describedby={
                formErrors.fullName ? "fullName-error" : undefined
              }
            />
            {formErrors.fullName && (
              <span className="error-message" id="fullName-error">
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
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? "email-error" : undefined}
              />
              {formErrors.email && (
                <span className="error-message" id="email-error">
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
                aria-invalid={!!formErrors.phone}
                aria-describedby={formErrors.phone ? "phone-error" : undefined}
              />
              {formErrors.phone && (
                <span className="error-message" id="phone-error">
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
                      aria-invalid={!!formErrors.gender}
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
                aria-invalid={!!formErrors.preferredDate}
                aria-describedby={
                  formErrors.preferredDate ? "date-error" : undefined
                }
              />
              {formErrors.preferredDate && (
                <span className="error-message" id="date-error">
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
                  aria-invalid={!!formErrors.preferredTime}
                  aria-describedby={
                    formErrors.preferredTime ? "time-error" : undefined
                  }
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
                <span className="error-message" id="time-error">
                  <FaInfoCircle /> {formErrors.preferredTime}
                </span>
              )}
            </div>
          </div>

          <h2>
            <FaMapMarkerAlt className="section-icon" /> Address Information
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
              maxLength="200"
              className={formErrors.street ? "error" : ""}
              aria-invalid={!!formErrors.street}
              aria-describedby={formErrors.street ? "street-error" : undefined}
            />
            {formErrors.street && (
              <span className="error-message" id="street-error">
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
                maxLength="50"
                className={formErrors.city ? "error" : ""}
                aria-invalid={!!formErrors.city}
                aria-describedby={formErrors.city ? "city-error" : undefined}
              />
              {formErrors.city && (
                <span className="error-message" id="city-error">
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
                maxLength="50"
                className={formErrors.state ? "error" : ""}
                aria-invalid={!!formErrors.state}
                aria-describedby={formErrors.state ? "state-error" : undefined}
              />
              {formErrors.state && (
                <span className="error-message" id="state-error">
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
                aria-invalid={!!formErrors.zip}
                aria-describedby={formErrors.zip ? "zip-error" : undefined}
              />
              {formErrors.zip && (
                <span className="error-message" id="zip-error">
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
                  aria-invalid={!!formErrors.country}
                  aria-describedby={
                    formErrors.country ? "country-error" : undefined
                  }
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
                <span className="error-message" id="country-error">
                  <FaInfoCircle /> {formErrors.country}
                </span>
              )}
            </div>
          </div>
          <div className="payment-method-section">
            <h2>
              <FaIcons.FaMoneyBillWave className="section-icon" /> Payment
              Method
            </h2>
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
                  <FaIcons.FaMoneyBillWave className="payment-icon" />
                  <span>Pay at Visit</span>
                  <small>Cash, credit, or debit when doctor arrives</small>
                  <FaIcons.FaBoxOpen className="payment-icon" />
                  <span>Cash on Delivery (COD)</span>
                  <small>Pay when the technician arrives</small>
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
                  <FaIcons.FaCreditCard className="payment-icon" />
                  <span>Online Payment</span>
                  <small>Pay securely now with card/UPI/net banking</small>
                </div>
              </label>
            </div>
            {formErrors.paymentMethod && (
              <span className="error-message">
                <FaInfoCircle /> {formErrors.paymentMethod}
              </span>
            )}
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
              maxLength="500"
            ></textarea>
            <div className="char-count">
              {formData.notes.length}/500 characters
            </div>
          </div>

          <div className="form-footer">
            <div className="privacy-notice">
              <FaShieldAlt className="privacy-icon" />
              <p>
                Your information is secure and will only be used for your
                appointment. We adhere to strict privacy policies.
              </p>
            </div>

            {apiError && (
              <div className="form-error">
                <FaExclamationTriangle /> {apiError}
              </div>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spinner" /> Processing...
                  </>
                ) : formData.paymentMethod === "online" ? (
                  <>
                    Proceed to Payment <FaArrowRight className="btn-icon" />
                  </>
                ) : (
                  <>
                    Confirm Booking <FaArrowRight className="btn-icon" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.form>
      </div>
      <BottomNavigation />

      <style>{`
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

  html {
    font-size: 16px;
  }

  body {
    font-family: "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                 Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
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
    padding: 3rem 2rem;
    border-radius: 0 0 var(--border-radius-xl) var(--border-radius-xl);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 220px;
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

  .header-illustration {
    position: relative;
    width: 300px;
    height: 200px;
    z-index: 1;
    flex-shrink: 0;
  }

  .illustration-circle {
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }

  .illustration-dots {
    position: absolute;
    width: 100px;
    height: 100px;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.2) 2px,
      transparent 2px
    );
    background-size: 20px 20px;
    top: 20px;
    right: 50px;
  }

  .book-header h1 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    margin-bottom: 0.75rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .book-header p {
    font-size: clamp(1rem, 2vw, 1.15rem);
    opacity: 0.9;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .header-badges {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: flex-start;
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
    margin: 1rem 0;
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
    font-size: clamp(1.5rem, 2vw, 1.75rem);
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

  /* Accordion Styles */
  .accordion-section {
    margin-bottom: 2rem;
  }

  .accordion-item {
    margin-bottom: 0.5rem;
    border-radius: var(--border-radius);
    overflow: hidden;
    border: 1px solid var(--secondary-light);
  }

  .accordion-header {
    width: 100%;
    padding: 1rem 1.5rem;
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

  .accordion-content {
    padding: 0 1.5rem;
    background: white;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.3s ease-out;
  }

  .accordion-content[aria-hidden="false"] {
    max-height: 1000px;
    padding: 1rem 1.5rem;
  }

  .accordion-content p {
    color: var(--secondary-color);
    line-height: 1.6;
    margin: 1rem 0;
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

  .booking-form h2 {
    color: var(--primary-dark);
    margin: 0 0 1.75rem;
    font-size: clamp(1.25rem, 2vw, 1.5rem);
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
    flex: 1 1 200px;
    min-width: 0;
    padding: 1.5rem;
    border: 2px solid #ddd;
    border-radius: var(--border-radius);
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
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .payment-icon {
    font-size: 2rem;
    color: var(--success-color);
  }

  .payment-option small {
    color: var(--secondary-color);
    font-size: 0.8rem;
    text-align: center;
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

    .header-illustration {
      width: 250px;
    }

    .test-info-card,
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
      padding: 2.5rem 1.5rem;
      min-height: auto;
    }

    .header-content {
      margin-bottom: 1.5rem;
      text-align: center;
      align-items: center;
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

    .test-info-card {
      order: 2;
    }

    .booking-form {
      order: 1;
      margin-bottom: 2rem;
    }
  }

  @media (max-width: 600px) {
    .book-header {
      padding: 2rem 1rem;
      border-radius: 0;
    }

    .book-container {
      padding-bottom: 4rem;
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
      font-size: 1rem;
    }

    .test-badge {
      right: 10px;
      font-size: 0.7rem;
      padding: 0.2rem 0.8rem;
    }

    .form-progress {
      margin-bottom: 1.5rem;
    }

    .step-label {
      font-size: 0.75rem;
      max-width: 60px;
    }

    .payment-option {
      flex: 1 1 100%;
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

    .test-info-card,
    .booking-form {
      padding: 1.25rem;
    }

    .detail-card {
      flex-direction: column;
      align-items: flex-start;
    }

    .test-price {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }

  /* Animation Enhancements */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .book-header,
  .book-content,
  .booking-form {
    animation: fadeIn 0.5s ease-out forwards;
  }

  .book-content {
    animation-delay: 0.1s;
  }

  .booking-form {
    animation-delay: 0.2s;
  }
`}</style>
    </div>
  );
};

export default Book;
