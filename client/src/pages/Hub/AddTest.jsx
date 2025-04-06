import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaFlask,
  FaHeartbeat,
  FaDna,
  FaMicroscope,
  FaVial,
  FaPills,
  FaXRay,
  FaAllergies,
  FaProcedures,
  FaStethoscope,
  FaPen,
  FaAlignLeft,
  FaClipboardCheck,
  FaClock,
  FaQuestionCircle,
  FaDollarSign,
  FaPlusCircle,
  FaSpinner,
  FaArrowLeft,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaTimes,
  FaInfoCircle,
  FaExclamationCircle,
  FaHourglassHalf,
  FaLightbulb,
  FaMoneyBillWave,
  FaIcons,
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
  const [showIconPicker, setShowIconPicker] = useState(false);

  const iconComponents = {
    FaFlask,
    FaHeartbeat,
    FaDna,
    FaMicroscope,
    FaVial,
    FaPills,
    FaXRay,
    FaAllergies,
    FaProcedures,
    FaStethoscope,
  };

  const popularIcons = Object.keys(iconComponents);
  const turnaroundOptions = [
    "24 hours",
    "24-48 hours",
    "3-5 business days",
    "1 week",
    "2 weeks",
    "Custom (see notes)",
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

  const handleIconSelect = (icon) => {
    setFormData((prev) => ({ ...prev, icon }));
    setShowIconPicker(false);
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
      navigate(`/hub/categories/${categoryId}`, {
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

  const renderIcon = (iconName) => {
    const IconComponent = iconComponents[iconName] || FaFlask;
    return <IconComponent className="icon" />;
  };

  if (!category) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner-icon" />
      </div>
    );
  }

  return (
    <div className="add-test-container">
      <div className="add-test-card">
        <div className="add-test-header">
          <div className="header-content">
            <div className="header-icon-container">
              {renderIcon(formData.icon)}
            </div>
            <h2 className="add-test-title">Add New Test to {category.name}</h2>
            <p className="add-test-subtitle">
              Complete all required fields to add a new test
            </p>
          </div>
          <div className="progress-bar"></div>
        </div>

        <form onSubmit={handleSubmit} className="add-test-form" noValidate>
          {/* Test Name (Required) */}
          <div
            className={`form-group ${errors.name ? "error" : ""} ${
              activeField === "name" ? "active" : ""
            }`}
          >
            <label htmlFor="name" className="form-label">
              <FaPen className="label-icon" />
              Test Name <span className="required">*</span>
            </label>
            <div className="input-container">
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
            </div>
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          {/* Icon Selection */}
          <div
            className={`form-group ${activeField === "icon" ? "active" : ""}`}
          >
            <label className="form-label">
              <FaIcons className="label-icon" />
              Test Icon
            </label>
            <div
              className="icon-selection"
              onClick={() => setShowIconPicker(!showIconPicker)}
            >
              <div className="icon-preview">
                {renderIcon(formData.icon)}
                <span>{formData.icon}</span>
                {showIconPicker ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {showIconPicker && (
                <div className="icon-picker">
                  <div className="icon-grid">
                    {popularIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`icon-option ${
                          formData.icon === icon ? "selected" : ""
                        }`}
                        onClick={() => handleIconSelect(icon)}
                      >
                        {renderIcon(icon)}
                        <span className="icon-name">{icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description (Required) */}
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
          </div>

          {/* Preparation Instructions */}
          <div
            className={`form-group ${
              activeField === "preparation" ? "active" : ""
            }`}
          >
            <label htmlFor="preparation" className="form-label">
              <FaClipboardCheck className="label-icon" />
              Preparation Instructions
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
          </div>

          {/* Turnaround Time (Required) */}
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
          </div>

          {/* Why to Take */}
          <div
            className={`form-group ${
              activeField === "whyToTake" ? "active" : ""
            }`}
          >
            <label htmlFor="whyToTake" className="form-label">
              <FaQuestionCircle className="label-icon" />
              Why Take This Test?
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
          </div>

          {/* Total Cost (Required) */}
          <div
            className={`form-group ${errors.totalCost ? "error" : ""} ${
              activeField === "totalCost" ? "active" : ""
            }`}
          >
            <label htmlFor="totalCost" className="form-label">
              <FaDollarSign className="label-icon" />
              Total Cost <span className="required">*</span>
            </label>
            <div className="input-container">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="totalCost"
                name="totalCost"
                value={formData.totalCost}
                onChange={handleChange}
                className="form-input"
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
          </div>

          {/* Popular Test Toggle */}
          <div className="form-group toggle-group">
            <label className="toggle-container">
              <input
                type="checkbox"
                name="isPopular"
                checked={formData.isPopular}
                onChange={handleChange}
                className="toggle-input"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">
                <FaStar className="toggle-icon" /> Mark as Popular Test
              </span>
            </label>
            <p className="toggle-description">
              Popular tests will be highlighted in the test list
            </p>
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

        {/* Error Message */}
        {errors.submit && (
          <div className="alert-message error">
            <div className="alert-content">
              <FaExclamationCircle className="alert-icon" />
              <span>{errors.submit}</span>
            </div>
            <button
              onClick={() => setErrors((prev) => ({ ...prev, submit: null }))}
              className="close-button"
            >
              <FaTimes />
            </button>
          </div>
        )}
      </div>
      <style jsx>{`
        /* Base Styles */
        :root {
          --primary: #6a0dad;
          --primary-light: #9c4dff;
          --primary-lighter: #d9b3ff;
          --primary-dark: #4a0072;
          --secondary: #f3e5ff;
          --accent: #ff6f00;
          --text: #333;
          --light-text: #fff;
          --background: #faf5ff;
          --card-bg: #fff;
          --border: #e0d0f0;
          --error: #f44336;
          --success: #2e7d32;
          --success-bg: #f0fff4;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          background: linear-gradient(135deg, #f5f3ff 0%, #e8eaf6 100%);
          color: var(--text);
          line-height: 1.6;
        }

        /* Container Styles */
        .add-test-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 2rem;
        }

        .add-test-card {
          width: 100%;
          max-width: 800px;
          background-color: var(--card-bg);
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(106, 13, 173, 0.15);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        /* Header Styles */
        .add-test-header {
          background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--primary-light) 100%
          );
          color: var(--light-text);
          padding: 2rem 2.5rem 1.5rem;
          position: relative;
        }

        .header-content {
          position: relative;
          z-index: 2;
        }

        .header-icon-container {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .header-icon-container .icon {
          font-size: 1.75rem;
          color: var(--light-text);
        }

        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          width: 100%;
        }

        .progress-bar::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 70%;
          background: var(--light-text);
          border-radius: 4px;
          animation: progress 2s ease-in-out infinite;
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0%;
            left: 100%;
          }
        }

        .add-test-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
          color: var(--light-text);
        }

        .add-test-subtitle {
          font-size: 1rem;
          opacity: 0.9;
          margin: 0;
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
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid transparent;
        }

        .form-group.active {
          border-color: var(--secondary);
          background-color: var(--background);
          box-shadow: 0 0 0 3px rgba(106, 13, 173, 0.1);
        }

        .form-group.error {
          border-color: var(--error);
        }

        .form-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .label-icon {
          color: var(--primary);
          font-size: 0.9rem;
          width: 20px;
          text-align: center;
        }

        .required {
          color: var(--error);
          margin-left: 0.25rem;
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          color: #999;
          font-size: 1rem;
        }

        .form-input {
          padding: 0.85rem 1.25rem 0.85rem 40px;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          font-size: 1rem;
          width: 100%;
          background-color: var(--card-bg);
          outline: none;
          color: var(--text);
          transition: all 0.3s ease;
        }

        .form-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--secondary);
        }

        .form-textarea {
          padding: 0.85rem 1.25rem 0.85rem 40px;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          font-size: 1rem;
          width: 100%;
          min-height: 120px;
          background-color: var(--card-bg);
          outline: none;
          color: var(--text);
          transition: all 0.3s ease;
          resize: vertical;
        }

        .form-textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--secondary);
        }

        /* Icon Selection Styles */
        .icon-selection {
          cursor: pointer;
          position: relative;
        }

        .icon-preview {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          background-color: var(--card-bg);
        }

        .icon-preview .icon {
          color: var(--primary);
          font-size: 1.2rem;
        }

        .icon-picker {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: var(--card-bg);
          border: 1px solid #e0e0e0;
          border-radius: 0 0 10px 10px;
          padding: 1rem;
          z-index: 10;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-top: 0.25rem;
        }

        .icon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .icon-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          border-radius: 10px;
          border: 1px solid #eee;
          cursor: pointer;
          transition: all 0.2s ease;
          background: var(--card-bg);
          aspect-ratio: 1/1;
        }

        .icon-option:hover {
          background-color: var(--secondary);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .icon-option.selected {
          background-color: var(--secondary);
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(106, 13, 173, 0.2);
        }

        .icon-option .icon {
          font-size: 1.25rem;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .icon-name {
          font-size: 0.7rem;
          text-align: center;
          word-break: break-all;
        }

        /* Toggle Switch Styles */
        .toggle-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .toggle-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
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
          height: 24px;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 24px;
          margin-right: 10px;
        }

        .toggle-slider:after {
          content: "";
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: white;
          top: 2px;
          left: 2px;
          transition: 0.4s;
        }

        .toggle-input:checked + .toggle-slider {
          background-color: var(--primary);
        }

        .toggle-input:checked + .toggle-slider:after {
          transform: translateX(26px);
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .toggle-icon {
          color: var(--primary);
        }

        .toggle-description {
          font-size: 0.85rem;
          color: #666;
          margin-left: 60px;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .cancel-button,
        .submit-button {
          flex: 1;
          padding: 1rem 1.75rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .cancel-button {
          background-color: #f5f5f5;
          color: #666;
          border: 1px solid #ddd;
        }

        .cancel-button:hover {
          background-color: #e9e9e9;
        }

        .submit-button {
          background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--primary-light) 100%
          );
          color: var(--light-text);
          border: none;
          box-shadow: 0 4px 15px rgba(106, 13, 173, 0.3);
        }

        .submit-button:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(106, 13, 173, 0.4);
        }

        .submit-button.disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none !important;
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

        /* Alert Messages */
        .alert-message {
          padding: 1rem 1.5rem;
          border-radius: 10px;
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation: fadeIn 0.3s ease;
        }

        .alert-message.error {
          background-color: #ffebee;
          color: var(--error);
          border-left: 4px solid var(--error);
        }

        .alert-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .alert-icon {
          font-size: 1.2rem;
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          padding: 0.25rem;
          margin-left: 0.5rem;
          opacity: 0.7;
        }

        .close-button:hover {
          opacity: 1;
        }

        /* Error Message */
        .error-message {
          color: var(--error);
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        /* Loading State */
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .spinner-icon {
          font-size: 3rem;
          color: var(--primary);
          animation: spin 1s linear infinite;
        }

        /* Currency Symbol */
        .currency-symbol {
          position: absolute;
          left: 40px;
          color: #666;
          font-weight: bold;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .add-test-container {
            padding: 1rem;
          }

          .add-test-header,
          .add-test-form {
            padding: 1.5rem;
          }

          .add-test-title {
            font-size: 1.5rem;
          }

          .form-group {
            padding: 0.75rem;
          }

          .form-textarea {
            min-height: 100px;
          }
        }

        @media (max-width: 480px) {
          .add-test-header {
            padding: 1.5rem 1rem;
          }

          .add-test-form {
            padding: 1rem;
          }

          .icon-grid {
            grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default AddTest;
