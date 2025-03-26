import React from "react";
import { useParams } from "react-router-dom";
import { MdHealthAndSafety } from "react-icons/md";
import { BiDroplet, BiCapsule } from "react-icons/bi";
import { FaTint, FaProcedures } from "react-icons/fa";
import { GiOilDrum, GiKidneys, GiNecklace } from "react-icons/gi";
import testData from "../../test.json";
import BottomNavigation from "../../components/BottomNav";

const iconMap = {
  MdHealthAndSafety,
  BiDroplet,
  FaTint,
  GiOilDrum,
  FaProcedures,
  GiKidneys,
  GiNecklace,
  BiCapsule,
};

const SingleTest = () => {
  const { serviceName, test } = useParams();
  const decodedService = decodeURIComponent(serviceName);
  const decodedTestName = decodeURIComponent(test);

  const service = testData.tests[decodedService];
  if (!service) {
    return <div className="not-found-message">Service not found!</div>;
  }

  // Go through all test objects in the array to find the one matching decodedTestName
  let testDetails = null;
  service.tests.forEach((testGroup) => {
    const foundTest = Object.entries(testGroup).find(
      ([testName]) => testName === decodedTestName
    );
    if (foundTest) {
      testDetails = foundTest[1];
    }
  });

  if (!testDetails) {
    return <div className="not-found-message">Test not found!</div>;
  }

  const TestIcon = iconMap[testDetails.icon];

  return (
    <>
      <div className="single-test-page-container">
        <div className="test-header">
          {TestIcon && <TestIcon size={60} color="#9900ff" />}
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
          <button className="cta-button book-now">Book Test</button>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
};

export default SingleTest;
