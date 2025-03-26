import React, { useState, useEffect } from "react";
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

  const renderIcon = (iconName) => {
    const prefix = iconName.slice(0, 2);
    const IconComponent = iconLibraries[prefix]?.[iconName];
    return IconComponent ? (
      <IconComponent className="category-icon" size={30} />
    ) : null;
  };

  const filteredTests = Object.entries(testData.tests).flatMap(
    ([category, details]) =>
      details.tests.flatMap((testGroup) =>
        Object.entries(testGroup).flatMap(([testName, testInfo]) =>
          testName.toLowerCase().includes(searchTerm.toLowerCase())
            ? [{ name: testName, ...testInfo, category }]
            : []
        )
      )
  );

  const filteredCategories = Object.entries(testData.tests).filter(
    ([category]) => category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
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
                data.display_name ||
                "Location not found"
            );
          } catch (err) {
            setLocation("Unable to fetch location");
          }
        },
        () => {
          setLocation("Location permission denied");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  return (
    <>
      <div className="header-container gradient-background">
        <div className="location-section">
          <div className="location-info">
            <FaLocationDot className="location-icon" />
            <h1 className="location-text">{location}</h1>
          </div>

          <div className="search-bar shadow-effect">
            <CiSearch className="search-icon" />
            <input
              type="search"
              placeholder="Search for tests or services..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm && (
            <div className="test-list">
              {filteredTests.length > 0 ? (
                <div className="test-category">
                  <h2 className="category-title highlight-text">
                    Search Results
                  </h2>
                  <ul className="test-items">
                    {filteredTests.map((test) => {
                      const encodedTestName = encodeURIComponent(test.name);
                      const encodedCategory = encodeURIComponent(test.category);

                      return (
                        <li
                          key={`${test.category}-${test.name}`}
                          className="test-item"
                        >
                          <Link
                            to={`/service/${encodedCategory}/${encodedTestName}`}
                            className="test-link"
                          >
                            {renderIcon(test.icon, 40)}
                            <span className="test-name">{test.name}</span>
                            <span className="category-badge">
                              ({test.category})
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p className="no-results">
                  No tests found matching your search.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="test-categories-container">
          <h1>Book A Test for Your Health Problem</h1>
          <div className="test-categories">
            {filteredCategories.map(([category, details]) => (
              <Link key={category} to={details.link}>
                <div className="test-category-item">
                  {renderIcon(details.icon, 50)}
                  <div className="category-title">{category}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
};

export default Home;
