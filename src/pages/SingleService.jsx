import React from "react";
import { useParams } from "react-router-dom";
import * as BiIcons from "react-icons/bi";
import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6"; // Make sure this is imported!
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";

import testData from "../test.json";
import BottomNavigation from "../components/BottomNav";

const iconLibraries = {
  Bi: BiIcons,
  Fa: FaIcons,
  Fa6: Fa6Icons,
  Gi: GiIcons,
  Md: MdIcons,
  Ri: RiIcons,
  Fi: FiIcons,
  Ai: AiIcons,
};
const SingleService = () => {
  const { serviceName } = useParams();
  const decodedServiceName = decodeURIComponent(serviceName);

  // ✅ FIX: Access nested under "tests"
  const service = testData.tests[decodedServiceName];

  const renderIcon = (iconName, size = 30, color = "#9900ff") => {
    const prefix = iconName.slice(0, 2);
    const IconComponent = iconLibraries[prefix]?.[iconName];
    return IconComponent ? <IconComponent size={size} color={color} /> : null;
  };

  if (!service) {
    return (
      <div style={{ textAlign: "center", padding: "50px", fontSize: "18px" }}>
        ❗ Service not found. Please go back and select a valid service.
      </div>
    );
  }

  return (
    <div className="single-service-container">
      <div className="header-section">
        {renderIcon(service.icon, 40)}
        <h1>{decodedServiceName}</h1>
      </div>
      <div className="tests-list">
        {service.tests.map((test, index) => (
          <div key={index} className="test-item">
            {renderIcon(test.icon, 28)}
            <span className="test-name">{test.name}</span>
          </div>
        ))}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default SingleService;
