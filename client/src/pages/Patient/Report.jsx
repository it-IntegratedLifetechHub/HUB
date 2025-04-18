import React, { useState, useEffect } from "react";
import BottomNavigation from "../../components/BottomNav";
import { FaDownload, FaShareAlt, FaHistory, FaFileAlt } from "react-icons/fa";
import { MdOutlineNewReleases } from "react-icons/md";
import SampleReport from "../../assets/sampleReport.pdf";
import toast, { Toaster } from "react-hot-toast";

const Report = () => {
  const [reportType, setReportType] = useState("new");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const reportsData = {
    new: [
      {
        name: "Complete Blood Count - Jan 2025",
        file: SampleReport,
        date: "2025-01-15",
        type: "Hematology",
      },
      {
        name: "Liver Function Test - Dec 2024",
        file: SampleReport,
        date: "2024-12-10",
        type: "Biochemistry",
      },
    ],
    old: [
      {
        name: "Vitamin D Report - June 2024",
        file: SampleReport,
        date: "2024-06-22",
        type: "Immunology",
      },
      {
        name: "Thyroid Panel - March 2024",
        file: SampleReport,
        date: "2024-03-05",
        type: "Endocrinology",
      },
      {
        name: "Lipid Profile - Feb 2024",
        file: SampleReport,
        date: "2024-02-18",
        type: "Biochemistry",
      },
    ],
  };

  const filteredReports = reportsData[reportType].filter(
    (report) =>
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShare = async (fileName, fileUrl) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: fileName,
          text: `Check out my medical report: ${fileName}`,
          url: fileUrl,
        });
        toast.success("Report shared successfully!");
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(fileName);
        toast.success("Report name copied to clipboard!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Sharing failed. Please try again.");
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="report-container">
        <div className="page-header">
          <h1 className="page-title">
            {reportType === "new" ? <MdOutlineNewReleases /> : <FaHistory />}
            My {reportType === "new" ? "Recent" : "Historical"} Reports
          </h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="toggle-container">
          <button
            className={`toggle-btn ${reportType === "new" ? "active" : ""}`}
            onClick={() => {
              setReportType("new");
              setSearchTerm("");
            }}
          >
            Recent Reports
          </button>
          <button
            className={`toggle-btn ${reportType === "old" ? "active" : ""}`}
            onClick={() => {
              setReportType("old");
              setSearchTerm("");
            }}
          >
            Historical Reports
          </button>
        </div>

        <div className="reports-grid">
          {filteredReports.length > 0 ? (
            filteredReports.map((report, index) => (
              <div key={index} className="report-card">
                <div className="report-header">
                  <FaFileAlt className="report-icon" />
                  <div>
                    <p className="report-name">{report.name}</p>
                    <div className="report-meta">
                      <span className="report-type">{report.type}</span>
                      <span className="report-date">
                        {formatDate(report.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="report-actions">
                  <a
                    href={report.file}
                    download
                    className="download-btn"
                    aria-label={`Download ${report.name}`}
                  >
                    <FaDownload /> Download
                  </a>
                  <button
                    className="share-btn"
                    onClick={() => handleShare(report.name, report.file)}
                    aria-label={`Share ${report.name}`}
                  >
                    <FaShareAlt /> Share
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No {reportType} reports found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: "12px",
            padding: "16px",
            fontSize: "14px",
          },
        }}
      />

      <BottomNavigation />

      <style jsx="true">{`
        .report-container {
          max-width: 1000px;
          margin: 30px auto 100px auto;
          padding: 20px;

          font-family: "Outfit", -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .page-header {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #5e0d97;
          text-align: center;
        }

        .search-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        .search-input {
          width: 100%;
          padding: 12px 20px;
          border: 2px solid #e0e0e0;
          border-radius: 30px;
          font-size: 16px;
          transition: all 0.3s ease;
          outline: none;
        }

        .search-input:focus {
          border-color: #9900ff;
          box-shadow: 0 0 0 3px rgba(153, 0, 255, 0.2);
        }

        .toggle-container {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .toggle-btn {
          padding: 10px 24px;
          border: 2px solid #9900ff;
          border-radius: 30px;
          background: transparent;
          color: #9900ff;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .toggle-btn.active {
          background: #9900ff;
          color: white;
          box-shadow: 0 0 15px rgba(153, 0, 255, 0.3);
        }

        .toggle-btn:hover:not(.active) {
          transform: scale(1.05);
          background-color: rgba(153, 0, 255, 0.1);
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
        }

        .report-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.3s, box-shadow 0.3s;
          border: 1px solid #f0f0f0;
        }

        .report-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .report-header {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }

        .report-icon {
          font-size: 24px;
          color: #9900ff;
          margin-top: 3px;
        }

        .report-name {
          font-size: 18px;
          color: #333;
          font-weight: 600;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .report-meta {
          display: flex;
          gap: 15px;
          font-size: 13px;
          color: #666;
        }

        .report-type {
          background: #f0e5ff;
          color: #7b00cc;
          padding: 3px 10px;
          border-radius: 20px;
          font-weight: 500;
        }

        .report-date {
          display: flex;
          align-items: center;
        }

        .report-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .download-btn,
        .share-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          padding: 10px 18px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 14px;
          text-decoration: none;
          flex: 1;
          justify-content: center;
        }

        .download-btn {
          background-color: #2c7a4f;
          color: #fff;
        }

        .download-btn:hover {
          background-color: #25623f;
          transform: scale(1.03);
        }

        .share-btn {
          background-color: #9900ff;
          color: #fff;
        }

        .share-btn:hover {
          background-color: #7c00d1;
          transform: scale(1.03);
        }

        .empty-state {
          text-align: center;
          color: #777;
          padding: 40px 20px;
          grid-column: 1 / -1;
          animation: fadeIn 0.5s ease-in-out;
        }

        .empty-state p {
          font-size: 16px;
          margin-top: 10px;
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

        @media (max-width: 768px) {
          .report-container {
            padding: 15px;
          }

          .page-title {
            font-size: 24px;
          }

          .reports-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .report-card {
            padding: 18px;
          }

          .report-name {
            font-size: 16px;
          }

          .report-actions {
            flex-direction: column;
          }

          .download-btn,
          .share-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default Report;
