import React, { useState } from "react";
import BottomNavigation from "../../components/BottomNav";
import { FaDownload, FaShareAlt } from "react-icons/fa";
import SampleReport from "../../assets/sampleReport.pdf";
import toast, { Toaster } from "react-hot-toast";

const Report = () => {
  const [reportType, setReportType] = useState("new");

  const reportsData = {
    new: [
      { name: "CBC Report - Jan 2025", file: SampleReport },
      { name: "Liver Function Test - Dec 2024", file: SampleReport },
    ],
    old: [
      { name: "Vitamin D Report - June 2024", file: SampleReport },
      { name: "Thyroid Panel - March 2024", file: SampleReport },
    ],
  };

  const handleShare = (fileName, fileUrl) => {
    if (navigator.share) {
      navigator
        .share({
          title: fileName,
          text: `Check out this medical report: ${fileName}`,
          url: fileUrl,
        })
        .then(() => toast.success("Report shared successfully!"))
        .catch((error) => {
          console.error("Error sharing:", error);
          toast.error("Sharing failed. Please try again.");
        });
    } else {
      toast("Web Share API not supported on this device.", {
        icon: "ℹ️",
      });
    }
  };

  return (
    <>
      <div className="report-container">
        <h1 className="page-title">My Reports</h1>

        <div className="toggle-container">
          <button
            className={`toggle-btn ${reportType === "new" ? "active" : ""}`}
            onClick={() => setReportType("new")}
          >
            New Reports
          </button>
          <button
            className={`toggle-btn ${reportType === "old" ? "active" : ""}`}
            onClick={() => setReportType("old")}
          >
            Old Reports
          </button>
        </div>

        <div className="reports-grid">
          {reportsData[reportType].length > 0 ? (
            reportsData[reportType].map((report, index) => (
              <div key={index} className="report-card">
                <p className="report-name">{report.name}</p>
                <div className="report-actions">
                  <a href={report.file} download className="download-btn">
                    <FaDownload /> Download
                  </a>
                  <button
                    className="share-btn"
                    onClick={() => handleShare(report.name, report.file)}
                  >
                    <FaShareAlt /> Share
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No {reportType} reports found.</p>
            </div>
          )}
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />

      <BottomNavigation />
    </>
  );
};

export default Report;
