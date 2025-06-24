import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { FaFlask } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import * as BiIcons from "react-icons/bi";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { Link } from "react-router-dom";
import BottomNavigation from "../../components/BottomNav";

import {
  FaCheckCircle,
  FaChevronRight,
  FaPhoneAlt,
  FaShieldAlt,
  FaStar,
  FaUserMd,
} from "react-icons/fa";

const iconLibraries = {
  Bi: BiIcons,
  Fa: FaIcons,
  Gi: GiIcons,
  Md: MdIcons,
  Ri: RiIcons,
  Fi: FiIcons,
  Ai: AiIcons,
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("Fetching location...");
  const [categories, setCategories] = useState([]);
  const [tests, setTests] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchMode, setSearchMode] = useState("categories");

  const navigate = useNavigate();

  // Fetch categories from backend
  const fetchCategories = async (search = "", page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search,
        page,
        limit: pagination.limit,
      }).toString();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data.data);
      setPagination({
        page: data.meta.page,
        limit: data.meta.limit,
        total: data.meta.total,
        pages: data.meta.pages,
      });
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tests from all categories that match search term
  const fetchTests = async (searchTerm = "") => {
    setLoading(true);
    setError(null);
    try {
      const categoriesResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories?search=${searchTerm}`
      );

      if (!categoriesResponse.ok) {
        throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
      }

      const categoriesData = await categoriesResponse.json();
      const allTests = [];

      for (const category of categoriesData.data) {
        const testsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/categories/${category._id}/tests`
        );

        if (testsResponse.ok) {
          const testsData = await testsResponse.json();
          const filteredTests = testsData.data.filter((test) =>
            test.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          allTests.push(
            ...filteredTests.map((test) => ({
              ...test,
              categoryId: category._id,
              categoryName: category.name,
              categoryIcon: category.icon, // Include the category icon with tests
            }))
          );
        }
      }

      setTests(allTests);
      setPagination({
        page: 1,
        limit: 10,
        total: allTests.length,
        pages: Math.ceil(allTests.length / 10),
      });
    } catch (err) {
      console.error("Error fetching tests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchMode("categories");
      fetchCategories("");
    } else {
      setSearchMode("tests");
      fetchTests(searchTerm);
    }
  }, [searchTerm]);

  const renderIcon = (iconName, size = 30) => {
    if (!iconName) return <FaFlask size={size} />;
    const prefix = iconName.slice(0, 2);
    const IconComponent = iconLibraries[prefix]?.[iconName];
    return IconComponent ? (
      <IconComponent size={size} />
    ) : (
      <FaFlask size={size} />
    );
  };

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              setLocation(
                data.address.suburb ||
                  data.address.city ||
                  data.address.town ||
                  data.display_name ||
                  "Your Location"
              );
            } catch (err) {
              setLocation("Your Location");
            }
          },
          () => {
            setLocation("Your Location");
          }
        );
      } else {
        setLocation("Your Location");
      }
    };

    fetchLocation();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      if (searchMode === "categories") {
        fetchCategories(searchTerm, newPage);
      } else {
        setPagination((prev) => ({ ...prev, page: newPage }));
      }
    }
  };

  const getPaginatedTests = () => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    return tests.slice(startIndex, startIndex + pagination.limit);
  };

  return (
    <div className="home-container">
      <header className="app-header">
        <div className="location-container">
          <MdLocationPin className="location-icon pulse" />
          <h1 className="location-text">{location}</h1>
        </div>

        <div className="search-container">
          <div className="search-bar">
            <CiSearch className="search-icon" />
            <input
              type="search"
              placeholder="Search for tests or services..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>
      <section className="healthcare-services">
        <div className="container">
          <div className="section-header">
            <div className="tagline">
              <span className="accent-line"></span>
              <span>Premium Healthcare</span>
            </div>
            <h2>Elevate Your Wellbeing Experience</h2>
            <p className="subtitle">
              Where luxury meets healthcare — medical services designed for your
              comfort and convenience
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card premium">
              <div className="card-inner">
                <div className="icon-container">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/5996/5996830.png"
                    alt="Doctor at Home"
                    className="service-icon"
                  />
                  <div className="shine-effect"></div>
                </div>
                <h3>Doctor Visits</h3>
                <p>
                  VIP in-home consultations with top-tier physicians, complete
                  with personalized care plans and follow-ups.
                </p>
                <div className="service-features">
                  <span>
                    <FaCheckCircle className="feature-icon" /> 60+ minute
                    sessions
                  </span>
                  <span>
                    <FaCheckCircle className="feature-icon" /> Discretion
                    guaranteed
                  </span>
                </div>
                <button
                  className="cta-button"
                  onClick={() => navigate("/doctor-visit")}
                >
                  Book Now <FaChevronRight className="button-icon" />
                </button>

                <div className="corner-ribbon">Most Popular</div>
              </div>
            </div>

            <div className="service-card emergency">
              <div className="card-inner">
                <div className="icon-container">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/900/900797.png"
                    alt="Emergency Service"
                    className="service-icon"
                  />
                  <div className="shine-effect"></div>
                </div>
                <h3>Priority Emergency Response</h3>
                <p>
                  Immediate medical attention with our platinum response team,
                  equipped with advanced mobile medical units.
                </p>
                <div className="service-features">
                  <span>
                    <FaCheckCircle className="feature-icon" /> 10-15 minute
                    response
                  </span>
                  <span>
                    <FaCheckCircle className="feature-icon" /> Specialist on
                    call
                  </span>
                </div>
                <button
                  className="cta-button"
                  onClick={() => navigate("/emergency-response")}
                >
                  Book Now <FaChevronRight className="button-icon" />
                </button>
                <div className="corner-ribbon">24/7 Service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="main-content">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {searchMode === "categories" ? (
              <section className="categories-section">
                <h2 className="section-title">Book A Test for Your Health</h2>
                <div className="categories-grid">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      to={`/category/${category._id}`}
                      className="category-card"
                    >
                      {renderIcon(category.icon, 50)}
                      <h3 className="category-title">{category.name}</h3>
                    </Link>
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="pagination-controls">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </button>
                    <span>
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </section>
            ) : (
              <section className="tests-section">
                <h2 className="section-title">
                  Search Results for "{searchTerm}"
                </h2>

                {tests.length === 0 ? (
                  <div className="no-results">
                    <p>No tests found matching your search.</p>
                  </div>
                ) : (
                  <>
                    <div className="tests-grid">
                      {getPaginatedTests().map((test) => {
                        const TestIcon = test.icon
                          ? renderIcon(test.icon)
                          : renderIcon(test.categoryIcon);
                        return (
                          <Link
                            key={`${test.categoryId}-${test.name}`}
                            to={`/category/${test.categoryId}/test/${test.name}`}
                            className="test-card"
                          >
                            <div className="test-icon-container">
                              {TestIcon}
                            </div>
                            <div className="test-info">
                              <h3 className="test-name">{test.name}</h3>
                              <p className="test-category">
                                {test.categoryName}
                              </p>

                              {test.totalCost && (
                                <p className="test-price">₹{test.totalCost}</p>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {pagination.pages > 1 && (
                      <div className="pagination-controls">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                        >
                          Previous
                        </button>
                        <span>
                          Page {pagination.page} of {pagination.pages}
                        </span>
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.pages}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </section>
            )}
          </>
        )}
      </main>
      <BottomNavigation />

      <style jsx="true">{`
        /* Enhanced Color Variables */
        :root {
          --primary-color: #6a0dad;
          --primary-light: #f3e5ff;
          --primary-lighter: #faf5ff;
          --secondary-color: #4a148c;
          --accent-color: #9c27b0;
          --text-dark: #2d3748;
          --text-medium: #4a5568;
          --text-light: #718096;
          --border-radius: 16px;
          --border-radius-sm: 8px;
          --box-shadow: 0 4px 24px rgba(106, 13, 173, 0.15);
          --box-shadow-hover: 0 8px 32px rgba(106, 13, 173, 0.2);
          --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          --transition-fast: all 0.15s ease;
        }

        /* Base Styles with Smooth Scroll */
        html {
          scroll-behavior: smooth;
        }

        .home-container {
          max-width: 100%;
          margin: 0 auto;
          padding-bottom: 80px;
          font-family: "Outfit", -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #f9f7ff 0%, #ffffff 100%);
          min-height: 100vh;
        }

        /* Enhanced Header Styles with Glass Morphism */
        .app-header {
          padding: 24px 20px;
          background: linear-gradient(
            135deg,
            rgba(106, 13, 173, 0.95),
            rgba(142, 36, 170, 0.95)
          );
          color: white;
          border-radius: 0 0 24px 24px;
          box-shadow: var(--box-shadow);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        /* Location Container with Gradient Text */
        .location-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .location-icon {
          font-size: 26px;
          color: white;
        }

        .pulse {
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .location-text {
          font-size: 22px;
          font-weight: 600;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          background: linear-gradient(90deg, #ffffff, #e0c4ff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Enhanced Search Bar with Focus Effects */
        .search-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          position: relative;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.9);
          border-radius: var(--border-radius);
          padding: 14px 20px;
          box-shadow: var(--box-shadow);
          transition: var(--transition);
          border: 2px solid transparent;
        }

        .search-icon {
          font-size: 24px;
          color: var(--primary-color);
          margin-right: 12px;
          flex-shrink: 0;
        }

        .search-input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 16px;
          background: transparent;
          color: var(--text-dark);
          font-weight: 500;
        }

        .search-input::placeholder {
          color: var(--text-light);
          opacity: 0.8;
        }

        /* Main Content with Delayed Entrance Animation */
        .main-content {
          padding: 24px 20px;
          max-width: 1200px;
          margin: 0 auto;
          animation: fadeIn 0.5s ease-out 0.2s both;
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

        /* Enhanced Card Styles with Micro-interactions */
        .test-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px;
          background: white;
          border-radius: var(--border-radius-sm);
          border: 1px solid rgba(106, 13, 173, 0.1);
          transition: var(--transition);
          text-decoration: none;
          color: var(--text-dark);
          position: relative;
          overflow: hidden;
        }

        .test-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--primary-color);
          transform: scaleY(0);
          transform-origin: bottom;
          transition: var(--transition);
        }

        .test-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--box-shadow-hover);
          border-color: var(--primary-light);
        }

        .test-card:hover::before {
          transform: scaleY(1);
        }

        .test-icon-container {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--primary-lighter);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: var(--transition-fast);
        }

        .test-card:hover .test-icon-container {
          background: var(--primary-light);
          transform: scale(1.1);
        }

        /* Category Cards with Floating Effect */
        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          padding: 28px 16px;
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          text-decoration: none;
          text-align: center;
          color: var(--primary-color);
          transition: var(--transition);
          position: relative;
          gap: 1rem;
          overflow: hidden;
        }

        .category-card::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: var(--primary-color);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: var(--box-shadow-hover);
        }

        .category-card:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        /* Section Titles with Decorative Element */
        .section-title {
          font-size: 24px;
          color: var(--primary-color);
          margin: 0 0 24px 0;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          padding-bottom: 8px;
        }

        .section-title::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 3px;
          background: linear-gradient(
            90deg,
            var(--primary-color),
            var(--accent-color)
          );
          border-radius: 3px;
        }

        /* Loading Spinner Animation */
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid var(--primary-light);
          border-top: 4px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Enhanced Grid Layouts */
        .test-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 24px;
        }

        /* Responsive Breakpoints with Fluid Typography */
        @media (max-width: 1024px) {
          .test-grid {
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          }

          .categories-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          }
        }

        @media (max-width: 768px) {
          :root {
            --border-radius: 12px;
          }

          .app-header {
            padding: 20px 16px;
          }

          .location-text {
            font-size: 20px;
          }

          .search-bar {
            padding: 12px 16px;
          }

          .test-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 16px;
          }

          .categories-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 16px;
          }
        }

        @media (max-width: 480px) {
          .home-container {
            padding-bottom: 72px;
          }

          .app-header {
            padding: 16px 12px;
            border-radius: 0 0 16px 16px;
          }

          .location-container {
            margin-bottom: 16px;
          }

          .location-text {
            font-size: 18px;
          }

          .section-title {
            font-size: 20px;
          }

          .test-grid,
          .categories-grid {
            grid-template-columns: 1fr;
          }

          .category-card {
            padding: 24px 12px;
          }
        }
        /* Modern Healthcare Services CSS with new teal colors */
        .healthcare-services {
          padding: 2rem 0;
          background: linear-gradient(135deg, #f9f3ff 0%, #f0e5ff 100%);
          position: relative;
          overflow: hidden;
        }

        .healthcare-services::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none" opacity="0.03"><path d="M30,50 Q50,30 70,50 Q50,70 30,50 Z" fill="%23008080"/></svg>');
          opacity: 0.05;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 2;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .tagline {
          display: inline-flex;
          align-items: center;
          color: #6a0dad;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1rem;
        }

        .accent-line {
          display: inline-block;
          width: 30px;
          height: 2px;
          background: linear-gradient(
            135deg,
            rgba(106, 13, 173, 0.95),
            rgba(142, 36, 170, 0.95)
          );
          margin-right: 10px;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #6a0dad;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .subtitle {
          font-size: 1.1rem;
          color: #4a5568;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .service-card {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: relative;
        }

        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
        }

        .card-inner {
          padding: 2.5rem 2rem;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .icon-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .service-card.premium .icon-container {
          background: linear-gradient(135deg, #008080 0%, #00b3b3 100%);
        }

        .service-card.emergency .icon-container {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
        }

        .service-card.wellness .icon-container {
          background: linear-gradient(135deg, #00c9a7 0%, #00e0bc 100%);
        }

        .shine-effect {
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 0) 70%
          );
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .service-card:hover .shine-effect {
          opacity: 1;
        }

        .service-icon {
          width: 40px;
          height: 40px;
          filter: brightness(0) invert(1);
        }

        .service-card h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1rem;
          text-align: center;
        }

        .service-card p {
          color: #4a5568;
          text-align: center;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .service-features {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          width: 100%;
        }

        .service-features span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #4a5568;
        }

        .service-features i {
          color: #00c9a7;
        }

        .cta-button {
          background: #008080;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          margin-top: auto;
        }

        .service-card.premium .cta-button {
          background: linear-gradient(to right, #008080, #00b3b3);
        }

        .service-card.emergency .cta-button {
          background: linear-gradient(to right, #ff6b6b, #ff8e8e);
        }

        .service-card.wellness .cta-button {
          background: linear-gradient(to right, #00c9a7, #00e0bc);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .cta-button i {
          font-size: 0.8rem;
        }

        .corner-ribbon {
          position: absolute;
          top: 15px;
          right: -35px;
          width: 120px;
          padding: 0.3rem 0;
          background: #ff6b6b;
          color: white;
          text-align: center;
          font-size: 0.5rem;
          font-weight: 600;
          transform: rotate(45deg);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .trust-badges {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          margin-top: 3rem;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          padding: 0.8rem 1.5rem;
          border-radius: 50px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .badge i {
          color: #008080;
        }

        .badge span {
          font-weight: 600;
          font-size: 0.9rem;
          color: #4a5568;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .section-header h2 {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .service-card {
            max-width: 100%;
          }

          .trust-badges {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
        }

        /* Animation */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .service-card:hover {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
