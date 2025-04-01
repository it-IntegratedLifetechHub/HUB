import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import testData from "../../test.json";
import BottomNavigation from "../../components/BottomNav";

// Import all icon libraries
import * as BiIcons from "react-icons/bi";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";
import { FaFlask } from "react-icons/fa";

const SingleTest = () => {
  const { serviceName, test } = useParams();
  const navigate = useNavigate();
  const decodedService = decodeURIComponent(serviceName);
  const decodedTestName = decodeURIComponent(test);

  // Memoize service data lookup
  const service = React.useMemo(
    () => testData.tests[decodedService],
    [decodedService]
  );

  // Find test details with memoization
  const testDetails = React.useMemo(() => {
    if (!service) return null;
    for (const testGroup of service.tests) {
      const foundTest = Object.entries(testGroup).find(
        ([testName]) => testName === decodedTestName
      );
      if (foundTest) return foundTest[1];
    }
    return null;
  }, [service, decodedTestName]);

  const handleBookTest = () => {
    console.log(`Booking test: ${decodedTestName}`);
  };

  // Function to get the appropriate icon component
  const getIconComponent = (iconName) => {
    if (!iconName) return FaFlask;

    // Check all icon libraries
    if (MdIcons[iconName]) return MdIcons[iconName];
    if (BiIcons[iconName]) return BiIcons[iconName];
    if (FaIcons[iconName]) return FaIcons[iconName];
    if (GiIcons[iconName]) return GiIcons[iconName];

    return FaFlask;
  };

  if (!service) {
    return (
      <div className="not-found-message">
        Service not found!
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!testDetails) {
    return (
      <div className="not-found-message">
        Test not found!
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
        <div className="test-header">
          <IconComponent size={60} color="#9900ff" />
          <h1>{decodedTestName}</h1>
        </div>

        <div className="test-details-card">
          <p>
            <strong>Description:</strong> {testDetails.description}
          </p>
          <p>
            <strong>Preparation:</strong> {testDetails.preparation}
          </p>
          <p>
            <strong>Turnaround Time:</strong> {testDetails.turnaround_time}
          </p>
          <p>
            <strong>Why to Take:</strong> {testDetails.why_to_take}
          </p>
        </div>

        <div className="single-service-cta">
          <button
            className="cta-button book-now"
            onClick={handleBookTest}
            aria-label={`Book ${decodedTestName} test`}
          >
            Book Test
          </button>
        </div>
      </div>

      <BottomNavigation />

      <style jsx="true">{`
        .single-test-page-container {
          padding: 50px 30px;
          max-width: 950px;
          margin: 50px auto;
          background: linear-gradient(135deg, #ffffff, #f3f6ff);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        }

        .test-header {
          text-align: center;
          margin-bottom: 40px;
          animation: fadeInDown 0.8s ease;
        }

        .test-header h1 {
          font-size: 36px;
          margin-top: 16px;
          color: #5e0d97;
          font-weight: 700;
        }

        .test-details-card {
          background: #ffffff;
          padding: 35px;
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
          margin-bottom: 40px;
          transition: transform 0.3s;
        }

        .test-details-card:hover {
          transform: translateY(-5px);
        }

        .test-details-card p {
          margin-bottom: 20px;
          line-height: 1.7;
          color: #333;
          font-size: 17px;
        }

        .test-details-card p strong {
          color: #000;
        }

        .single-service-cta {
          display: flex;
          gap: 20px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }

        .cta-button {
          padding: 14px 28px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s ease;
          min-width: 160px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
        }

        .cta-button.book-now {
          background: linear-gradient(135deg, #9900ff, #7b00cc);
          color: #ffffff;
          border: 2px solid transparent;
        }

        .cta-button.book-now:hover {
          background: linear-gradient(135deg, #7b00cc, #9900ff);
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 10px 26px rgba(153, 0, 255, 0.2);
        }

        .not-found-message {
          text-align: center;
          padding: 50px;
          font-size: 18px;
          color: #ff4444;
        }

        .back-button {
          display: block;
          margin: 20px auto 0;
          padding: 10px 20px;
          background: #9900ff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: #7b00cc;
          transform: translateY(-2px);
        }

        .icon-placeholder {
          width: 60px;
          height: 60px;
          background: #f0f0f0;
          border-radius: 50%;
          margin: 0 auto;
          transition: all 0.3s ease;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .single-test-page-container {
            padding: 30px 20px;
            margin: 45px auto;
          }

          .test-header h1 {
            font-size: 28px;
          }

          .test-details-card {
            padding: 25px;
          }

          .cta-button {
            width: 100%;
            max-width: 300px;
          }

          .single-service-cta {
            flex-direction: column;
            gap: 15px;
          }
        }

        @media (max-width: 480px) {
          .test-header h1 {
            font-size: 24px;
          }

          .test-details-card p {
            font-size: 15px;
          }

          .cta-button {
            font-size: 15px;
            padding: 12px 20px;
          }
        }
      `}</style>
    </>
  );
};

export default SingleTest;
