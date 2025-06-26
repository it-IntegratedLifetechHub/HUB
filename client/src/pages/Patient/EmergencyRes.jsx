import React, { useState, useEffect, useRef } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const EmergencyRes = () => {
  // Form state
  const [emergencyType, setEmergencyType] = useState("");
  const [situation, setSituation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Location state
  const [locationStatus, setLocationStatus] = useState({
    loading: true,
    message: "Determining your location...",
    error: null,
  });
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState("");
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState("");

  // Map state
  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapAccuracy, setMapAccuracy] = useState(null);
  const autocompleteRef = useRef(null);
  const geocoderRef = useRef(null);

  // UI state
  const [activeStep, setActiveStep] = useState(1);
  const [animation, setAnimation] = useState("fadeIn");

  // Configuration
  const libraries = ["places", "geometry"];
  const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "12px",
    marginTop: "1rem",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.05)",
  };

  // Initialize geolocation
  useEffect(() => {
    if (!useCustomLocation) {
      fetchCurrentLocation();
    } else {
      if (!coordinates) {
        setMapCenter({ lat: 28.6139, lng: 77.209 });
      }
    }
  }, [useCustomLocation]);
  const fetchCurrentLocation = () => {
    setLocationStatus({
      loading: true,
      message: "Determining your precise location...",
      error: null,
    });

    if (!navigator.geolocation) {
      setLocationStatus({
        loading: false,
        message: "Geolocation is not supported by your browser",
        error: "BROWSER_UNSUPPORTED",
      });
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000, // extended timeout for GPS lock
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        console.log("📍 Coordinates:", latitude, longitude);
        console.log("📏 Accuracy:", accuracy, "meters");

        if (accuracy > 100) {
          console.warn(
            "⚠️ Location accuracy is low. Consider refining manually."
          );
        }

        setMapAccuracy(accuracy);
        await updateLocation({ lat: latitude, lng: longitude });

        setLocationStatus({
          loading: false,
          message: `Precise location determined (~${Math.round(
            accuracy
          )}m accuracy)`,
          error: null,
        });
      },
      (error) => {
        let errorMessage = "Unable to determine your location";
        let errorType = "UNKNOWN_ERROR";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied";
            errorType = "PERMISSION_DENIED";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            errorType = "POSITION_UNAVAILABLE";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get location timed out";
            errorType = "TIMEOUT";
            break;
        }

        console.error("❌ Geolocation error:", error.message);

        setLocationStatus({
          loading: false,
          message: errorMessage,
          error: errorType,
        });

        // Use IP fallback only if GPS was denied or timed out
        if (errorType === "PERMISSION_DENIED" || errorType === "TIMEOUT") {
          fetchIPBasedLocation();
        }
      },
      options
    );
  };

  const fetchIPBasedLocation = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      if (data.latitude && data.longitude) {
        const fallbackCoords = { lat: data.latitude, lng: data.longitude };

        console.warn("🌐 Using IP-based fallback location:", fallbackCoords);

        setMapAccuracy(50000); // typically less accurate
        await updateLocation(fallbackCoords);

        setLocationStatus({
          loading: false,
          message: "Approximate location determined via IP",
          error: "LOW_ACCURACY",
        });
      } else {
        throw new Error("Invalid IP data");
      }
    } catch (err) {
      console.error("❌ IP fallback failed:", err.message);
      setLocationStatus({
        loading: false,
        message: "Could not determine location via IP",
        error: "IP_LOCATION_FAILED",
      });
    }
  };

  const updateLocation = async (newCoords) => {
    setCoordinates(newCoords);
    setMapCenter(newCoords);
    setMarkerPosition(newCoords);

    try {
      if (!geocoderRef.current && window.google) {
        geocoderRef.current = new window.google.maps.Geocoder();
      }

      if (geocoderRef.current) {
        const response = await geocoderRef.current.geocode({
          location: newCoords,
        });

        if (response.results && response.results.length > 0) {
          const addressComponents = response.results[0].address_components;
          let street = "";
          let city = "";

          for (const component of addressComponents) {
            if (component.types.includes("route")) {
              street = component.long_name;
            }
            if (component.types.includes("locality")) {
              city = component.long_name;
            }
          }

          const shortAddress = street
            ? `${street}, ${city}`
            : response.results[0].formatted_address;
          setAddress(shortAddress);
        } else {
          setAddress("Selected location");
        }
      } else {
        setAddress("Selected location");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setAddress("Selected location");
    }
  };

  const handleMapLoad = (map) => {
    setMap(map);

    if (useCustomLocation && window.google) {
      const input = document.getElementById("custom-location-input");
      if (input) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          input,
          {
            fields: ["geometry", "address_components", "formatted_address"],
            types: ["geocode"],
          }
        );

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          if (place.geometry) {
            const newCoords = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            updateLocation(newCoords);
          }
        });
      }

      if (!geocoderRef.current) {
        geocoderRef.current = new window.google.maps.Geocoder();
      }
    }
  };

  const handleMapClick = (e) => {
    if (useCustomLocation) {
      updateLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const handleMarkerDragEnd = (e) => {
    if (useCustomLocation) {
      updateLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emergencyType) {
      alert("Please select the type of emergency assistance needed");
      return;
    }

    if (!situation || situation.length < 10) {
      alert(
        "Please provide a brief description of the emergency (at least 10 characters)"
      );
      return;
    }

    if (!coordinates) {
      alert("Please ensure your location is properly set");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (error) {
      alert("There was an error submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setAnimation("fadeOut");
    setTimeout(() => {
      setActiveStep(activeStep + 1);
      setAnimation("fadeIn");
    }, 300);
  };

  const prevStep = () => {
    setAnimation("fadeOut");
    setTimeout(() => {
      setActiveStep(activeStep - 1);
      setAnimation("fadeIn");
    }, 300);
  };
  if (success) {
    return (
      <div
        className="success-container"
        role="dialog"
        aria-labelledby="success-title"
      >
        <div className="success-card">
          <div className="success-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
              />
            </svg>
          </div>

          <h2 id="success-title">Emergency Request Submitted Successfully!</h2>
          <p className="success-text">
            Help is being dispatched to the following location:
          </p>

          <div className="success-details">
            <div className="detail-item">
              <span className="detail-label">Emergency Type:</span>
              <span className="detail-value">
                {emergencyType === "hospital"
                  ? "Mobile Hospital & Doctor"
                  : "Emergency Medical Doctor"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Situation:</span>
              <span className="detail-value">{situation}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Location:</span>
              <span className="detail-value">
                {address || "Your current location"}
              </span>
            </div>
            {additionalDetails && (
              <div className="detail-item">
                <span className="detail-label">Additional Notes:</span>
                <span className="detail-value">{additionalDetails}</span>
              </div>
            )}
            {mapAccuracy && mapAccuracy > 1000 && (
              <div className="accuracy-warning" aria-live="polite">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"
                  />
                </svg>
                <span>
                  Location accuracy: ±{Math.round(mapAccuracy)} meters
                </span>
              </div>
            )}
          </div>

          {coordinates && (
            <div className="map-links">
              <a
                href={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
                aria-label="View location on Google Maps"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0,9.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5,1.12 2.5,2.5-1.12,2.5-2.5,2.5z"
                  />
                </svg>
                Open in Google Maps
              </a>
            </div>
          )}

          <div className="success-actions">
            <button onClick={() => setSuccess(false)} className="success-btn">
              Submit Another Emergency
            </button>
            <button
              onClick={() =>
                alert(
                  "Emergency services have been notified. Keep your phone accessible."
                )
              }
              className="emergency-call-btn"
            >
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"
                />
              </svg>
              Call Emergency Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div className="emergency-app">
        <div className="emergency-card">
          <div className="header">
            <div className="logo">
              <span>Emergency Response</span>
            </div>
            <p className="subtitle">
              Get immediate medical assistance when you need it most
            </p>

            <div className="progress-steps">
              <div className={`step ${activeStep >= 1 ? "active" : ""}`}>
                <div className="step-number">1</div>
                <div className="step-label">Emergency Type</div>
              </div>
              <div className="step-connector"></div>
              <div className={`step ${activeStep >= 2 ? "active" : ""}`}>
                <div className="step-number">2</div>
                <div className="step-label">Details</div>
              </div>
              <div className="step-connector"></div>
              <div className={`step ${activeStep >= 3 ? "active" : ""}`}>
                <div className="step-number">3</div>
                <div className="step-label">Location</div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`form-container ${animation}`}
          >
            {activeStep === 1 && (
              <div className="form-section">
                <h3>What type of emergency assistance do you need?</h3>
                <div className="option-cards">
                  <div
                    className={`option-card ${
                      emergencyType === "hospital" ? "selected" : ""
                    }`}
                    onClick={() => setEmergencyType("hospital")}
                  >
                    <div className="option-icon">
                      <svg viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M19,19V8H5V19H19M16,1H18V3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1M11,9H13V13H16V15H13V19H11V15H8V13H11V9Z"
                        />
                      </svg>
                    </div>
                    <div className="option-content">
                      <h4>Mobile Hospital & Emergency Team</h4>
                      <p>
                        For critical emergencies requiring full medical support
                        and equipment
                      </p>
                      <ul className="emergency-list">
                        <li>Severe trauma or accidents</li>
                        <li>Heart attacks or strokes</li>
                        <li>Difficulty breathing</li>
                      </ul>
                    </div>
                    <div className="option-badge">Critical Care</div>
                  </div>
                  <div
                    className={`option-card ${
                      emergencyType === "doctor" ? "selected" : ""
                    }`}
                    onClick={() => setEmergencyType("doctor")}
                  >
                    <div className="option-icon">
                      <svg viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M16,10V13H13V16H11V13H8V10H11V7H13V10H16Z"
                        />
                      </svg>
                    </div>
                    <div className="option-content">
                      <h4>Emergency Medical Doctor</h4>
                      <p>For urgent but non-life-threatening medical needs</p>
                      <ul className="emergency-list">
                        <li>High fever or severe pain</li>
                        <li>Allergic reactions</li>
                        <li>Minor injuries requiring attention</li>
                      </ul>
                    </div>
                    <div className="option-badge">Urgent Care</div>
                  </div>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="next-btn"
                    onClick={nextStep}
                    disabled={!emergencyType}
                  >
                    Next: Emergency Details
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="form-section">
                <h3>Tell us about the emergency situation</h3>
                <div className="input-group">
                  <label>Brief description of the emergency</label>
                  <textarea
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    maxLength={200}
                    placeholder="Describe the situation, symptoms, and any critical details (e.g., '65yo male with chest pain and shortness of breath')"
                    required
                  />
                  <div className="char-count">{situation.length}/200</div>
                </div>

                <div className="form-actions">
                  <button type="button" className="back-btn" onClick={prevStep}>
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
                      />
                    </svg>
                    Back
                  </button>
                  <button
                    type="button"
                    className="next-btn"
                    onClick={nextStep}
                    disabled={!situation || situation.length < 10}
                  >
                    Next: Location Details
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="form-section">
                <h3>Where is the emergency located?</h3>
                <div className="location-toggle">
                  <button
                    type="button"
                    className={`toggle-btn ${
                      !useCustomLocation ? "active" : ""
                    }`}
                    onClick={() => setUseCustomLocation(false)}
                    disabled={locationStatus.error === "PERMISSION_DENIED"}
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"
                      />
                    </svg>
                    Current Location
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${
                      useCustomLocation ? "active" : ""
                    }`}
                    onClick={() => setUseCustomLocation(true)}
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"
                      />
                    </svg>
                    Custom Location
                  </button>
                </div>

                {useCustomLocation ? (
                  <div className="location-search">
                    <input
                      id="custom-location-input"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Search for address or landmark"
                      required
                    />
                    <svg className="search-icon" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="current-location-display">
                    <div className="location-info">
                      <svg className="location-icon" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"
                        />
                      </svg>
                      <div>
                        <p className="location-address">
                          {address || locationStatus.message}
                        </p>
                        {locationStatus.error === "PERMISSION_DENIED" && (
                          <p className="error-text">
                            Please enable location permissions or switch to
                            custom location
                          </p>
                        )}
                        {mapAccuracy && (
                          <p className="accuracy-text">
                            <svg viewBox="0 0 24 24" width="14" height="14">
                              <path
                                fill="currentColor"
                                d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"
                              />
                            </svg>
                            Accuracy: ~{Math.round(mapAccuracy)} meters
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="refresh-btn"
                      onClick={fetchCurrentLocation}
                      disabled={locationStatus.loading}
                    >
                      {locationStatus.loading ? (
                        <span className="small-spinner"></span>
                      ) : (
                        <svg className="refresh-icon" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"
                          />
                        </svg>
                      )}
                      Refresh
                    </button>
                  </div>
                )}

                <div className="map-wrapper">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={15}
                    onClick={handleMapClick}
                    onLoad={handleMapLoad}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                      styles: [
                        {
                          featureType: "poi",
                          elementType: "labels",
                          stylers: [{ visibility: "off" }],
                        },
                        {
                          featureType: "transit",
                          elementType: "labels",
                          stylers: [{ visibility: "off" }],
                        },
                      ],
                    }}
                  >
                    {markerPosition && (
                      <Marker
                        position={markerPosition}
                        draggable={useCustomLocation}
                        onDragEnd={handleMarkerDragEnd}
                        icon={{
                          url: useCustomLocation
                            ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                            : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                          scaledSize: new window.google.maps.Size(32, 32),
                        }}
                      />
                    )}
                    {mapAccuracy && !useCustomLocation && (
                      <Marker
                        position={markerPosition}
                        icon={{
                          path: window.google.maps.SymbolPath.CIRCLE,
                          scale: mapAccuracy / 20,
                          fillColor: "#4285F4",
                          fillOpacity: 0.2,
                          strokeColor: "#4285F4",
                          strokeOpacity: 0.4,
                          strokeWeight: 1,
                        }}
                      />
                    )}
                  </GoogleMap>
                  <div className="map-instructions">
                    {useCustomLocation ? (
                      <>
                        <p>
                          <svg viewBox="0 0 24 24" width="16" height="16">
                            <path
                              fill="currentColor"
                              d="M12,2L4,5V6.09C4,11.31 6.55,16.26 10,18.91C11,19.6 12,20.09 13,20.09C14,20.09 15,19.6 16,18.91C19.45,16.26 22,11.31 22,6.09V5L12,2M11,7H13V9H15V11H13V13H11V11H9V9H11V7Z"
                            />
                          </svg>
                          Search for an address or click on the map to set
                          location
                        </p>
                        <p>
                          <svg viewBox="0 0 24 24" width="16" height="16">
                            <path
                              fill="currentColor"
                              d="M22,12L18,8V11H14V13H18V16L22,12M10,4A4,4 0 0,1 14,8A4,4 0 0,1 10,12A4,4 0 0,1 6,8A4,4 0 0,1 10,4M4,16V18H16V16C16,14.67 13.33,14 10,14C6.67,14 4,14.67 4,16Z"
                            />
                          </svg>
                          Drag the marker to adjust precise location
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          <svg viewBox="0 0 24 24" width="16" height="16">
                            <path
                              fill="currentColor"
                              d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"
                            />
                          </svg>
                          Your current location is marked with a blue dot
                        </p>
                        {mapAccuracy && mapAccuracy > 50 && (
                          <p className="accuracy-note">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                              <path
                                fill="currentColor"
                                d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"
                              />
                            </svg>
                            The blue circle shows possible location area (
                            {Math.round(mapAccuracy)}m radius)
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="additional-location-info">
                  <label>Additional Location Details (Optional)</label>
                  <textarea
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="Floor number, landmark, access instructions, or any other details to help responders find you"
                    rows="2"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="back-btn" onClick={prevStep}>
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
                      />
                    </svg>
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !coordinates}
                    className="submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Dispatching Emergency Response...
                      </>
                    ) : (
                      <>
                        Request Emergency Assistance
                        <svg viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="info-section">
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"
                    />
                  </svg>
                </div>
                <div>
                  <h4>Response Time</h4>
                  <p>
                    Average response:{" "}
                    <strong>
                      {emergencyType === "hospital"
                        ? "25-40 mins"
                        : "15-30 mins"}
                    </strong>
                  </p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12,3A4,4 0 0,1 16,7A4,4 0 0,1 12,11A4,4 0 0,1 8,7A4,4 0 0,1 12,3M16,13.54C16,14.6 15.72,17.07 13.81,19.83L13,15L13.94,13.12C13.32,13.05 12.67,13 12,13C11.33,13 10.68,13.05 10.06,13.12L11,15L10.19,19.83C8.28,17.07 8,14.6 8,13.54C5.61,14.24 4,15.5 4,17V21H20V17C20,15.5 18.4,14.24 16,13.54Z"
                    />
                  </svg>
                </div>
                <div>
                  <h4>Medical Team</h4>
                  <p>Board-certified doctors and paramedics</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,7V9H13V7H11M11,11V17H13V11H11Z"
                    />
                  </svg>
                </div>
                <div>
                  <h4>24/7 Support</h4>
                  <p>Emergency coordination available anytime</p>
                </div>
              </div>
            </div>

            <div className="safety-tips">
              <h3>
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.1 14.8,9.5V11C15.4,11 16,11.6 16,12.2V15.7C16,16.4 15.4,17 14.7,17H9.2C8.6,17 8,16.4 8,15.7V12.2C8,11.6 8.6,11 9.2,11V9.5C9.2,8.1 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z"
                  />
                </svg>
                Safety Tips While Waiting
              </h3>
              <ul>
                <li>Keep phone accessible and volume turned up</li>
                <li>If possible, send someone to wait at the street</li>
                <li>Prepare medical information and medications</li>
                <li>Unlock doors if responders need access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default EmergencyRes;

// CSS Styles
const styles = `
  :root {
    --primary: #e63946;
    --primary-light: #f8a5a5;
    --primary-dark: #c1121f;
    --secondary: #457b9d;
    --secondary-light: #a8dadc;
    --light: #f1faee;
    --dark: #1d3557;
    --dark-light: #2a3a57;
    --gray: #6c757d;
    --light-gray: #f8f9fa;
    --lighter-gray: #f1f3f5;
    --success: #2a9d8f;
    --warning: #e9c46a;
    --border-radius: 16px;
    --border-radius-sm: 8px;
    --box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    --box-shadow-sm: 0 2px 12px rgba(0,0,0,0.05);
    --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    --text-gradient: linear-gradient(135deg, #e63946 0%, #457b9d 100%);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    color: var(--dark);
    background-color: #f5f7fa;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .emergency-app {
    max-width: 900px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .emergency-card {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    overflow: hidden;
    padding: 2.5rem;
    position: relative;
  }

  .header {
    text-align: center;
    margin-bottom: 2.5rem;
    position: relative;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark);
  }

  .logo svg {
    width: 32px;
    height: 32px;
    fill: var(--primary);
  }

  .logo-highlight {
    background: var(--text-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    color: var(--gray);
    font-size: 1rem;
    max-width: 600px;
    margin: 0 auto 1.5rem;
  }

  .progress-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2rem 0 1rem;
    gap: 0.5rem;
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .step-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--light-gray);
    color: var(--gray);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    transition: var(--transition);
  }

  .step.active .step-number {
    background: var(--primary);
    color: white;
  }

  .step-label {
    font-size: 0.8rem;
    color: var(--gray);
    font-weight: 500;
    transition: var(--transition);
  }

  .step.active .step-label {
    color: var(--dark);
    font-weight: 600;
  }

  .step-connector {
    flex: 1;
    height: 2px;
    background: var(--light-gray);
    max-width: 60px;
    position: relative;
    top: -8px;
  }

  .form-container {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fadeOut {
    animation: fadeOut 0.3s ease-out;
  }

  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(10px); }
  }

  .form-section {
    margin-bottom: 2rem;
  }

  .form-section h3 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: var(--dark);
    font-weight: 600;
    position: relative;
    padding-left: 1.5rem;
  }

  .form-section h3:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background: var(--primary);
    border-radius: 50%;
  }

  .option-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .option-cards {
      grid-template-columns: 1fr 1fr;
    }
  }

  .option-card {
    border: 1px solid #e0e0e0;
    border-radius: var(--border-radius);
    padding: 1.5rem;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .option-card:hover {
    border-color: var(--primary-light);
    box-shadow: var(--box-shadow-sm);
    transform: translateY(-2px);
  }

  .option-card.selected {
    border-color: var(--primary);
    background-color: rgba(230, 57, 70, 0.03);
  }

  .option-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(230, 57, 70, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .option-icon svg {
    width: 24px;
    height: 24px;
    fill: var(--primary);
  }

  .option-card.selected .option-icon {
    background: rgba(230, 57, 70, 0.2);
  }

  .option-content h4 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: var(--dark);
    font-weight: 700;
  }

  .option-content p {
    font-size: 0.9rem;
    color: var(--gray);
    margin-bottom: 1rem;
  }

  .emergency-list {
    list-style: none;
    margin-top: 0.5rem;
  }

  .emergency-list li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    color: var(--dark-light);
  }

  .emergency-list li:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.5rem;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--primary);
  }

  .option-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: var(--primary);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .input-group {
    margin-bottom: 1.5rem;
  }

  .input-group label {
    display: block;
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
    color: var(--dark);
    font-weight: 500;
  }

  textarea {
    width: 100%;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: var(--border-radius-sm);
    min-height: 120px;
    resize: vertical;
    font-family: inherit;
    font-size: 0.95rem;
    transition: var(--transition);
    line-height: 1.6;
  }

  textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.1);
  }

  .char-count {
    text-align: right;
    font-size: 0.8rem;
    color: var(--gray);
    margin-top: 0.3rem;
  }

  .location-toggle {
    display: flex;
    background: var(--light-gray);
    border-radius: var(--border-radius-sm);
    padding: 0.3rem;
    margin-bottom: 1.5rem;
  }

  .toggle-btn {
    flex: 1;
    padding: 0.8rem;
    border: none;
    background: transparent;
    cursor: pointer;
    font-weight: 500;
    border-radius: 6px;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .toggle-btn svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  .toggle-btn.active {
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    color: var(--primary);
    font-weight: 600;
  }

  .location-search {
    position: relative;
    margin-bottom: 1.5rem;
  }

  .location-search input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 1px solid #ddd;
    border-radius: var(--border-radius-sm);
    font-size: 0.95rem;
    transition: var(--transition);
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }

  .location-search input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.1);
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    fill: var(--gray);
  }

  .current-location-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--light-gray);
    border-radius: var(--border-radius-sm);
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .location-info {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    flex: 1;
  }

  .location-icon {
    width: 24px;
    height: 24px;
    fill: var(--primary);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .location-address {
    font-weight: 500;
    color: var(--dark);
  }

  .refresh-btn {
    background: white;
    border: 1px solid #ddd;
    border-radius: var(--border-radius-sm);
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: var(--transition);
    font-weight: 500;
    color: var(--dark-light);
  }

  .refresh-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  .refresh-icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  .map-wrapper {
    margin-top: 1.5rem;
    position: relative;
  }

  .map-instructions {
    margin-top: 1rem;
    font-size: 0.85rem;
    color: var(--gray);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .map-instructions p {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .map-instructions svg {
    fill: var(--primary);
  }

  .accuracy-note {
    color: var(--dark-light);
  }

  .additional-location-info {
    margin-top: 1.5rem;
  }

  .additional-location-info textarea {
    min-height: 80px;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  .back-btn {
    padding: 1rem 1.5rem;
    background: white;
    color: var(--dark);
    border: 1px solid #ddd;
    border-radius: var(--border-radius-sm);
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .back-btn:hover {
    border-color: var(--gray);
    background: var(--light-gray);
  }

  .back-btn svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  .next-btn, .submit-btn {
    flex: 1;
    padding: 1rem 1.5rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: var(--border-radius-sm);
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
  }

  .next-btn:hover, .submit-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(230, 57, 70, 0.2);
  }

  .next-btn:disabled, .submit-btn:disabled {
    background: #e0e0e0;
    color: var(--gray);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .next-btn svg, .submit-btn svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }

  .small-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(69, 123, 157, 0.3);
    border-radius: 50%;
    border-top-color: var(--secondary);
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .info-section {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .info-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1.2rem;
    background: var(--lighter-gray);
    border-radius: var(--border-radius-sm);
  }

  .info-icon {
    width: 40px;
    height: 40px;
    background: rgba(69, 123, 157, 0.1);
    color: var(--secondary);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .info-icon svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }

  .info-item h4 {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
    color: var(--dark);
  }

  .info-item p {
    font-size: 0.85rem;
    color: var(--gray);
  }

  .safety-tips {
    background: rgba(241, 250, 238, 0.5);
    border-radius: var(--border-radius-sm);
    padding: 1.5rem;
    border-left: 4px solid var(--success);
  }

  .safety-tips h3 {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: var(--dark);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .safety-tips h3 svg {
    width: 20px;
    height: 20px;
    fill: var(--success);
  }

  .safety-tips ul {
    list-style: none;
  }

  .safety-tips li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: var(--dark-light);
  }

  .safety-tips li:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.5rem;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--success);
  }/* Success Screen Base */
.success-container {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.3s ease-out;
}

.success-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.success-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--success);
}

.success-icon {
  width: 72px;
  height: 72px;
  background: rgba(42, 157, 143, 0.1);
  color: var(--success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.success-icon svg {
  width: 36px;
  height: 36px;
}

.success-card h2 {
  color: var(--dark);
  margin-bottom: 1rem;
  font-size: 1.5rem;
  line-height: 1.3;
}

.success-text {
  color: var(--gray);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.success-details {
  background: var(--lighter-gray);
  border-radius: var(--border-radius-sm);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.detail-item {
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-weight: 600;
  color: var(--dark);
  flex: 0 0 120px;
  font-size: 0.95rem;
}

.detail-value {
  color: var(--dark-light);
  flex: 1;
  font-size: 0.95rem;
  text-align: right;
}

.accuracy-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(233, 196, 106, 0.1);
  border-radius: 6px;
  color: #b38b00;
  font-size: 0.85rem;
}

.accuracy-warning svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.map-links {
  margin-bottom: 1.5rem;
  text-align: center;
}

.map-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--secondary);
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: var(--transition);
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: rgba(69, 123, 157, 0.1);
}

.map-link:hover {
  background: rgba(69, 123, 157, 0.2);
}

.map-link svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.success-btn,
.emergency-call-btn {
  padding: 1rem;
  font-weight: 600;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: var(--transition);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.success-btn {
  background: var(--success);
  color: white;
  border: none;
}

.success-btn:hover {
  background: #238277;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(42, 157, 143, 0.2);
}

.emergency-call-btn {
  background: white;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.emergency-call-btn:hover {
  background: rgba(230, 57, 70, 0.05);
  transform: translateY(-1px);
}

.emergency-call-btn svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* Fade-in Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive Tweaks */
@media (max-width: 480px) {
  .success-card {
    padding: 1.5rem;
  }

  .detail-label {
    flex: 1 1 100%;
    font-size: 0.9rem;
  }

  .detail-value {
    text-align: left;
    flex: 1 1 100%;
    font-size: 0.9rem;
  }

  .success-icon {
    width: 64px;
    height: 64px;
  }

  .success-icon svg {
    width: 30px;
    height: 30px;
  }

  .success-card h2 {
    font-size: 1.3rem;
  }

  .success-text {
    font-size: 0.95rem;
  }
}


  /* Responsive */
  @media (max-width: 768px) {
    .emergency-card {
      padding: 1.5rem;
    }

    .option-cards {
      grid-template-columns: 1fr;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column;
    }

    .back-btn, .next-btn, .submit-btn {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .current-location-display {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .refresh-btn {
      align-self: stretch;
      justify-content: center;
    }

    .progress-steps {
      gap: 0.2rem;
    }

    .step-label {
      display: none;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
