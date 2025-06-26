import React, { useState, useEffect } from "react";
import MobileHospitalNav from "../../components/MobileHospitalNav";

import {
  FaPhone,
  FaMapMarkerAlt,
  FaAmbulance,
  FaBed,
  FaProcedures,
  FaShare,
  FaClock,
  FaStar,
  FaFilter,
  FaSort,
  FaSearch,
  FaUserMd,
  FaHeart,
  FaRegHeart,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaWhatsapp,
  FaEnvelope,
  FaCopy,
} from "react-icons/fa";
import { SiOxygen } from "react-icons/si";
import { IoMdClose } from "react-icons/io";
import { BsSpeedometer2 } from "react-icons/bs";
import { GiHospital } from "react-icons/gi";

const Hospitals = () => {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [sortBy, setSortBy] = useState("distance");
  const [filterBy, setFilterBy] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [expandedHospital, setExpandedHospital] = useState(null);
  const [copied, setCopied] = useState(false);

  // Mock data - in a real app, this would come from an API
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
      insuranceAccepted: [
        "Aetna",
        "Blue Cross",
        "Cigna",
        "Medicare",
        "Medicaid",
      ],
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

  // Toggle favorite status
  const toggleFavorite = (hospitalId) => {
    if (favorites.includes(hospitalId)) {
      setFavorites(favorites.filter((id) => id !== hospitalId));
    } else {
      setFavorites([...favorites, hospitalId]);
    }
  };

  // Filter hospitals based on search and filters
  const filteredHospitals = nearbyHospitals.filter((hospital) => {
    // Search filter
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.specialties.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Bed type filter
    const matchesBedFilter =
      filterBy === "all"
        ? true
        : filterBy === "icu"
        ? hospital.beds.icu > 0
        : filterBy === "oxygen"
        ? hospital.beds.oxygen > 0
        : filterBy === "ventilator"
        ? hospital.beds.ventilator > 0
        : true;

    return matchesSearch && matchesBedFilter;
  });

  // Sort hospitals
  const sortedHospitals = [...filteredHospitals].sort((a, b) => {
    if (sortBy === "distance") {
      return parseFloat(a.distance) - parseFloat(b.distance);
    } else if (sortBy === "availability") {
      return b.beds.general + b.beds.icu - (a.beds.general + a.beds.icu);
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const handleTransferPatient = (hospital) => {
    setSelectedHospital(hospital);
    setShowTransferModal(true);
  };

  const handleSharePatientInfo = (hospital) => {
    setSelectedHospital(hospital);
    setShowShareModal(true);
  };

  const handleShowDetails = (hospital) => {
    setSelectedHospital(hospital);
    setShowDetailsModal(true);
  };

  const handleBookBed = (hospital) => {
    setSelectedHospital(hospital);
    // In a real app, this would trigger a booking API call
    alert(`Bed booking request sent to ${hospital.name}`);
  };

  const openMaps = (lat, lng) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleExpandHospital = (hospitalId) => {
    if (expandedHospital === hospitalId) {
      setExpandedHospital(null);
    } else {
      setExpandedHospital(hospitalId);
    }
  };

  // Calculate availability percentage (for visual indicator)
  const calculateAvailability = (hospital) => {
    const totalBeds = hospital.beds.general + hospital.beds.icu;
    const availableBeds = Math.floor(Math.random() * totalBeds); // Mock availability
    return Math.min(100, Math.round((availableBeds / totalBeds) * 100));
  };

  return (
    <>
      <MobileHospitalNav />
      <div className="hospitals-container">
        <div className="hospitals-header">
          <div className="header-content">
            <div className="header-title">
              <GiHospital className="hospital-icon" />
              <h1>Hospital Finder</h1>
            </div>
            <p>Locate and transfer patients to nearby medical facilities</p>
          </div>
        </div>

        <div className="search-filter-container">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search hospitals by name, location or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="filter-controls">
            <div className="filter-dropdown">
              <label>
                <FaSort /> Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="distance">Distance</option>
                <option value="availability">Availability</option>
                <option value="rating">Rating</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            <div className="filter-dropdown">
              <label>
                <FaFilter /> Filter by:
              </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="all">All Facilities</option>
                <option value="icu">ICU Available</option>
                <option value="oxygen">Oxygen Available</option>
                <option value="ventilator">Ventilator Available</option>
              </select>
            </div>

            <button
              className={`advanced-filters ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              Advanced Filters{" "}
              {showFilters ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          {showFilters && (
            <div className="advanced-filters-panel">
              <div className="filter-section">
                <h3>Specialties</h3>
                <div className="filter-tags">
                  {[
                    "Cardiology",
                    "Neurology",
                    "Pediatrics",
                    "Oncology",
                    "Orthopedics",
                    "Trauma",
                    "Emergency",
                  ].map((specialty) => (
                    <button
                      key={specialty}
                      className={`tag ${
                        searchQuery.includes(specialty) ? "active" : ""
                      }`}
                      onClick={() => setSearchQuery(specialty)}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3>Facilities</h3>
                <div className="filter-tags">
                  {[
                    "Pharmacy",
                    "Lab",
                    "Radiology",
                    "Cafeteria",
                    "Parking",
                    "ICU",
                    "Helipad",
                  ].map((facility) => (
                    <button
                      key={facility}
                      className={`tag ${
                        searchQuery.includes(facility) ? "active" : ""
                      }`}
                      onClick={() => setSearchQuery(facility)}
                    >
                      {facility}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3>Insurance Accepted</h3>
                <div className="filter-tags">
                  {[
                    "Aetna",
                    "Blue Cross",
                    "Cigna",
                    "Medicare",
                    "Medicaid",
                    "UnitedHealth",
                  ].map((insurance) => (
                    <button
                      key={insurance}
                      className={`tag ${
                        searchQuery.includes(insurance) ? "active" : ""
                      }`}
                      onClick={() => setSearchQuery(insurance)}
                    >
                      {insurance}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="results-summary">
          <p>
            Showing <strong>{sortedHospitals.length}</strong>{" "}
            {sortedHospitals.length === 1 ? "hospital" : "hospitals"}
            {searchQuery && ` matching "${searchQuery}"`}
            {filterBy !== "all" && ` with ${filterBy} available`}
          </p>
        </div>

        <div className="hospital-listings">
          {sortedHospitals.length > 0 ? (
            sortedHospitals.map((hospital) => (
              <div key={hospital.id} className="hospital-card">
                <div className="hospital-card-header">
                  <div
                    className="hospital-image"
                    style={{ backgroundImage: `url(${hospital.image})` }}
                  >
                    <div className="hospital-rating">
                      <FaStar className="star-icon" />
                      <span>{hospital.rating}</span>
                      <span className="reviews">({hospital.reviews})</span>
                    </div>
                    <button
                      className="favorite-btn"
                      onClick={() => toggleFavorite(hospital.id)}
                    >
                      {favorites.includes(hospital.id) ? (
                        <FaHeart className="favorited" />
                      ) : (
                        <FaRegHeart />
                      )}
                    </button>
                  </div>

                  <div className="hospital-basic-info">
                    <h3>{hospital.name}</h3>
                    <div className="hospital-meta">
                      <span className="distance">
                        <BsSpeedometer2 /> {hospital.distance} away
                      </span>
                      <span className="eta">
                        <FaClock /> {hospital.eta} ETA
                      </span>
                    </div>
                    <div className="hospital-address">
                      <FaMapMarkerAlt /> {hospital.address}
                    </div>
                    <div className="last-updated">
                      Updated: {hospital.lastUpdated}
                    </div>
                  </div>
                </div>

                <div className="hospital-card-body">
                  <div className="specialties-container">
                    <h4>Specialties:</h4>
                    <div className="specialties-list">
                      {hospital.specialties.slice(0, 3).map((specialty) => (
                        <span key={specialty} className="specialty-badge">
                          {specialty}
                        </span>
                      ))}
                      {hospital.specialties.length > 3 && (
                        <span className="more-specialties">
                          +{hospital.specialties.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="beds-summary">
                    <div className="bed-type">
                      <FaBed />
                      <span>{hospital.beds.general} General</span>
                    </div>
                    <div className="bed-type">
                      <FaProcedures />
                      <span>{hospital.beds.icu} ICU</span>
                    </div>
                    <div className="bed-type">
                      <SiOxygen />
                      <span>{hospital.beds.oxygen} Oxygen</span>
                    </div>
                    {hospital.beds.ventilator > 0 && (
                      <div className="bed-type">
                        <FaUserMd />
                        <span>{hospital.beds.ventilator} Ventilator</span>
                      </div>
                    )}
                  </div>

                  {expandedHospital === hospital.id && (
                    <div className="expanded-details">
                      <div className="detail-row">
                        <h5>Facilities:</h5>
                        <div className="facilities-list">
                          {hospital.facilities.map((facility, index) => (
                            <span key={index} className="facility-badge">
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="detail-row">
                        <h5>Insurance Accepted:</h5>
                        <div className="insurance-list">
                          {hospital.insuranceAccepted.map(
                            (insurance, index) => (
                              <span key={index} className="insurance-badge">
                                {insurance}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <div className="detail-row">
                        <h5>Contact:</h5>
                        <div className="contact-info">
                          <span>
                            <FaPhone /> Main: {hospital.contact}
                          </span>
                          <span>
                            <FaPhone /> Emergency: {hospital.emergencyContact}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="hospital-actions">
                    <button
                      className="primary-btn"
                      onClick={() => handleBookBed(hospital)}
                    >
                      <FaBed /> Book Bed
                    </button>
                    <button
                      className="secondary-btn"
                      onClick={() => handleTransferPatient(hospital)}
                    >
                      <FaAmbulance /> Transfer
                    </button>
                    <button
                      className="tertiary-btn"
                      onClick={() => handleShowDetails(hospital)}
                    >
                      <FaInfoCircle /> Details
                    </button>
                    <button
                      className="expand-btn"
                      onClick={() => toggleExpandHospital(hospital.id)}
                    >
                      {expandedHospital === hospital.id ? (
                        <>
                          <FaChevronUp /> Show Less
                        </>
                      ) : (
                        <>
                          <FaChevronDown /> Show More
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
                alt="No results"
              />
              <h3>No hospitals found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterBy("all");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Transfer Patient Modal */}
        {showTransferModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="modal-close"
                onClick={() => setShowTransferModal(false)}
              >
                <IoMdClose />
              </button>
              <div className="modal-header">
                <h3>
                  <FaAmbulance /> Transfer Patient
                </h3>
                <p className="modal-subtitle">
                  Transferring to {selectedHospital?.name}
                </p>
              </div>

              <div className="form-section">
                <h4>Patient Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="Patient's full name"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      placeholder="Patient's age"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Gender</label>
                    <select className="form-select">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Blood Type</label>
                    <select className="form-select">
                      <option value="">Unknown</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Medical Information</h4>
                <div className="form-group">
                  <label>Primary Condition</label>
                  <input
                    type="text"
                    placeholder="Diagnosis or symptoms"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Current Medications</label>
                  <textarea
                    placeholder="List current medications"
                    className="form-textarea"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Known Allergies</label>
                  <textarea
                    placeholder="List any known allergies"
                    className="form-textarea"
                  ></textarea>
                </div>
              </div>

              <div className="form-section">
                <h4>Transfer Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Priority Level</label>
                    <select className="form-select">
                      <option value="critical">Critical (Immediate)</option>
                      <option value="high">High (Within 1 hour)</option>
                      <option value="medium">Medium (Within 4 hours)</option>
                      <option value="low">Low (When available)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Required Bed Type</label>
                    <select className="form-select">
                      <option value="general">General</option>
                      <option value="icu">ICU</option>
                      <option value="oxygen">Oxygen</option>
                      <option value="ventilator">Ventilator</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea
                    placeholder="Any special requirements or notes"
                    className="form-textarea"
                  ></textarea>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowTransferModal(false)}
                >
                  Cancel
                </button>
                <button className="confirm-btn">
                  <FaAmbulance /> Initiate Transfer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Patient Info Modal */}
        {showShareModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="modal-close"
                onClick={() => setShowShareModal(false)}
              >
                <IoMdClose />
              </button>
              <div className="modal-header">
                <h3>
                  <FaShare /> Share Patient Information
                </h3>
                <p className="modal-subtitle">
                  With {selectedHospital?.name} medical team
                </p>
              </div>

              <div className="share-methods">
                <h4>Share Via:</h4>
                <div className="share-buttons">
                  <button className="share-method whatsapp">
                    <FaWhatsapp /> WhatsApp
                  </button>
                  <button className="share-method email">
                    <FaEnvelope /> Email
                  </button>
                  <button
                    className="share-method copy"
                    onClick={() => copyToClipboard(selectedHospital?.contact)}
                  >
                    <FaCopy /> {copied ? "Copied!" : "Copy Contact"}
                  </button>
                </div>
              </div>

              <div className="form-section">
                <h4>Select Information to Share</h4>
                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    Patient Demographics
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    Medical History
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    Current Condition
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    Vital Signs
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    Lab Results
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    Imaging Reports
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Additional Notes for Receiving Team</label>
                <textarea
                  placeholder="Add any urgent information or special instructions"
                  className="form-textarea"
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowShareModal(false)}
                >
                  Cancel
                </button>
                <button className="confirm-btn">
                  <FaShare /> Share Information
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hospital Details Modal */}
        {showDetailsModal && (
          <div className="modal-overlay">
            <div className="modal-content large">
              <button
                className="modal-close"
                onClick={() => setShowDetailsModal(false)}
              >
                <IoMdClose />
              </button>
              <div className="modal-header">
                <h3>{selectedHospital?.name}</h3>
                <div className="hospital-meta">
                  <span className="distance">
                    <BsSpeedometer2 /> {selectedHospital?.distance} away
                  </span>
                  <span className="eta">
                    <FaClock /> {selectedHospital?.eta} ETA
                  </span>
                  <span className="rating">
                    <FaStar /> {selectedHospital?.rating} (
                    {selectedHospital?.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="modal-body">
                <div className="details-column">
                  <div className="details-section">
                    <h4>Overview</h4>
                    <p>{selectedHospital?.description}</p>
                  </div>

                  <div className="details-section">
                    <h4>Facilities</h4>
                    <div className="facilities-grid">
                      {selectedHospital?.facilities.map((facility, index) => (
                        <div key={index} className="facility-item">
                          <div className="facility-icon">
                            {facility === "Pharmacy" && "💊"}
                            {facility === "Lab" && "🧪"}
                            {facility === "Radiology" && "📷"}
                            {facility === "ICU" && "🏥"}
                            {facility === "Cafeteria" && "🍽️"}
                            {facility === "Parking" && "🅿️"}
                            {facility === "Helipad" && "🚁"}
                            {facility === "Therapy Rooms" && "🧘"}
                          </div>
                          <span>{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="details-section">
                    <h4>Bed Availability</h4>
                    <div className="beds-grid">
                      <div className="bed-type">
                        <FaBed />
                        <div>
                          <strong>{selectedHospital?.beds.general}</strong>
                          <span>General Beds</span>
                        </div>
                      </div>
                      <div className="bed-type">
                        <FaProcedures />
                        <div>
                          <strong>{selectedHospital?.beds.icu}</strong>
                          <span>ICU Beds</span>
                        </div>
                      </div>
                      <div className="bed-type">
                        <SiOxygen />
                        <div>
                          <strong>{selectedHospital?.beds.oxygen}</strong>
                          <span>Oxygen Beds</span>
                        </div>
                      </div>
                      <div className="bed-type">
                        <FaUserMd />
                        <div>
                          <strong>{selectedHospital?.beds.ventilator}</strong>
                          <span>Ventilators</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="details-column">
                  <div className="details-section">
                    <h4>Specialties</h4>
                    <div className="specialties-grid">
                      {selectedHospital?.specialties.map((specialty, index) => (
                        <div key={index} className="specialty-item">
                          {specialty}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="details-section">
                    <h4>Insurance Accepted</h4>
                    <div className="insurance-grid">
                      {selectedHospital?.insuranceAccepted.map(
                        (insurance, index) => (
                          <div key={index} className="insurance-item">
                            {insurance}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="details-section">
                    <h4>Contact Information</h4>
                    <div className="contact-info">
                      <div className="contact-item">
                        <FaPhone />
                        <div>
                          <span>Main Number</span>
                          <strong>{selectedHospital?.contact}</strong>
                        </div>
                      </div>
                      <div className="contact-item">
                        <FaPhone />
                        <div>
                          <span>Emergency</span>
                          <strong>{selectedHospital?.emergencyContact}</strong>
                        </div>
                      </div>
                      <div className="contact-item">
                        <FaMapMarkerAlt />
                        <div>
                          <span>Address</span>
                          <strong>{selectedHospital?.address}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="secondary-btn"
                  onClick={() =>
                    openMaps(
                      selectedHospital?.coordinates.lat,
                      selectedHospital?.coordinates.lng
                    )
                  }
                >
                  <FaMapMarkerAlt /> Get Directions
                </button>
                <button
                  className="primary-btn"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleTransferPatient(selectedHospital);
                  }}
                >
                  <FaAmbulance /> Transfer Patient
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          /* Base Styles */
          :root {
            --primary-color: #2563eb;
            --primary-light: #dbeafe;
            --primary-dark: #1e40af;
            --secondary-color: #10b981;
            --danger-color: #dc2626;
            --warning-color: #f59e0b;
            --info-color: #3b82f6;
            --dark-color: #1e293b;
            --light-color: #f8fafc;
            --gray-color: #64748b;
            --light-gray: #e2e8f0;
            --border-color: #e2e8f0;
            --border-radius: 12px;
            --border-radius-sm: 8px;
            --border-radius-xs: 4px;
            --box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --box-shadow-md: 0 6px 12px -2px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --box-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --transition: all 0.2s ease-in-out;
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
            line-height: 1.5;
            color: var(--dark-color);
            background-color: var(--light-color);
          }

          /* Hospitals Container */
          .hospitals-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px;
          }

          .hospitals-header {
            margin-bottom: 32px;
          }

          .header-title {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
          }

          .hospital-icon {
            font-size: 32px;
            color: var(--primary-color);
          }

          .header-content h1 {
            font-size: 32px;
            font-weight: 800;
            color: var(--dark-color);
            margin-bottom: 8px;
            line-height: 1.2;
          }

          .header-content p {
            color: var(--gray-color);
            font-size: 16px;
            max-width: 600px;
          }

          /* Search and Filters */
          .search-filter-container {
            margin-bottom: 32px;
            background: white;
            border-radius: var(--border-radius);
            padding: 16px;
            box-shadow: var(--box-shadow);
          }

          .search-bar {
            position: relative;
            margin-bottom: 16px;
          }

          .search-bar input {
            width: 100%;
            padding: 12px 16px 12px 40px;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-sm);
            font-size: 15px;
            transition: var(--transition);
          }

          .search-bar input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px var(--primary-light);
          }

          .search-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray-color);
          }

          .clear-search {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--gray-color);
            cursor: pointer;
            padding: 4px;
            border-radius: 50%;
            transition: var(--transition);
          }

          .clear-search:hover {
            color: var(--dark-color);
            background: var(--light-gray);
          }

          .filter-controls {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
          }

          .filter-dropdown {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .filter-dropdown label {
            font-size: 14px;
            font-weight: 500;
            color: var(--dark-color);
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .filter-dropdown select {
            padding: 8px 12px;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-sm);
            font-size: 14px;
            background: white;
            cursor: pointer;
            transition: var(--transition);
          }

          .filter-dropdown select:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px var(--primary-light);
          }

          .advanced-filters {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: white;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-sm);
            color: var(--dark-color);
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            margin-left: auto;
          }

          .advanced-filters:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
          }

          .advanced-filters.active {
            background: var(--primary-light);
            border-color: var(--primary-color);
            color: var(--primary-color);
          }

          .advanced-filters-panel {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid var(--border-color);
          }

          .filter-section {
            margin-bottom: 16px;
          }

          .filter-section h3 {
            font-size: 15px;
            font-weight: 600;
            color: var(--dark-color);
            margin-bottom: 12px;
          }

          .filter-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .tag {
            padding: 6px 12px;
            background: var(--light-gray);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
          }

          .tag:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
          }

          .tag.active {
            background: var(--primary-light);
            border-color: var(--primary-color);
            color: var(--primary-color);
          }

          /* Results Summary */
          .results-summary {
            margin-bottom: 16px;
            color: var(--gray-color);
            font-size: 14px;
          }

          /* Hospital Listings */
          .hospital-listings {
            display: grid;
            gap: 20px;
          }

          .no-results {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            text-align: center;
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
          }

          .no-results img {
            width: 120px;
            height: 120px;
            margin-bottom: 20px;
            opacity: 0.7;
          }

          .no-results h3 {
            font-size: 20px;
            color: var(--dark-color);
            margin-bottom: 8px;
          }

          .no-results p {
            color: var(--gray-color);
            margin-bottom: 20px;
            max-width: 400px;
          }

          .no-results button {
            padding: 10px 24px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: var(--border-radius-sm);
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
          }

          .no-results button:hover {
            background: var(--primary-dark);
          }

          /* Hospital Card */
          .hospital-card {
            background: white;
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: var(--box-shadow);
            transition: var(--transition);
          }

          .hospital-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--box-shadow-lg);
          }

          .hospital-card-header {
            display: flex;
            gap: 16px;
            padding: 16px;
            border-bottom: 1px solid var(--border-color);
          }

          .hospital-image {
            flex: 0 0 120px;
            height: 120px;
            background-size: cover;
            background-position: center;
            border-radius: var(--border-radius-sm);
            position: relative;
            overflow: hidden;
          }

          .hospital-rating {
            position: absolute;
            top: 8px;
            left: 8px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 4px 8px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            font-weight: 600;
            backdrop-filter: blur(2px);
          }

          .star-icon {
            color: #ffc107;
            font-size: 12px;
          }

          .reviews {
            font-size: 11px;
            opacity: 0.8;
          }

          .favorite-btn {
            position: absolute;
            bottom: 8px;
            right: 8px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: var(--transition);
            backdrop-filter: blur(2px);
          }

          .favorite-btn:hover {
            background: rgba(0, 0, 0, 0.7);
          }

          .favorited {
            color: #ef4444;
          }

          .hospital-basic-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .hospital-basic-info h3 {
            font-size: 18px;
            font-weight: 700;
            color: var(--dark-color);
            margin: 0;
          }

          .hospital-meta {
            display: flex;
            gap: 12px;
            font-size: 13px;
            color: var(--gray-color);
          }

          .hospital-meta svg {
            margin-right: 4px;
            color: var(--primary-color);
            font-size: 12px;
          }

          .hospital-address {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            color: var(--gray-color);
            margin-top: 4px;
          }

          .hospital-address svg {
            color: var(--primary-color);
            font-size: 12px;
          }

          .last-updated {
            font-size: 12px;
            color: var(--gray-color);
            margin-top: auto;
            font-style: italic;
          }

          .hospital-card-body {
            padding: 16px;
          }

          .availability-indicator {
            height: 24px;
            background: var(--light-gray);
            border-radius: 20px;
            margin-bottom: 16px;
            position: relative;
            overflow: hidden;
          }

          .availability-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: linear-gradient(90deg, #10b981, #34d399);
            border-radius: 20px;
          }

          .availability-indicator span {
            position: absolute;
            top: 50%;
            left: 12px;
            transform: translateY(-50%);
            font-size: 12px;
            font-weight: 600;
            color: white;
            z-index: 1;
          }

          .specialties-container {
            margin-bottom: 16px;
          }

          .specialties-container h4 {
            font-size: 14px;
            font-weight: 600;
            color: var(--dark-color);
            margin-bottom: 8px;
          }

          .specialties-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .specialty-badge {
            background: var(--primary-light);
            color: var(--primary-color);
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }

          .more-specialties {
            color: var(--gray-color);
            font-size: 12px;
            align-self: center;
          }

          .beds-summary {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 12px;
            margin-bottom: 16px;
          }

          .bed-type {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: var(--dark-color);
          }

          .bed-type svg {
            color: var(--primary-color);
          }

          .expanded-details {
            padding: 16px;
            background: var(--light-gray);
            border-radius: var(--border-radius-sm);
            margin-bottom: 16px;
          }

          .detail-row {
            margin-bottom: 12px;
          }

          .detail-row:last-child {
            margin-bottom: 0;
          }

          .detail-row h5 {
            font-size: 14px;
            font-weight: 600;
            color: var(--dark-color);
            margin-bottom: 8px;
          }

          .facilities-list,
          .insurance-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .facility-badge,
          .insurance-badge {
            background: white;
            padding: 4px 10px;
            border-radius: var(--border-radius-xs);
            font-size: 12px;
            box-shadow: var(--box-shadow);
          }

          .contact-info {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .contact-info span {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
          }

          .contact-info svg {
            color: var(--primary-color);
          }

          .hospital-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }

          .primary-btn,
          .secondary-btn,
          .tertiary-btn,
          .expand-btn {
            padding: 8px 16px;
            border: none;
            border-radius: var(--border-radius-sm);
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
          }

          .primary-btn {
            background: var(--primary-color);
            color: white;
          }

          .primary-btn:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
          }

          .secondary-btn {
            background: white;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
          }

          .secondary-btn:hover {
            background: var(--primary-light);
            transform: translateY(-2px);
          }

          .tertiary-btn {
            background: white;
            color: var(--gray-color);
            border: 1px solid var(--border-color);
          }

          .tertiary-btn:hover {
            background: var(--light-gray);
            transform: translateY(-2px);
          }

          .expand-btn {
            background: none;
            color: var(--primary-color);
            margin-left: auto;
          }

          .expand-btn:hover {
            text-decoration: underline;
          }

          /* Modals */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
            padding: 20px;
          }

          .modal-content {
            background: white;
            border-radius: var(--border-radius);
            padding: 24px;
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: var(--box-shadow-lg);
            position: relative;
          }

          .modal-content.large {
            max-width: 800px;
          }

          .modal-close {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            font-size: 24px;
            color: var(--gray-color);
            cursor: pointer;
            transition: var(--transition);
            padding: 4px;
            border-radius: 4px;
          }

          .modal-close:hover {
            color: var(--dark-color);
            background: var(--light-gray);
          }

          .modal-header {
            margin-bottom: 24px;
          }

          .modal-header h3 {
            font-size: 24px;
            font-weight: 700;
            color: var(--dark-color);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .modal-header h3 svg {
            color: var(--primary-color);
          }

          .modal-subtitle {
            color: var(--gray-color);
            font-size: 15px;
          }

          .modal-body {
            display: flex;
            gap: 24px;
          }

          .details-column {
            flex: 1;
          }

          .details-section {
            margin-bottom: 24px;
          }

          .details-section h4 {
            font-size: 18px;
            font-weight: 600;
            color: var(--dark-color);
            margin-bottom: 12px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 8px;
          }

          .details-section p {
            color: var(--gray-color);
            line-height: 1.6;
          }

          .facilities-grid,
          .specialties-grid,
          .insurance-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 12px;
          }

          .facility-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 12px;
            background: var(--light-gray);
            border-radius: var(--border-radius-sm);
            text-align: center;
          }

          .facility-icon {
            font-size: 24px;
          }

          .specialty-item,
          .insurance-item {
            padding: 8px 12px;
            background: var(--primary-light);
            color: var(--primary-color);
            border-radius: var(--border-radius-sm);
            font-size: 13px;
            text-align: center;
          }

          .insurance-item {
            background: #d1fae5;
            color: #065f46;
          }

          .beds-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .bed-type {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: white;
            border-radius: var(--border-radius-sm);
            box-shadow: var(--box-shadow);
          }

          .bed-type svg {
            font-size: 20px;
            color: var(--primary-color);
          }

          .bed-type div {
            display: flex;
            flex-direction: column;
          }

          .bed-type strong {
            font-size: 18px;
            font-weight: 700;
          }

          .bed-type span {
            font-size: 13px;
            color: var(--gray-color);
          }

          .contact-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: white;
            border-radius: var(--border-radius-sm);
            box-shadow: var(--box-shadow);
            margin-bottom: 12px;
          }

          .contact-item:last-child {
            margin-bottom: 0;
          }

          .contact-item svg {
            font-size: 20px;
            color: var(--primary-color);
          }

          .contact-item div {
            display: flex;
            flex-direction: column;
          }

          .contact-item span {
            font-size: 12px;
            color: var(--gray-color);
          }

          .contact-item strong {
            font-size: 15px;
            font-weight: 600;
          }

          /* Form Styles */
          .form-section {
            margin-bottom: 24px;
          }

          .form-section h4 {
            font-size: 18px;
            font-weight: 600;
            color: var(--dark-color);
            margin-bottom: 16px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 8px;
          }

          .form-row {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
          }

          .form-row .form-group {
            flex: 1;
            margin-bottom: 0;
          }

          .form-group {
            margin-bottom: 16px;
          }

          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--dark-color);
            font-size: 14px;
          }

          .form-input,
          .form-select,
          .form-textarea {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-sm);
            font-size: 15px;
            transition: var(--transition);
            background: white;
          }

          .form-input:focus,
          .form-select:focus,
          .form-textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px var(--primary-light);
          }

          .form-textarea {
            min-height: 100px;
            resize: vertical;
          }

          /* Share Methods */
          .share-methods {
            margin-bottom: 24px;
          }

          .share-methods h4 {
            font-size: 15px;
            font-weight: 600;
            color: var(--dark-color);
            margin-bottom: 12px;
          }

          .share-buttons {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }

          .share-method {
            padding: 10px 16px;
            border: none;
            border-radius: var(--border-radius-sm);
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
          }

          .share-method.whatsapp {
            background: #25d366;
            color: white;
          }

          .share-method.email {
            background: var(--gray-color);
            color: white;
          }

          .share-method.copy {
            background: var(--primary-color);
            color: white;
          }

          /* Checkbox Group */
          .checkbox-group {
            display: grid;
            gap: 16px;
            margin-bottom: 24px;
          }

          .checkbox-item {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            position: relative;
            font-size: 15px;
          }

          .checkbox-input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
          }

          .checkbox-custom {
            position: relative;
            height: 18px;
            width: 18px;
            background-color: white;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            transition: var(--transition);
          }

          .checkbox-input:checked ~ .checkbox-custom {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
          }

          .checkbox-custom:after {
            content: "";
            position: absolute;
            display: none;
            left: 6px;
            top: 2px;
            width: 4px;
            height: 9px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }

          .checkbox-input:checked ~ .checkbox-custom:after {
            display: block;
          }

          /* Modal Actions */
          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 32px;
          }

          .cancel-btn,
          .confirm-btn {
            padding: 10px 20px;
            border: none;
            border-radius: var(--border-radius-sm);
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 15px;
          }

          .cancel-btn {
            background-color: var(--light-color);
            color: var(--dark-color);
            border: 1px solid var(--border-color);
          }

          .cancel-btn:hover {
            background-color: var(--light-gray);
          }

          .confirm-btn {
            background-color: var(--primary-color);
            color: white;
          }

          .confirm-btn:hover {
            background-color: var(--primary-dark);
            transform: translateY(-2px);
          }

          /* Responsive Styles */
          @media (max-width: 1024px) {
            .modal-body {
              flex-direction: column;
            }
          }

          @media (max-width: 768px) {
            .hospital-card-header {
              flex-direction: column;
            }

            .hospital-image {
              width: 100%;
              height: 180px;
            }

            .filter-controls {
              flex-direction: column;
            }

            .advanced-filters {
              margin-left: 0;
            }

            .form-row {
              flex-direction: column;
              gap: 16px;
            }
          }

          @media (max-width: 480px) {
            .hospitals-container {
              padding: 16px;
            }

            .header-content h1 {
              font-size: 24px;
            }

            .hospital-actions {
              flex-direction: column;
            }

            .expand-btn {
              margin-left: 0;
              justify-content: center;
            }

            .modal-actions {
              flex-direction: column;
            }

            .cancel-btn,
            .confirm-btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Hospitals;
