import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../../components/BottomNav";
import {
  FaBed,
  FaProcedures,
  FaPhone,
  FaAmbulance,
  FaStar,
  FaWheelchair,
  FaClinicMedical,
  FaFilter,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import {
  MdLocationOn,
  MdLocalHospital,
  MdAir,
  MdMonetizationOn,
  MdDateRange,
} from "react-icons/md";

const Hospitals = () => {
  const [hospitals, setHospitals] = useState(nearbyHospitals);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [bedType, setBedType] = useState("general");
  const [checkInDate, setCheckInDate] = useState("");
  const [duration, setDuration] = useState(1);
  const [filter, setFilter] = useState({
    minRating: 0,
    maxDistance: 10,
    hasVentilator: false,
    hasICU: false,
    specialties: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = nearbyHospitals.filter((hospital) => {
      const matchesSearch =
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.specialties.some((s) =>
          s.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesRating = hospital.rating >= filter.minRating;
      const distance = parseFloat(hospital.distance.split(" ")[0]);
      const matchesDistance = distance <= filter.maxDistance;
      const matchesVentilator =
        !filter.hasVentilator || hospital.beds.ventilator > 0;
      const matchesICU = !filter.hasICU || hospital.beds.icu > 0;
      const matchesSpecialties =
        filter.specialties.length === 0 ||
        filter.specialties.some((spec) => hospital.specialties.includes(spec));

      return (
        matchesSearch &&
        matchesRating &&
        matchesDistance &&
        matchesVentilator &&
        matchesICU &&
        matchesSpecialties
      );
    });

    setHospitals(filtered);
  }, [filter, searchTerm]);

  const handleBookNow = (hospital) => {
    if (!checkInDate) {
      alert("Please select a check-in date");
      return;
    }

    const bookingDetails = {
      hospital,
      bedType,
      checkInDate,
      duration,
      totalBeds: hospital.beds[bedType],
      contact: hospital.contact,
    };

    console.log("Booking details:", bookingDetails);
    alert(`Booking request sent to ${hospital.name} for ${bedType} bed`);

    setTimeout(() => {
      navigate("/confirmation", { state: { bookingDetails } });
    }, 1000);
  };

  const toggleSpecialty = (specialty) => {
    if (filter.specialties.includes(specialty)) {
      setFilter({
        ...filter,
        specialties: filter.specialties.filter((s) => s !== specialty),
      });
    } else {
      setFilter({
        ...filter,
        specialties: [...filter.specialties, specialty],
      });
    }
  };

  const allSpecialties = [
    ...new Set(nearbyHospitals.flatMap((h) => h.specialties)),
  ];

  return (
    <div className="hospitals-container">
      <BottomNavigation />
      <div className="hospitals-content">
        <div className="header-gradient">
          <h1 className="main-title">
            <MdLocalHospital className="hospital-icon" /> Find & Book Hospital
            Beds
          </h1>
          <p className="subtitle">
            Search and book hospital beds with real-time availability
          </p>
        </div>

        {/* Search and Filters */}
        <div className="search-filters-container">
          <div className="search-filters-row">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search hospitals or specialties..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-button ${showFilters ? "active" : ""}`}
            >
              <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {showFilters && (
            <div className="filters-expanded">
              <div className="filters-grid">
                <div className="filter-group">
                  <label className="filter-label">Minimum Rating</label>
                  <div className="rating-selector">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <button
                        key={rating}
                        className={`rating-option ${
                          filter.minRating === rating ? "selected" : ""
                        }`}
                        onClick={() =>
                          setFilter({ ...filter, minRating: rating })
                        }
                      >
                        {rating === 0 ? "Any" : `${rating}+`}
                        {rating > 0 && <FaStar className="star-icon" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Max Distance (km)</label>
                  <div className="distance-slider-container">
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={filter.maxDistance}
                      onChange={(e) =>
                        setFilter({
                          ...filter,
                          maxDistance: parseInt(e.target.value),
                        })
                      }
                      className="distance-slider"
                    />
                    <div className="distance-value">
                      {filter.maxDistance} km
                    </div>
                  </div>
                </div>

                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="ventilator"
                      checked={filter.hasVentilator}
                      onChange={(e) =>
                        setFilter({
                          ...filter,
                          hasVentilator: e.target.checked,
                        })
                      }
                      className="checkbox-input"
                    />
                    <label htmlFor="ventilator" className="checkbox-label">
                      <FaClinicMedical /> Has Ventilators
                    </label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="icu"
                      checked={filter.hasICU}
                      onChange={(e) =>
                        setFilter({ ...filter, hasICU: e.target.checked })
                      }
                      className="checkbox-input"
                    />
                    <label htmlFor="icu" className="checkbox-label">
                      <FaProcedures /> Has ICU
                    </label>
                  </div>
                </div>
              </div>

              <div className="specialties-filter">
                <label className="filter-label">Specialties</label>
                <div className="specialties-container">
                  {allSpecialties.map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() => toggleSpecialty(specialty)}
                      className={`specialty-button ${
                        filter.specialties.includes(specialty) ? "active" : ""
                      }`}
                    >
                      {specialty}
                      {filter.specialties.includes(specialty) && (
                        <span className="checkmark">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Booking Form */}
        {selectedHospital && (
          <div className="booking-form-container">
            <div className="booking-header">
              <h2 className="booking-title">
                Book a Bed at {selectedHospital.name}
              </h2>
              <button
                onClick={() => setSelectedHospital(null)}
                className="close-button"
              >
                <FaTimes />
              </button>
            </div>
            <div className="booking-form-grid">
              <div className="form-group">
                <label className="form-label">
                  <FaBed /> Bed Type
                </label>
                <div className="bed-type-selector">
                  {[
                    { value: "general", label: "General", icon: <FaBed /> },
                    { value: "icu", label: "ICU", icon: <FaProcedures /> },
                    { value: "oxygen", label: "Oxygen", icon: <MdAir /> },
                    {
                      value: "ventilator",
                      label: "Ventilator",
                      icon: <FaClinicMedical />,
                    },
                  ].map((type) => (
                    <button
                      key={type.value}
                      className={`bed-type-option ${
                        bedType === type.value ? "active" : ""
                      }`}
                      onClick={() => setBedType(type.value)}
                    >
                      <span className="bed-icon">{type.icon}</span>
                      <span className="bed-label">{type.label}</span>
                      <span className="bed-count">
                        {selectedHospital.beds[type.value]} available
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MdDateRange /> Check-in Date
                </label>
                <div className="date-input-container">
                  <input
                    type="date"
                    className="form-input"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Duration (days)</label>
                <div className="duration-selector">
                  {[1, 2, 3, 7, 14].map((days) => (
                    <button
                      key={days}
                      className={`duration-option ${
                        duration === days ? "active" : ""
                      }`}
                      onClick={() => setDuration(days)}
                    >
                      {days === 1
                        ? "1 day"
                        : days < 7
                        ? `${days} days`
                        : days === 7
                        ? "1 week"
                        : "2 weeks"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-details">
                <div>
                  <strong>Hospital:</strong> {selectedHospital.name}
                </div>
                <div>
                  <strong>Bed Type:</strong>{" "}
                  {bedType.charAt(0).toUpperCase() + bedType.slice(1)}
                </div>
                <div>
                  <strong>Duration:</strong> {duration} day
                  {duration > 1 ? "s" : ""}
                </div>
                {checkInDate && (
                  <div>
                    <strong>Check-in:</strong>{" "}
                    {new Date(checkInDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            <div className="booking-actions">
              <button
                onClick={() => handleBookNow(selectedHospital)}
                className="confirm-button"
                disabled={!checkInDate}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}

        {/* Hospitals List */}
        <div className="hospitals-grid">
          {hospitals.map((hospital) => (
            <div key={hospital.id} className="hospital-card">
              <div className="hospital-image-container">
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="hospital-image"
                />
                <div className="hospital-rating">
                  <FaStar className="star-icon" />
                  <span className="rating-value">{hospital.rating}</span>
                  <span className="rating-count">({hospital.reviews})</span>
                </div>
                <div className="hospital-distance-badge">
                  {hospital.distance} away
                </div>
              </div>

              <div className="hospital-details">
                <div className="hospital-header">
                  <h2 className="hospital-name">{hospital.name}</h2>
                  <div className="hospital-address">
                    <MdLocationOn className="location-icon" />
                    <span>{hospital.address}</span>
                  </div>
                </div>

                <div className="hospital-beds">
                  <div className="beds-grid">
                    <div className="bed-type">
                      <div className="bed-count">{hospital.beds.general}</div>
                      <div className="bed-label">General</div>
                    </div>
                    <div className="bed-type">
                      <div className="bed-count">{hospital.beds.icu}</div>
                      <div className="bed-label">ICU</div>
                    </div>
                    <div className="bed-type">
                      <div className="bed-count">{hospital.beds.oxygen}</div>
                      <div className="bed-label">Oxygen</div>
                    </div>
                    <div className="bed-type">
                      <div className="bed-count">
                        {hospital.beds.ventilator}
                      </div>
                      <div className="bed-label">Ventilator</div>
                    </div>
                  </div>
                </div>

                <div className="hospital-specialties">
                  <h3 className="specialties-title">Specialties:</h3>
                  <div className="specialties-list">
                    {hospital.specialties.map((specialty) => (
                      <span key={specialty} className="specialty-tag">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hospital-actions">
                  <button
                    onClick={() => setSelectedHospital(hospital)}
                    className="book-button"
                  >
                    Book a Bed
                  </button>

                  <div className="contact-buttons">
                    <a
                      href={`tel:${hospital.contact}`}
                      className="contact-button phone"
                      title="Call Hospital"
                    >
                      <FaPhone />
                    </a>
                    <a
                      href={`tel:${hospital.emergencyContact}`}
                      className="contact-button emergency"
                      title="Emergency Contact"
                    >
                      <FaAmbulance />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hospitals.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🏥</div>
            <h3>No hospitals found matching your criteria</h3>
            <p>Try adjusting your filters or search term</p>
            <button
              className="reset-filters"
              onClick={() => {
                setFilter({
                  minRating: 0,
                  maxDistance: 10,
                  hasVentilator: false,
                  hasICU: false,
                  specialties: [],
                });
                setSearchTerm("");
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
      <style>
        {`
        /* Base Styles */
        :root {
          --primary-color: #5e0d97;
          --primary-light: #8a2be2;
          --primary-dark: #4a0a7a;
          --secondary-color: #ff7e33;
          --accent-color: #00c9a7;
          --text-dark: #2d3748;
          --text-medium: #4a5568;
          --text-light: #718096;
          --bg-light: #f8f9fa;
          --bg-white: #ffffff;
          --border-color: #e2e8f0;
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
          --radius-sm: 6px;
          --radius-md: 10px;
          --radius-lg: 16px;
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: var(--text-dark);
          background-color: var(--bg-light);
        }
        
        .hospitals-container {
          min-height: 100vh;
          padding: 0;
          background-color: var(--bg-light);
        }
        
        .hospitals-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        /* Header */
        .header-gradient {
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          color: white;
          padding: 2rem;
          border-radius: var(--radius-md);
          margin-bottom: 2rem;
          box-shadow: var(--shadow-md);
        }
        
        .main-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          color: white;
        }
        
        .hospital-icon {
          margin-right: 12px;
          font-size: 1.8rem;
          color: white;
        }
        
        .subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 600px;
        }
        
        /* Search and Filters */
        .search-filters-container {
          background-color: var(--bg-white);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .search-filters-row {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .search-input-container {
          position: relative;
          flex-grow: 1;
        }
        
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
          font-size: 1rem;
        }
        
        .clear-search {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          font-size: 1rem;
          transition: color 0.2s;
        }
        
        .clear-search:hover {
          color: var(--primary-color);
        }
        
        .search-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          font-size: 1rem;
          transition: all 0.2s;
          background-color: var(--bg-white);
        }
        
        .search-input:focus {
          outline: none;
          border-color: var(--primary-light);
          box-shadow: 0 0 0 3px rgba(94, 13, 151, 0.1);
        }
        
        .filter-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: var(--bg-white);
          color: var(--primary-color);
          padding: 12px 16px;
          border: 1px solid var(--primary-color);
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          font-size: 0.95rem;
        }
        
        .filter-button:hover, .filter-button.active {
          background-color: var(--primary-color);
          color: white;
        }
        
        .filter-button.active {
          box-shadow: 0 0 0 3px rgba(94, 13, 151, 0.2);
        }
        
        .filters-expanded {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
        }
        
        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .filter-group {
          display: flex;
          flex-direction: column;
        }
        
        .filter-label {
          font-size: 0.9rem;
          color: var(--text-medium);
          margin-bottom: 0.75rem;
          font-weight: 600;
        }
        
        .rating-selector {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .rating-option {
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          border: 1px solid var(--border-color);
          background-color: var(--bg-white);
          color: var(--text-medium);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }
        
        .rating-option.selected {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        
        .rating-option:hover:not(.selected) {
          border-color: var(--primary-light);
          color: var(--primary-color);
        }
        
        .star-icon {
          color: #fcc419;
        }
        
        .distance-slider-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .distance-slider {
          flex-grow: 1;
          -webkit-appearance: none;
          height: 6px;
          border-radius: 3px;
          background: var(--border-color);
          outline: none;
        }
        
        .distance-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--primary-color);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .distance-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 0 3px rgba(94, 13, 151, 0.2);
        }
        
        .distance-value {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--primary-color);
          min-width: 50px;
          text-align: right;
        }
        
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }
        
        .checkbox-item {
          display: flex;
          align-items: center;
        }
        
        .checkbox-input {
          margin-right: 10px;
          width: 18px;
          height: 18px;
          accent-color: var(--primary-color);
          cursor: pointer;
        }
        
        .checkbox-label {
          font-size: 0.9rem;
          color: var(--text-medium);
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }
        
        .specialties-filter {
          margin-top: 1rem;
        }
        
        .specialties-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        
        .specialty-button {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          border: 1px solid var(--border-color);
          background-color: var(--bg-white);
          color: var(--text-medium);
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        
        .specialty-button.active {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
          padding-right: 32px;
        }
        
        .specialty-button:hover {
          border-color: var(--primary-light);
          color: var(--primary-color);
        }
        
        .checkmark {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.9rem;
        }
        
        /* Booking Form */
        .booking-form-container {
          background-color: var(--bg-white);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          padding: 1.5rem;
          margin-bottom: 2rem;
          position: relative;
        }
        
        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        
        .booking-title {
          font-size: 1.5rem;
          color: var(--primary-dark);
          margin-bottom: 0;
          font-weight: 600;
        }
        
        .close-button {
          background: none;
          border: none;
          color: var(--text-light);
          font-size: 1.2rem;
          cursor: pointer;
          transition: color 0.2s;
          padding: 4px;
        }
        
        .close-button:hover {
          color: var(--primary-color);
        }
        
        .booking-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-label {
          font-size: 0.9rem;
          color: var(--text-medium);
          margin-bottom: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .bed-type-selector {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
        }
        
        .bed-type-option {
          padding: 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background-color: var(--bg-white);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .bed-type-option:hover {
          border-color: var(--primary-light);
        }
        
        .bed-type-option.active {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }
        
        .bed-icon {
          font-size: 1.2rem;
          margin-bottom: 6px;
        }
        
        .bed-label {
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 4px;
        }
        
        .bed-count {
          font-size: 0.75rem;
          opacity: 0.8;
        }
        
        .bed-type-option.active .bed-count {
          opacity: 0.9;
        }
        
        .date-input-container {
          position: relative;
        }
        
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: var(--primary-light);
          box-shadow: 0 0 0 3px rgba(94, 13, 151, 0.1);
        }
        
        .duration-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .duration-option {
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          border: 1px solid var(--border-color);
          background-color: var(--bg-white);
          color: var(--text-medium);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .duration-option:hover {
          border-color: var(--primary-light);
          color: var(--primary-color);
        }
        
        .duration-option.active {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        
        .booking-summary {
          background-color: rgba(94, 13, 151, 0.05);
          border-radius: var(--radius-sm);
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-left: 3px solid var(--primary-color);
        }
        
        .booking-summary h3 {
          font-size: 1rem;
          color: var(--primary-dark);
          margin-bottom: 0.75rem;
        }
        
        .summary-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 8px;
          font-size: 0.9rem;
        }
        
        .summary-details div {
          margin-bottom: 4px;
        }
        
        .booking-actions {
          display: flex;
          justify-content: flex-end;
        }
        
        .confirm-button {
          padding: 12px 24px;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          border: none;
          border-radius: var(--radius-sm);
          color: white;
          cursor: pointer;
          font-weight: 500;
          font-size: 1rem;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .confirm-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
        }
        
        .confirm-button:disabled {
          background: var(--border-color);
          color: var(--text-light);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        /* Hospitals Grid */
        .hospitals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        .hospital-card {
          background-color: var(--bg-white);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        
        .hospital-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
        }
        
        .hospital-image-container {
          position: relative;
          height: 180px;
        }
        
        .hospital-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .hospital-rating {
          position: absolute;
          top: 12px;
          right: 12px;
          background-color: rgba(0, 0, 0, 0.7);
          padding: 6px 10px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          font-size: 0.85rem;
          color: white;
          backdrop-filter: blur(2px);
        }
        
        .rating-value {
          font-weight: 600;
          margin: 0 3px;
        }
        
        .rating-count {
          opacity: 0.8;
          font-size: 0.8rem;
        }
        
        .hospital-distance-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background-color: rgba(255, 255, 255, 0.9);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--primary-color);
        }
        
        .hospital-details {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        
        .hospital-header {
          margin-bottom: 1rem;
        }
        
        .hospital-name {
          font-size: 1.3rem;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        
        .hospital-address {
          display: flex;
          align-items: flex-start;
          color: var(--text-light);
          font-size: 0.9rem;
          gap: 6px;
        }
        
        .location-icon {
          color: var(--primary-color);
          font-size: 1rem;
          margin-top: 2px;
        }
        
        .hospital-beds {
          margin: 1rem 0;
        }
        
        .beds-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          text-align: center;
        }
        
        .bed-type {
          background-color: var(--bg-light);
          padding: 10px 5px;
          border-radius: var(--radius-sm);
        }
        
        .bed-count {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--primary-color);
        }
        
        .bed-label {
          font-size: 0.7rem;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .hospital-specialties {
          margin: 1rem 0;
        }
        
        .specialties-title {
          font-size: 0.9rem;
          color: var(--text-medium);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        
        .specialties-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        
        .specialty-tag {
          background-color: rgba(94, 13, 151, 0.1);
          color: var(--primary-dark);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
        }
        
        .hospital-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 1rem;
        }
        
        .book-button {
          padding: 10px 20px;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        
        .book-button:hover {
          background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .contact-buttons {
          display: flex;
          gap: 8px;
        }
        
        .contact-button {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.2s;
          color: white;
          font-size: 0.9rem;
        }
        
        .contact-button:hover {
          transform: scale(1.1);
        }
        
        .contact-button.phone {
          background-color: var(--primary-color);
        }
        
        .contact-button.emergency {
          background-color: #e63946;
  color: #c92a2a;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.no-results h3 {
  font-size: 1.25rem;
  margin-bottom: 10px;
  color: #495057;
}

/* Responsive Adjustments */
@media (min-width: 768px) {
  .search-filters-row {
    flex-direction: row;
  }
  
  .filter-button {
    width: auto;
  }
}

@media (max-width: 480px) {
  .hospitals-grid {
    grid-template-columns: 1fr;
  }
  
  .beds-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}`}
      </style>
    </div>
  );
};

const nearbyHospitals = [
  {
    id: 1,
    name: "City General Hospital",
    distance: "2.5 km",
    eta: "8 min",
    address: "123 Medical Drive, Downtown",
    beds: {
      general: 12,
      icu: 3,
      oxygen: 8,
      ventilator: 4,
    },
    contact: "+1 555-123-4567",
    emergencyContact: "+1 555-123-4568",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.5,
    reviews: 128,
    specialties: ["Cardiology", "Neurology", "Trauma", "Pediatrics"],
    doctors: 42,
    facilities: ["Pharmacy", "Lab", "Radiology", "Cafeteria", "Parking"],
    description:
      "A leading multi-specialty hospital with 24/7 emergency services and state-of-the-art facilities.",
    insuranceAccepted: ["Aetna", "Blue Cross", "Medicare", "UnitedHealth"],
    lastUpdated: "10 minutes ago",
  },
  {
    id: 2,
    name: "Metropolitan Medical Center",
    distance: "5.1 km",
    eta: "15 min",
    address: "456 Health Avenue, Midtown",
    beds: {
      general: 8,
      icu: 2,
      oxygen: 5,
      ventilator: 2,
    },
    contact: "+1 555-987-6543",
    emergencyContact: "+1 555-987-6544",
    coordinates: { lat: 12.9816, lng: 77.6046 },
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.2,
    reviews: 95,
    specialties: ["Pediatrics", "Oncology", "Orthopedics", "Dermatology"],
    doctors: 35,
    facilities: ["Pharmacy", "Lab", "ICU", "Ambulance"],
    description:
      "Specialized care center with award-winning pediatric and oncology departments.",
    insuranceAccepted: ["Blue Cross", "Cigna", "Medicaid"],
    lastUpdated: "25 minutes ago",
  },
  {
    id: 3,
    name: "Sunrise Specialty Hospital",
    distance: "7.3 km",
    eta: "20 min",
    address: "789 Care Boulevard, Uptown",
    beds: {
      general: 5,
      icu: 1,
      oxygen: 3,
      ventilator: 1,
    },
    contact: "+1 555-456-7890",
    emergencyContact: "+1 555-456-7891",
    coordinates: { lat: 12.9916, lng: 77.6146 },
    image:
      "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.0,
    reviews: 72,
    specialties: [
      "Psychiatry",
      "Rehabilitation",
      "Geriatrics",
      "Physical Therapy",
    ],
    doctors: 28,
    facilities: ["Pharmacy", "Therapy Rooms", "Garden", "Cafeteria"],
    description:
      "Specialized in mental health and rehabilitation services with a patient-centered approach.",
    insuranceAccepted: ["Aetna", "Medicare", "Humana"],
    lastUpdated: "1 hour ago",
  },
  {
    id: 4,
    name: "Golden State Medical",
    distance: "3.8 km",
    eta: "12 min",
    address: "321 Wellness Street, West District",
    beds: {
      general: 15,
      icu: 5,
      oxygen: 10,
      ventilator: 6,
    },
    contact: "+1 555-789-1234",
    emergencyContact: "+1 555-789-1235",
    coordinates: { lat: 12.9616, lng: 77.5846 },
    image:
      "https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.7,
    reviews: 215,
    specialties: [
      "Cardiac Surgery",
      "Neurosurgery",
      "Trauma",
      "Emergency Medicine",
    ],
    doctors: 58,
    facilities: [
      "Helipad",
      "Trauma Center",
      "Cath Lab",
      "Pharmacy",
      "Cafeteria",
    ],
    description:
      "Level 1 trauma center with advanced surgical capabilities and 24/7 emergency services.",
    insuranceAccepted: ["Aetna", "Blue Cross", "Cigna", "Medicare", "Medicaid"],
    lastUpdated: "5 minutes ago",
  },
  {
    id: 5,
    name: "Community Health Center",
    distance: "6.2 km",
    eta: "18 min",
    address: "654 Hope Lane, East District",
    beds: {
      general: 20,
      icu: 4,
      oxygen: 12,
      ventilator: 3,
    },
    contact: "+1 555-321-6547",
    emergencyContact: "+1 555-321-6548",
    coordinates: { lat: 12.9516, lng: 77.6246 },
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 3.9,
    reviews: 86,
    specialties: [
      "Family Medicine",
      "Pediatrics",
      "Women's Health",
      "Dentistry",
    ],
    doctors: 31,
    facilities: ["Pharmacy", "Dental Clinic", "Pediatric Ward", "Lab"],
    description:
      "Community-focused healthcare provider offering comprehensive primary care services.",
    insuranceAccepted: ["Medicaid", "Medicare", "Blue Cross"],
    lastUpdated: "45 minutes ago",
  },
];

export default Hospitals;
