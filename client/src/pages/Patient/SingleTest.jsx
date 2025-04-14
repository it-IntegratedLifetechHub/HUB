import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BottomNavigation from "../../components/BottomNav";
import * as BiIcons from "react-icons/bi";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";
import * as PiIcons from "react-icons/pi";
import * as RiIcons from "react-icons/ri";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";
import { FaFlask } from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaUserMd } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";

const SingleTest = () => {
  const { categoryId, test: testNameParam } = useParams();
  const navigate = useNavigate();
  const decodedTestName = decodeURIComponent(testNameParam);

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testDetails, setTestDetails] = useState(null);

  const getIconComponent = (iconName) => {
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

    for (const set of iconSets) {
      if (set[iconName]) return set[iconName];
    }

    return FaFlask; // fallback
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/categories/${categoryId}/tests`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch tests");
        }
        const data = await res.json();
        setTests(data.data || []);

        // Find the test details by name
        const foundTest = data.data.find(
          (test) => test.name === decodedTestName
        );
        setTestDetails(foundTest || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [categoryId, decodedTestName]);

  const handleBookTest = () => {
    console.log(`Booking test: ${decodedTestName}`);
    // Optionally implement booking logic here
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading test details...</p>
      </div>
    );
  }

  if (error || !testDetails) {
    return (
      <div className="not-found-message">
        <h2>{error || "Test not found!"}</h2>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  const IconComponent = getIconComponent(testDetails.icon);

  return (
    <>
      <div className="single-test-page-container">
        {/* Header Section */}
        <div className="test-header">
          <div className="icon-wrapper">
            <IconComponent size={70} color="#9900ff" />
          </div>
          <h1>{decodedTestName}</h1>

          <div className="price-badge">
            <FaRupeeSign className="price-icon" />
            <span className="price-value">
              {testDetails.totalCost.toLocaleString("en-IN")}
            </span>
            <span className="price-label">Total Cost</span>
          </div>
        </div>

        {/* Test Details Card */}
        <div className="test-details-card">
          <div className="detail-section">
            <h3 className="section-title">
              <FaInfoCircle className="section-icon" />
              Description
            </h3>
            <p>{testDetails.description || "Not specified"}</p>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <FaFlask className="detail-icon" />
              <div>
                <h4>Preparation</h4>
                <p>{testDetails.preparation || "None required"}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaClock className="detail-icon" />
              <div>
                <h4>Turnaround Time</h4>
                <p>{testDetails.turnaroundTime || "15-30 mins"}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaUserMd className="detail-icon" />
              <div>
                <h4>Specialist</h4>
                <p>{testDetails.specialist || "Pathologist"}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaQuestionCircle className="detail-icon" />
              <div>
                <h4>Why Take This Test?</h4>
                <p>{testDetails.whyToTake || "General health screening"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <button
            className="primary-button"
            onClick={handleBookTest}
            aria-label={`Book ${decodedTestName} test`}
          >
            <FaCalendarAlt className="button-icon" />
            Book Test Now
          </button>
          <button className="secondary-button">
            <FaPhoneAlt className="button-icon" />
            Talk to Specialist
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* CSS Styles */}
      <style jsx="true">{`
        .single-test-page-container {
          padding: 2.5rem;
          max-width: 950px;
          margin: 2rem auto;
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          font-family: "Inter", sans-serif;
        }

        /* Header Styles */
        .test-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .icon-wrapper {
          background: rgba(153, 0, 255, 0.1);
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          transition: transform 0.3s ease;
        }

        .icon-wrapper:hover {
          transform: scale(1.05);
        }

        h1 {
          font-size: 2.25rem;
          color: #5e0d97;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.3;
        }

        /* Price Badge */
        .price-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(153, 0, 255, 0.1);
          padding: 0.75rem 1.5rem;
          border-radius: 2rem;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .price-icon {
          color: #9900ff;
          font-size: 1.1rem;
        }

        .price-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #5e0d97;
        }

        .price-label {
          font-size: 0.9rem;
          color: #666;
          margin-left: 0.5rem;
        }

        /* Test Details Card */
        .test-details-card {
          background: #f9f9ff;
          padding: 2.5rem;
          border-radius: 1.25rem;
          margin-bottom: 3rem;
          border: 1px solid #eee;
        }

        .detail-section {
          margin-bottom: 2rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          color: #333;
          margin-bottom: 1rem;
        }

        .section-icon {
          color: #9900ff;
        }

        /* Detail Grid */
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .detail-item {
          display: flex;
          gap: 1rem;
          background: white;
          padding: 1.25rem;
          border-radius: 0.75rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }

        .detail-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .detail-icon {
          color: #9900ff;
          font-size: 1.25rem;
          margin-top: 0.25rem;
          flex-shrink: 0;
        }

        .detail-item h4 {
          font-size: 1rem;
          color: #444;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .detail-item p {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        /* CTA Section */
        .cta-section {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .primary-button,
        .secondary-button {
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 220px;
          justify-content: center;
        }

        .primary-button {
          background: linear-gradient(135deg, #9900ff, #7b00cc);
          color: white;
          border: none;
          box-shadow: 0 4px 16px rgba(153, 0, 255, 0.3);
        }

        .primary-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(153, 0, 255, 0.4);
        }

        .secondary-button {
          background: white;
          color: #9900ff;
          border: 2px solid #9900ff;
        }

        .secondary-button:hover {
          background: rgba(153, 0, 255, 0.05);
          transform: translateY(-3px);
        }

        .button-icon {
          font-size: 1.1rem;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .single-test-page-container {
            padding: 1.5rem;
            margin: 1rem auto 7rem;
            border-radius: 1rem;
          }

          h1 {
            font-size: 1.75rem;
          }

          .test-details-card {
            padding: 1.5rem;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }

          .cta-section {
            flex-direction: column;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .icon-wrapper {
            width: 80px;
            height: 80px;
          }

          h1 {
            font-size: 1.5rem;
          }

          .price-value {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </>
  );
};

export default SingleTest;
