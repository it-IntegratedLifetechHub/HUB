import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as BiIcons from "react-icons/bi";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as PiIcons from "react-icons/pi";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";
import {
  FaFlask,
  FaClock,
  FaUserMd,
  FaInfoCircle,
  FaBookmark,
  FaRegBookmark,
  FaArrowLeft,
} from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa";

import BottomNavigation from "../../components/BottomNav";

const SingleService = () => {
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

  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedTests, setSavedTests] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Load saved tests from localStorage
    const saved = JSON.parse(localStorage.getItem("savedTests")) || [];
    setSavedTests(saved);

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch category details
        const categoryResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/categories/${categoryId}`
        );
        if (!categoryResponse.ok) {
          throw new Error("Category not found");
        }
        const categoryData = await categoryResponse.json();
        setCategory(categoryData.data);

        // Fetch tests for the category
        const testsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/categories/${categoryId}/tests`
        );
        if (!testsResponse.ok) {
          throw new Error("Failed to fetch tests");
        }
        const testsData = await testsResponse.json();
        setTests(testsData.data);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const toggleSaveTest = (testName) => {
    const newSavedTests = savedTests.includes(testName)
      ? savedTests.filter((name) => name !== testName)
      : [...savedTests, testName];
    setSavedTests(newSavedTests);
    localStorage.setItem("savedTests", JSON.stringify(newSavedTests));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading service details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="not-found-container">
        <div className="not-found-message">
          <h2>Error Loading Service</h2>
          <p>{error}</p>
          <Link to="/" className="back-button">
            <FaArrowLeft /> Back to Services
          </Link>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="not-found-container">
        <div className="not-found-message">
          <h2>Service Not Found</h2>
          <p>
            The requested service is not available. Please select a valid
            service from our offerings.
          </p>
          <Link to="/" className="back-button">
            <FaArrowLeft /> Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="service-container">
      <div className="service-header">
        <div className="header-content">
          <div className="service-icon">
            {React.createElement(getIconComponent(category.icon), { size: 50 })}
          </div>

          <h1>{category.name}</h1>
          <p className="service-description">
            {category.description || "Explore recommended tests below"}
          </p>
        </div>
      </div>

      <div className="test-grid">
        {tests.map((test, index) => {
          const isSaved = savedTests.includes(test.name);

          return (
            <div key={index} className="test-card">
              <div className="card-header">
                <div className="test-icon">
                  {React.createElement(getIconComponent(test.icon), {
                    size: 30,
                  })}
                </div>
                <button
                  className={`save-button ${isSaved ? "saved" : ""}`}
                  onClick={() => toggleSaveTest(test.name)}
                  aria-label={isSaved ? "Unsave test" : "Save test"}
                >
                  {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                </button>
              </div>

              <div className="card-body">
                <h2 className="test-title">{test.name}</h2>
                <p className="test-description">{test.description}</p>

                <div className="test-details">
                  <div className="detail-item">
                    <FaClock className="detail-icon" />
                    <span>
                      Turn Around Time: {test.turnaroundTime || "15-30 mins"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FaUserMd className="detail-icon" />
                    <span>Specialist: {test.specialist || "Pathologist"}</span>
                  </div>
                  {test.preparation && (
                    <div className="detail-item">
                      <FaInfoCircle className="detail-icon" />
                      <span>Preparation: {test.preparation}</span>
                    </div>
                  )}
                  <div className="detail-item total-cost">
                    <FaRupeeSign className="detail-icon" />
                    <span className="cost-value">
                      {test.totalCost.toLocaleString("en-IN")}
                    </span>
                    <span className="cost-label">Total Cost</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <Link
                  to={`/category/${categoryId}/test/${encodeURIComponent(
                    test.name
                  )}`}
                  className="detail-button"
                >
                  View Details
                </Link>
                <button className="book-button">Book Now</button>
              </div>
            </div>
          );
        })}
      </div>

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
        .service-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          padding-bottom: 100px;

          font-family: "Outfit", -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Not Found State */
        .not-found-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 20px;
        }

        .not-found-message {
          text-align: center;
          max-width: 500px;
          background: white;
          padding: 30px;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
        }

        .not-found-message h2 {
          color: var(--primary-color);
          margin-bottom: 15px;
        }

        .not-found-message p {
          color: var(--text-medium);
          margin-bottom: 20px;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--primary-color);
          color: white;
          border-radius: var(--border-radius);
          text-decoration: none;
          font-weight: 600;
          transition: var(--transition);
        }

        .back-button:hover {
          background: var(--secondary-color);
        }

        /* Service Header */
        .service-header {
          position: relative;
          margin-bottom: 40px;
          text-align: center;
        }

        .back-link {
          position: absolute;
          left: 0;
          top: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 600;
          transition: var(--transition);
        }

        .back-link:hover {
          color: var(--secondary-color);
        }

        .header-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .service-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-light);
          border-radius: 50%;
          margin: 0 auto 20px;
          color: var(--primary-color);
        }

        .service-header h1 {
          font-size: 32px;
          color: var(--primary-color);
          margin: 0 0 10px 0;
        }

        .service-description {
          font-size: 18px;
          color: var(--text-medium);
          margin: 0;
          line-height: 1.5;
        }

        /* Test Grid */
        .test-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
          margin-top: 30px;
        }

        /* Test Card */
        .test-card {
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
        }

        .test-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(106, 13, 173, 0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 20px 0;
        }

        .test-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-light);
          border-radius: 12px;
        }

        .test-icon img {
          width: 30px;
          height: 30px;
        }

        .save-button {
          background: none;
          border: none;
          color: var(--text-light);
          font-size: 20px;
          cursor: pointer;
          transition: var(--transition);
          padding: 5px;
        }

        .save-button:hover {
          color: var(--primary-color);
        }

        .save-button.saved {
          color: var(--primary-color);
        }

        .card-body {
          padding: 20px;
          flex: 1;
        }

        .test-title {
          font-size: 20px;
          color: var(--text-dark);
          margin: 0 0 10px 0;
          font-weight: 600;
        }

        .test-description {
          color: var(--text-medium);
          margin: 0 0 15px 0;
          font-size: 15px;
          line-height: 1.5;
        }

        .test-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--text-medium);
        }

        .detail-item.total-cost {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px dashed #eee;
          align-items: baseline;
        }

        .detail-icon {
          color: var(--primary-color);
          flex-shrink: 0;
          font-size: 16px;
        }

        .cost-value {
          font-size: 18px;
          font-weight: 700;
          color: var(--primary-color);
        }

        .cost-label {
          margin-left: auto;
          font-size: 13px;
          color: var(--text-light);
          background: #f5f5f5;
          padding: 4px 8px;
          border-radius: 4px;
        }

        /* Card Footer (if needed) */
        .card-footer {
          display: flex;
          border-top: 1px solid #eee;
          padding: 15px 20px;
          gap: 10px;
        }

        .detail-button,
        .book-button {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          transition: var(--transition);
        }

        .detail-button {
          background: white;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
        }

        .detail-button:hover {
          background: var(--primary-light);
        }

        .book-button {
          background: var(--primary-color);
          color: white;
          border: none;
          cursor: pointer;
        }

        .book-button:hover {
          background: var(--secondary-color);
        }
        /* Responsive Design */
        @media (max-width: 768px) {
          .service-header h1 {
            font-size: 28px;
          }

          .service-description {
            font-size: 16px;
          }

          .test-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 480px) {
          .back-link {
            position: static;
            margin-bottom: 15px;
            display: inline-flex;
          }

          .test-grid {
            grid-template-columns: 1fr;
          }

          .card-footer {
            flex-direction: column;
            gap: 10px;
          }

          .detail-button,
          .book-button {
            width: 100%;
            margin-right: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SingleService;
