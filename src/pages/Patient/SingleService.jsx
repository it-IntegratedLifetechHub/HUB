import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import * as BiIcons from "react-icons/bi";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as PiIcons from "react-icons/pi";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";

import testData from "../../test.json";
import BottomNavigation from "../../components/BottomNav";

const iconLibraries = {
  Bi: BiIcons,
  Fa: FaIcons,
  Gi: GiIcons,
  Pi: PiIcons,
  Md: MdIcons,
  Ri: RiIcons,
  Fi: FiIcons,
  Ai: AiIcons,
};

const SingleService = () => {
  const { serviceName } = useParams();
  const decodedServiceName = decodeURIComponent(serviceName);
  const service = testData.tests[decodedServiceName];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const renderIcon = (iconName, size = 40, color = "#7b2cbf") => {
    const prefix = iconName.slice(0, 2);
    const IconComponent = iconLibraries[prefix]?.[iconName];
    return IconComponent ? <IconComponent size={size} color={color} /> : null;
  };

  if (!service) {
    return (
      <div className="not-found-message">
        ❗ Service not found. Please go back and select a valid service.
      </div>
    );
  }

  return (
    <div className="single-service-container">
      <div className="header-section">
        {renderIcon(service.icon, 60)}
        <h1>{decodedServiceName}</h1>
        <p className="header-subtext">
          Explore recommended tests and details below
        </p>
      </div>

      <div className="single-service-tests-list">
        {service.tests.map((testGroup, index) =>
          Object.keys(testGroup).map((testName, idx) => {
            const testDetails = testGroup[testName];
            return (
              <div key={`${index}-${idx}`} className="single-service-test-item">
                <div className="single-service-test-item-header">
                  {renderIcon(testDetails.icon, 55)}
                  <h2>{testName}</h2>
                </div>
                <p>
                  <strong>Description:</strong> {testDetails.description}
                </p>
                <div className="single-service-cta">
                  <Link
                    to={`/service/${encodeURIComponent(
                      decodedServiceName
                    )}/${encodeURIComponent(testName)}`}
                    className="cta-link"
                  >
                    <button className="cta-button know-more">Know More</button>
                  </Link>
                  <button className="cta-button book-btn">Book Now</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default SingleService;
