import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";
import {
  FaFlask,
  FaPen,
  FaAlignLeft,
  FaClipboardCheck,
  FaClock,
  FaQuestionCircle,
  FaRupeeSign,
  FaPlusCircle,
  FaSpinner,
  FaArrowLeft,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

const AddTest = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    preparation: "",
    turnaroundTime: "24-48 hours",
    whyToTake: "",
    totalCost: "",
    isPopular: false,
    icon: "FaFlask",
  });

  const [category, setCategory] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const turnaroundOptions = [
    "24 hours",
    "24-48 hours",
    "3-5 business days",
    "1 week",
    "2 weeks",
  ];

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/categories/${categoryId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch category");
        }
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        toast.error("Failed to load category details");
      }
    };

    fetchCategory();
  }, [categoryId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Test name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Test name must be at least 3 characters";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Test name cannot exceed 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.trim().length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    if (!formData.turnaroundTime.trim()) {
      newErrors.turnaroundTime = "Turnaround time is required";
    } else if (formData.turnaroundTime.trim().length > 50) {
      newErrors.turnaroundTime = "Turnaround time cannot exceed 50 characters";
    }

    if (!formData.totalCost) {
      newErrors.totalCost = "Cost is required";
    } else if (isNaN(formData.totalCost)) {
      newErrors.totalCost = "Must be a valid number";
    } else if (Number(formData.totalCost) <= 0) {
      newErrors.totalCost = "Must be greater than 0";
    }

    if (!formData.icon.trim()) {
      newErrors.icon = "Icon name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const testData = {
        ...formData,
        totalCost: parseFloat(formData.totalCost),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories/${categoryId}/tests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const serverErrors = {};
          data.errors.forEach((err) => {
            serverErrors[err.param] = err.msg;
          });
          setErrors(serverErrors);
          throw new Error("Validation errors");
        }
        throw new Error(data.message || "Failed to add test");
      }

      toast.success("Test added successfully!");
      navigate("/hub/services", {
        state: { refresh: true },
      });
    } catch (error) {
      console.error("Error adding test:", error);
      if (error.message !== "Validation errors") {
        toast.error(error.message || "Failed to add test. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!category) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner-icon" />
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="add-test-container">
        <div className="add-test-card">
          <div className="add-test-header">
            <div className="header-content">
              <div className="header-icon">
                <FaFlask />
              </div>
              <h2 className="add-test-title">
                Add New Test to {category.name}
              </h2>
              <p className="add-test-subtitle">
                Fill in the test details below. All fields are required unless
                marked optional.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="add-test-form" noValidate>
            {/* Test Name */}
            <div
              className={`form-group ${errors.name ? "error" : ""} ${
                activeField === "name" ? "active" : ""
              }`}
            >
              <label htmlFor="name" className="form-label">
                <FaPen className="label-icon" />
                Test Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Complete Blood Count, Lipid Profile..."
                required
                onFocus={() => setActiveField("name")}
                onBlur={() => setActiveField(null)}
              />
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
              <div className="hint-text">
                Enter the full name of the test as it should appear to users
              </div>
            </div>

            {/* Icon Name */}
            <div
              className={`form-group ${errors.icon ? "error" : ""} ${
                activeField === "icon" ? "active" : ""
              }`}
            >
              <label htmlFor="icon" className="form-label">
                <FaInfoCircle className="label-icon" />
                Icon Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="form-input"
                placeholder="FaFlask, FaHeartbeat, FaMicroscope..."
                required
                onFocus={() => setActiveField("icon")}
                onBlur={() => setActiveField(null)}
              />
              {errors.icon && (
                <div className="error-message">{errors.icon}</div>
              )}
            </div>

            {/* Description */}
            <div
              className={`form-group ${errors.description ? "error" : ""} ${
                activeField === "description" ? "active" : ""
              }`}
            >
              <label htmlFor="description" className="form-label">
                <FaAlignLeft className="label-icon" />
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="What does this test measure? What biomarkers are included?"
                required
                rows="4"
                onFocus={() => setActiveField("description")}
                onBlur={() => setActiveField(null)}
              />
              {errors.description && (
                <div className="error-message">{errors.description}</div>
              )}
              <div className="hint-text">
                Provide a clear description of what the test measures and
                includes
              </div>
            </div>

            {/* Preparation Instructions */}
            <div
              className={`form-group ${
                activeField === "preparation" ? "active" : ""
              }`}
            >
              <label htmlFor="preparation" className="form-label">
                <FaClipboardCheck className="label-icon" />
                Preparation Instructions (Optional)
              </label>
              <textarea
                id="preparation"
                name="preparation"
                value={formData.preparation}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Fasting required? Medication restrictions? Special instructions?"
                rows="3"
                onFocus={() => setActiveField("preparation")}
                onBlur={() => setActiveField(null)}
              />
              <div className="hint-text">
                Any special instructions patients should follow before taking
                this test
              </div>
            </div>

            {/* Turnaround Time */}
            <div
              className={`form-group ${errors.turnaroundTime ? "error" : ""} ${
                activeField === "turnaroundTime" ? "active" : ""
              }`}
            >
              <label htmlFor="turnaroundTime" className="form-label">
                <FaClock className="label-icon" />
                Turnaround Time <span className="required">*</span>
              </label>
              <select
                id="turnaroundTime"
                name="turnaroundTime"
                value={formData.turnaroundTime}
                onChange={handleChange}
                className="form-input"
                required
                onFocus={() => setActiveField("turnaroundTime")}
                onBlur={() => setActiveField(null)}
              >
                {turnaroundOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.turnaroundTime && (
                <div className="error-message">{errors.turnaroundTime}</div>
              )}
              <div className="hint-text">
                Estimated time for test results to be available
              </div>
            </div>

            {/* Why to Take */}
            <div
              className={`form-group ${
                activeField === "whyToTake" ? "active" : ""
              }`}
            >
              <label htmlFor="whyToTake" className="form-label">
                <FaQuestionCircle className="label-icon" />
                Why Take This Test? (Optional)
              </label>
              <textarea
                id="whyToTake"
                name="whyToTake"
                value={formData.whyToTake}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Diagnosis, monitoring, screening purposes..."
                rows="3"
                onFocus={() => setActiveField("whyToTake")}
                onBlur={() => setActiveField(null)}
              />
              <div className="hint-text">
                Explain the purpose and benefits of this test
              </div>
            </div>

            {/* Total Cost */}
            <div
              className={`form-group ${errors.totalCost ? "error" : ""} ${
                activeField === "totalCost" ? "active" : ""
              }`}
            >
              <label htmlFor="totalCost" className="form-label">
                <FaRupeeSign className="label-icon" />
                Total Cost <span className="required">*</span>
              </label>
              <div className="input-container">
                <span className="currency-symbol">₹</span>
                <input
                  type="number"
                  id="totalCost"
                  name="totalCost"
                  value={formData.totalCost}
                  onChange={handleChange}
                  className="form-input with-currency"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                  onFocus={() => setActiveField("totalCost")}
                  onBlur={() => setActiveField(null)}
                />
              </div>
              {errors.totalCost && (
                <div className="error-message">{errors.totalCost}</div>
              )}
              <div className="hint-text">
                Enter the total cost of the test in INR
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                <FaArrowLeft className="button-icon" /> Cancel
              </button>
              <button
                type="submit"
                className={`submit-button ${isSubmitting ? "disabled" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="button-icon spinner" /> Processing...
                  </>
                ) : (
                  <>
                    <FaPlusCircle className="button-icon" /> Add Test
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <style jsx>{`
          /* Base Styles */
          :root {
            --primary: #6a0dad;
            --primary-light: #8a2be2;
            --primary-lighter: #b57edc;
            --primary-dark: #4b0082;
            --primary-extra-light: #f3e5ff;
            --secondary: #f8f9fa;
            --accent: #ff6b6b;
            --text: #2d3748;
            --text-light: #4a5568;
            --light-text: #ffffff;
            --background: #f5f3ff;
            --card-bg: #ffffff;
            --border: #e2e8f0;
            --border-light: #edf2f7;
            --error: #e53e3e;
            --error-light: #fed7d7;
            --success: #38a169;
            --success-light: #c6f6d5;
            --hint: #718096;
            --link: #4299e1;
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
            --radius-sm: 0.25rem;
            --radius: 0.5rem;
            --radius-md: 0.75rem;
            --radius-lg: 1rem;
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
              Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
              sans-serif;
            background-color: var(--background);
            color: var(--text);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          /* Container Styles */
          .add-test-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            padding: 2rem 1rem;
            background-color: var(--background);
          }

          .add-test-card {
            width: 100%;
            max-width: 800px;
            background-color: var(--card-bg);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Header Styles */
          .add-test-header {
            background: linear-gradient(
              135deg,
              var(--primary) 0%,
              var(--primary-light) 100%
            );
            color: var(--light-text);
            padding: 2.5rem 2rem;
            position: relative;
            text-align: center;
          }

          .header-content {
            position: relative;
            z-index: 1;
          }

          .header-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            font-size: 1.75rem;
          }

          .add-test-title {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            letter-spacing: -0.025em;
          }

          .add-test-subtitle {
            font-size: 1rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
          }

          /* Form Styles */
          .add-test-form {
            padding: 2.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.75rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            transition: all 0.3s ease;
          }

          .form-group.active {
            border-left: 3px solid var(--primary);
            padding-left: 1rem;
          }

          .form-group.error {
            border-left: 3px solid var(--error);
            padding-left: 1rem;
          }

          .form-label {
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--text);
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .label-icon {
            color: var(--primary);
            font-size: 1rem;
            width: 20px;
            text-align: center;
          }

          .required {
            color: var(--error);
            margin-left: 0.25rem;
          }

          .form-input,
          .form-textarea {
            padding: 0.875rem 1.25rem;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            font-size: 1rem;
            width: 100%;
            background-color: var(--card-bg);
            outline: none;
            color: var(--text);
            transition: all 0.2s ease;
            font-family: inherit;
          }

          .form-input:focus,
          .form-textarea:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px var(--primary-extra-light);
          }

          .form-input::placeholder,
          .form-textarea::placeholder {
            color: var(--text-light);
            opacity: 0.6;
          }

          .form-textarea {
            min-height: 120px;
            resize: vertical;
            line-height: 1.5;
          }

          select.form-input {
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 1rem center;
            background-size: 1em;
          }

          .hint-text {
            font-size: 0.825rem;
            color: var(--hint);
            margin-top: 0.25rem;
            line-height: 1.5;
          }

          .link {
            color: var(--link);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
          }

          .link:hover {
            color: var(--primary);
            text-decoration: underline;
          }

          /* Toggle Switch */
          .toggle-container {
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
            margin-top: 0.5rem;
          }

          .toggle-input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
          }

          .toggle-slider {
            position: relative;
            width: 50px;
            height: 26px;
            background-color: #e2e8f0;
            transition: all 0.3s ease;
            border-radius: 34px;
            margin-right: 12px;
          }

          .toggle-slider:after {
            content: "";
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: white;
            top: 3px;
            left: 3px;
            transition: all 0.3s ease;
            box-shadow: var(--shadow-sm);
          }

          .toggle-input:checked + .toggle-slider {
            background-color: var(--primary);
          }

          .toggle-input:checked + .toggle-slider:after {
            transform: translateX(24px);
          }

          .toggle-label {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.95rem;
            font-weight: 500;
            color: var(--text);
          }

          .toggle-icon {
            color: var(--primary);
            font-size: 1.1rem;
          }

          /* Input with currency symbol */
          .input-container {
            position: relative;
            display: flex;
            align-items: center;
          }

          .currency-symbol {
            position: absolute;
            left: 1.25rem;
            color: var(--text-light);
            font-weight: 500;
            pointer-events: none;
          }

          .form-input.with-currency {
            padding-left: 2.5rem;
          }

          /* Error Message */
          .error-message {
            color: var(--error);
            font-size: 0.85rem;
            margin-top: 0.25rem;
            padding: 0.5rem;
            background-color: var(--error-light);
            border-radius: var(--radius-sm);
            display: inline-block;
          }

          /* Form Actions */
          .form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-light);
          }

          .cancel-button,
          .submit-button {
            flex: 1;
            padding: 1rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            border-radius: var(--radius);
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
          }

          .cancel-button {
            background-color: var(--secondary);
            color: var(--text-light);
            border: 1px solid var(--border);
          }

          .cancel-button:hover {
            background-color: #edf2f7;
            border-color: #cbd5e0;
          }

          .submit-button {
            background-color: var(--primary);
            color: var(--light-text);
            border: none;
            box-shadow: var(--shadow);
          }

          .submit-button:hover:not(.disabled) {
            background-color: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
          }

          .submit-button.disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none;
          }

          .button-icon {
            font-size: 1.1rem;
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

          /* Loading State */
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: var(--background);
          }

          .spinner-icon {
            font-size: 3rem;
            color: var(--primary);
            animation: spin 1s linear infinite;
          }

          /* Responsive Styles */
          @media (max-width: 768px) {
            .add-test-container {
              padding: 1rem;
            }

            .add-test-header {
              padding: 2rem 1.5rem;
            }

            .add-test-form {
              padding: 1.5rem;
            }

            .add-test-title {
              font-size: 1.5rem;
            }
          }

          @media (max-width: 480px) {
            .add-test-header {
              padding: 1.75rem 1.25rem;
            }

            .add-test-form {
              padding: 1.25rem;
              gap: 1.5rem;
            }

            .form-actions {
              flex-direction: column;
            }

            .cancel-button,
            .submit-button {
              width: 100%;
            }

            .header-icon {
              width: 50px;
              height: 50px;
              font-size: 1.5rem;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default AddTest;
