import React, { useState, useEffect } from "react";
import { FaHistory, FaStar, FaFlask } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import * as BiIcons from "react-icons/bi";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";
import testData from "../../test.json";
import BottomNavigation from "../../components/BottomNav";
import { Link } from "react-router-dom";

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
  const [recentTests, setRecentTests] = useState([]);
  const [popularTests, setPopularTests] = useState([]);

  useEffect(() => {
    // Simulate fetching recent tests (would be from API in real app)
    setRecentTests([
      {
        name: "Complete Blood Count",
        category: "Blood Tests",
        icon: "FaFlask",
      },
      { name: "Thyroid Profile", category: "Hormone Tests", icon: "FaFlask" },
      { name: "Vitamin D Test", category: "Nutrition Tests", icon: "FaFlask" },
    ]);

    // Simulate fetching popular tests
    setPopularTests([
      {
        name: "Diabetes Screening",
        category: "Health Packages",
        icon: "FaFlask",
      },
      { name: "Lipid Profile", category: "Blood Tests", icon: "FaFlask" },
      { name: "Liver Function Test", category: "Organ Tests", icon: "FaFlask" },
    ]);
  }, []);

  const renderIcon = (iconName, size = 30) => {
    if (!iconName) return <FaFlask className="category-icon" size={size} />;
    const prefix = iconName.slice(0, 2);
    const IconComponent = iconLibraries[prefix]?.[iconName];
    return IconComponent ? (
      <IconComponent className="category-icon" size={size} />
    ) : (
      <FaFlask className="category-icon" size={size} />
    );
  };

  const filteredTests = Object.entries(testData.tests).flatMap(
    ([category, details]) =>
      details.tests.flatMap((testGroup) =>
        Object.entries(testGroup).flatMap(([testName, testInfo]) =>
          testName.toLowerCase().includes(searchTerm.toLowerCase())
            ? [
                {
                  name: testName,
                  ...testInfo,
                  category,
                  encodedName: encodeURIComponent(testName),
                  encodedCategory: encodeURIComponent(category),
                },
              ]
            : []
        )
      )
  );

  const filteredCategories = Object.entries(testData.tests).filter(
    ([category]) => category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="app-header">
        <div className="location-container">
          <FaLocationDot className="location-icon pulse" />
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

      {/* Main Content */}
      <main className="main-content">
        {searchTerm ? (
          <div className="search-results">
            {filteredTests.length > 0 ? (
              <section className="results-section">
                <h2 className="section-title">Search Results</h2>
                <div className="test-grid">
                  {filteredTests.map((test) => (
                    <Link
                      key={`${test.category}-${test.name}`}
                      to={`/service/${test.encodedCategory}/${test.encodedName}`}
                      className="test-card"
                    >
                      {renderIcon(test.icon, 40)}
                      <div className="test-info">
                        <h3 className="test-name">{test.name}</h3>
                        <span className="test-category">{test.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : (
              <div className="no-results">
                <p>No tests found matching your search.</p>
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Test Categories */}
            <section className="categories-section">
              <h2 className="section-title">Book A Test for Your Health</h2>
              <div className="categories-grid">
                {filteredCategories.map(([category, details]) => (
                  <Link
                    key={category}
                    to={details.link}
                    className="category-card"
                  >
                    {renderIcon(details.icon, 50)}
                    <h3 className="category-title">{category}</h3>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <BottomNavigation />

      <style jsx="true">{`
        /* Color Variables */
        :root {
          --primary-color: #6a0dad;
          --primary-light: #f3e5ff;
          --secondary-color: #4a148c;
          --text-dark: #2d3748;
          --text-medium: #4a5568;
          --text-light: #718096;
          --border-radius: 12px;
          --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }

        /* Base Styles */
        .home-container {
          max-width: 100%;
          margin: 0 auto;
          padding-bottom: 80px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #f9f7ff, #ffffff);
        }

        /* Header Styles */
        .app-header {
          padding: 20px;
          background: linear-gradient(135deg, #6a0dad, #8e24aa);
          color: white;
          border-radius: 0 0 20px 20px;
          box-shadow: 0 4px 20px rgba(106, 13, 173, 0.2);
        }

        .location-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .location-icon {
          font-size: 24px;
          color: white;
        }

        .pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .location-text {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Search Bar */
        .search-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: white;
          border-radius: var(--border-radius);
          padding: 12px 16px;
          box-shadow: var(--box-shadow);
        }

        .search-icon {
          font-size: 22px;
          color: var(--text-light);
          margin-right: 10px;
        }

        .search-input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 16px;
          background: transparent;
        }

        /* Main Content */
        .main-content {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Search Results */
        .search-results {
          margin-top: 20px;
        }

        .results-section {
          background: white;
          border-radius: var(--border-radius);
          padding: 20px;
          box-shadow: var(--box-shadow);
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 22px;
          color: var(--primary-color);
          margin: 0 0 20px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .test-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
        }

        .test-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: white;
          border-radius: 10px;
          border: 1px solid #eee;
          transition: var(--transition);
          text-decoration: none;
          color: var(--text-dark);
        }

        .test-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(106, 13, 173, 0.1);
          border-color: var(--primary-light);
        }

        .test-info {
          flex: 1;
        }

        .test-name {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 5px 0;
        }

        .test-category {
          font-size: 14px;
          color: var(--text-light);
          background: var(--primary-light);
          padding: 3px 8px;
          border-radius: 10px;
          display: inline-block;
        }

        .category-icon {
          color: var(--primary-color);
          flex-shrink: 0;
        }

        /* No Results */
        .no-results {
          text-align: center;
          padding: 40px 20px;
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
        }

        .no-results p {
          color: var(--text-medium);
          font-size: 16px;
          margin-bottom: 20px;
        }

        .clear-search {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .clear-search:hover {
          background: var(--secondary-color);
        }

        .section-icon {
          color: var(--primary-color);
          font-size: 20px;
        }

        .test-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .test-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 8px;
          background: #f9f9f9;
          color: var(--text-dark);
          text-decoration: none;
          transition: var(--transition);
        }

        .test-item:hover {
          background: var(--primary-light);
        }

        /* Categories Section */
        .categories-section {
          margin-top: 30px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 25px 15px;
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          text-decoration: none;
          color: var(--text-dark);
          transition: var(--transition);
        }

        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(106, 13, 173, 0.15);
        }

        .category-title {
          font-size: 16px;
          font-weight: 600;
          margin-top: 15px;
          text-align: center;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          }

          .location-text {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .app-header {
            padding: 15px;
          }

          .test-grid {
            grid-template-columns: 1fr;
          }

          .category-card {
            padding: 20px 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
