import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as BiIcons from "react-icons/bi";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";
import { IoMdTime } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";

const Service = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });

  // Combine all icons into one object
  const allIcons = {
    ...BiIcons,
    ...FaIcons,
    ...GiIcons,
    ...MdIcons,
    ...RiIcons,
    ...FiIcons,
    ...AiIcons,
  };

  // CSS variables for styling
  const cssVariables = {
    "--primary": "#6a0dad",
    "--primary-light": "#9c4dff",
    "--primary-lighter": "#e9d6ff",
    "--primary-dark": "#4a0072",
    "--secondary": "#f3e5ff",
    "--accent": "#ff6f00",
    "--text": "#2d3748",
    "--text-light": "#718096",
    "--light": "#ffffff",
    "--background": "#faf5ff",
    "--card-bg": "#ffffff",
    "--border": "#e2d8ee",
    "--error": "#e53e3e",
    "--success": "#38a169",
  };

  useEffect(() => {
    // Apply CSS variables to root
    Object.entries(cssVariables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: pagination.page,
          limit: pagination.limit,
          ...(searchTerm && { name: searchTerm }),
        });

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/categories?${params}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to load categories");
        }

        setCategories(data.data);
        setLastUpdated(data.timestamp);
        setPagination((prev) => ({
          ...prev,
          total: data.meta.total,
          pages: data.meta.pages,
        }));
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(
          err.message || "Failed to load categories. Please try again later."
        );
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchCategories, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, pagination.page, pagination.limit]);

  const handleAddCategory = () => navigate("/hub/addcat");
  const handleAddTest = (categoryId) => navigate(`/hub/addtest/${categoryId}`);
  const handleEditTest = (categoryId, testId) =>
    navigate(`/hub/categories/${categoryId}/tests/${testId}/edit`);

  const handleDeleteCategory = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category and all its tests?"
      )
    )
      return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      setError({ type: "success", message: "Category deleted successfully" });
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError({ type: "error", message: err.message });
    }
  };

  const handleDeleteTest = async (categoryId, testId) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/categories/${categoryId}/tests/${testId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete test");
      }

      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === categoryId
            ? { ...cat, tests: cat.tests.filter((test) => test._id !== testId) }
            : cat
        )
      );
      setError({ type: "success", message: "Test deleted successfully" });
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError({ type: "error", message: err.message });
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  if (loading && !categories.length) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div className="services-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Diagnostic Services</h1>
            <p className="subtitle">
              Manage your diagnostic categories and tests
              {lastUpdated && (
                <span className="last-updated">
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </span>
              )}
            </p>
          </div>

          <div className="header-actions">
            <div className="search-bar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                  stroke="var(--primary-light)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 21L16.65 16.65"
                  stroke="var(--primary-light)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search categories by name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                disabled={loading}
              />
              {loading && <div className="search-spinner">Loading...</div>}
            </div>

            <button className="primary-btn" onClick={handleAddCategory}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5V19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              New Category
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className={`alert alert-${error.type || "error"}`}>
          <div className="alert-content">
            <svg viewBox="0 0 24 24" width="20" height="20">
              {error.type === "success" ? (
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              ) : (
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                />
              )}
            </svg>
            <span>{error.message}</span>
            <button onClick={() => setError(null)}>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <main className="dashboard-content">
        {categories.length > 0 ? (
          <>
            <div className="categories-grid">
              {categories.map((category) => (
                <div key={category._id} className="category-card">
                  <div className="card-header">
                    <div className="category-info">
                      <div className="category-icon">
                        {allIcons[category.icon] &&
                          React.createElement(allIcons[category.icon])}
                      </div>
                      <div className="category-details">
                        <h3>{category.name}</h3>
                        <p className="category-description">
                          {category.description || "No description"}
                        </p>
                        <div className="category-meta">
                          <span className="test-count">
                            {category.tests?.length || 0} tests
                          </span>
                          {category.createdAt && (
                            <span className="created-date">
                              Created:{" "}
                              {new Date(
                                category.createdAt
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button
                        className="icon-btn accent"
                        onClick={() => handleAddTest(category._id)}
                        title="Add test"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 5V19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5 12H19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      <button
                        className="icon-btn danger"
                        onClick={() => handleDeleteCategory(category._id)}
                        title="Delete category"
                      >
                        <AiOutlineDelete />
                      </button>
                    </div>
                  </div>

                  <div className="tests-section">
                    <h4 className="section-title">Tests</h4>
                    {category.tests?.length > 0 ? (
                      <ul className="tests-list">
                        {category.tests.map((test) => (
                          <li key={test._id} className="test-item">
                            <div className="test-info">
                              <div className="category-icon">
                                {allIcons[test.icon] &&
                                  React.createElement(allIcons[test.icon])}
                              </div>
                              <h5 className="test-name">{test.name}</h5>
                              <div className="test-meta">
                                {test.turnaroundTime && (
                                  <span className="turnaround">
                                    <IoMdTime className="turnaround" />
                                    {test.turnaroundTime}
                                  </span>
                                )}
                                {test.totalCost && (
                                  <span className="cost">
                                    <FaRupeeSign /> ${test.totalCost.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              {test.description && (
                                <p className="test-description">
                                  {test.description}
                                </p>
                              )}
                            </div>
                            <div className="test-actions">
                              <button
                                className="icon-btn danger"
                                onClick={() =>
                                  handleDeleteTest(category._id, test._id)
                                }
                                title="Delete test"
                              >
                                <AiOutlineDelete />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="empty-tests">
                        <svg width="48" height="48" viewBox="0 0 24 24">
                          <path
                            d="M9 3V4M15 3V4M9 17V18M15 17V18M9 12V13M15 12V13M5 7H19C20.1046 7 21 7.89543 21 9V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9C3 7.89543 3.89543 7 5 7Z"
                            stroke="var(--text-light)"
                            strokeWidth="2"
                          />
                        </svg>
                        <p>No tests in this category</p>
                        <button
                          className="text-btn primary"
                          onClick={() => handleAddTest(category._id)}
                        >
                          Add First Test
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </button>
                <div className="page-numbers">
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          className={`pagination-btn ${
                            pagination.page === pageNum ? "active" : ""
                          }`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>
                <button
                  className="pagination-btn"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-content">
              <svg width="80" height="80" viewBox="0 0 24 24">
                <path
                  d="M8 3H6C4.89543 3 4 3.89543 4 5V7M8 3H16M8 3V1M16 3H18C19.1046 3 20 3.89543 20 5V7M16 3V1M4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V7M4 7H20M12 12V15M12 15L15 12M12 15L9 12"
                  stroke="var(--primary-light)"
                  strokeWidth="2"
                />
              </svg>
              <h3>No categories found</h3>
              <p>Create your first category to get started</p>
              <button className="primary-btn" onClick={handleAddCategory}>
                Create Category
              </button>
            </div>
          </div>
        )}
      </main>
      <style jsx>{`
        .services-dashboard {
          min-height: 100vh;
          background-color: var(--background);
          color: var(--text);
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.5;
        }

        .dashboard-header {
          background-color: var(--card-bg);
          padding: 1.5rem 2rem;
          box-shadow: var(--shadow-sm);
          border-bottom: 1px solid var(--border);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .header-text h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--primary-dark);
          margin: 0 0 0.25rem 0;
        }

        .subtitle {
          color: var(--text-light);
          font-size: 0.875rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .last-updated {
          font-size: 0.75rem;
          color: var(--primary-light);
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-bar {
          flex: 1;
          max-width: 500px;
          display: flex;
          align-items: center;
          background: var(--card-bg);
          border-radius: var(--radius-md);
          padding: 0.5rem 1rem;
          border: 1px solid var(--border);
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }

        .search-bar:hover {
          border-color: var(--primary-light);
        }

        .search-bar:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-lighter);
        }

        .search-bar svg {
          margin-right: 0.75rem;
          flex-shrink: 0;
        }

        .search-bar input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.875rem;
          color: var(--text);
          outline: none;
          padding: 0.25rem 0;
        }

        .search-bar input::placeholder {
          color: var(--primary-light);
          opacity: 0.7;
        }

        .primary-btn {
          padding: 0.625rem 1.25rem;
          background-color: var(--primary);
          color: var(--light);
          border: none;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
          box-shadow: var(--shadow-sm);
        }

        .primary-btn:hover {
          background-color: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .primary-btn:active {
          transform: translateY(0);
        }

        .alert {
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          margin: 0 2rem 1rem;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }

        .alert-error {
          background-color: rgba(229, 62, 62, 0.1);
          color: var(--error);
          border: 1px solid rgba(229, 62, 62, 0.2);
        }

        .alert-success {
          background-color: rgba(56, 161, 105, 0.1);
          color: var(--success);
          border: 1px solid rgba(56, 161, 105, 0.2);
        }

        .alert-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .alert-content button {
          margin-left: auto;
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .alert-content button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .dashboard-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.5rem 2rem;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .category-card {
          background-color: var(--card-bg);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: var(--transition);
          border: 1px solid var(--border);
        }

        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-lighter);
        }

        .card-header {
          padding: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .category-info {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .category-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background-color: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1.5rem;
        }

        .category-details {
          flex: 1;
        }

        .category-details h3 {
          color: var(--primary-dark);
          font-size: 1.125rem;
          margin: 0 0 0.25rem 0;
          font-weight: 600;
        }

        .category-description {
          color: var(--text-light);
          font-size: 0.8125rem;
          margin: 0 0 0.5rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .category-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.75rem;
        }

        .test-count {
          color: var(--primary);
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: var(--secondary);
          padding: 0.25rem 0.5rem;
          border-radius: 5px;
        }

        .created-date {
          color: var(--text-light);
          font-size: 0.6875rem;
        }

        .card-actions {
          display: flex;
          gap: 0.5rem;
        }

        .icon {
          color: #6a0dad;
        }

        .icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: var(--transition);
          background-color: transparent;
          color: var(--text-light);
        }

        .icon-btn:hover {
          transform: scale(1.1);
        }

        .icon-btn.primary {
          color: var(--primary);
        }

        .icon-btn.primary:hover {
          background-color: rgba(106, 13, 173, 0.1);
        }

        .icon-btn.accent {
          color: var(--accent);
        }

        .icon-btn.accent:hover {
          background-color: rgba(255, 111, 0, 0.1);
        }

        .icon-btn.danger {
          color: var(--error);
        }

        .icon-btn.danger:hover {
          background-color: rgba(229, 62, 62, 0.1);
        }

        .tests-section {
          padding: 1rem 1.25rem;
        }

        .section-title {
          font-size: 0.8125rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-light);
          margin: 0 0 0.75rem 0;
        }

        .tests-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .test-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          background-color: var(--background);
          transition: var(--transition);
          gap: 0.75rem;
        }

        .test-item:hover {
          background-color: var(--secondary);
        }

        .test-info {
          flex: 1;
        }

        .test-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text);
          margin: 0 0 0.25rem 0;
        }

        .test-meta {
          display: flex;
          gap: 0.75rem;
          font-size: 0.75rem;
          color: var(--text-light);
        }

        .test-meta svg {
          margin-right: 0.25rem;
        }

        .turnaround {
          display: inline-flex;
          align-items: center;
        }

        .turnaround svg {
          color: #6a0dad;
        }

        .cost {
          display: inline-flex;
          align-items: center;
        }

        .cost svg {
          color: #6a0dad;
        }

        .test-description {
          font-size: 0.75rem;
          color: var(--text-light);
          margin: 0.25rem 0 0 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .test-actions {
          display: flex;
          gap: 0.25rem;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .test-item:hover .test-actions {
          opacity: 1;
        }

        .empty-tests {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px dashed var(--border);
          border-radius: var(--radius-md);
          background-color: var(--background);
        }

        .empty-tests svg {
          margin-bottom: 0.75rem;
          opacity: 0.5;
        }

        .empty-tests p {
          color: var(--text-light);
          font-size: 0.875rem;
          margin: 0 0 1rem 0;
        }

        .text-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .text-btn:hover {
          background-color: rgba(106, 13, 173, 0.1);
        }

        .text-btn.primary {
          color: var(--primary);
        }

        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          text-align: center;
        }

        .empty-content {
          max-width: 400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .empty-state h3 {
          color: var(--primary-dark);
          font-size: 1.25rem;
          margin: 1rem 0 0.5rem;
        }

        .empty-state p {
          color: var(--text-light);
          font-size: 0.875rem;
          margin: 0 0 1.5rem;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .pagination-btn {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border);
          background-color: var(--card-bg);
          color: var(--text);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.8125rem;
        }

        .pagination-btn:hover:not(:disabled) {
          background-color: var(--primary-lighter);
          border-color: var(--primary-light);
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-btn.active {
          background-color: var(--primary);
          color: var(--light);
          border-color: var(--primary);
        }

        .page-numbers {
          display: flex;
          gap: 0.25rem;
        }

        .ellipsis {
          display: flex;
          align-items: center;
          padding: 0 0.5rem;
          color: var(--text-light);
        }

        @media (max-width: 768px) {
          .dashboard-header {
            padding: 1rem;
          }

          .dashboard-content {
            padding: 1rem;
          }

          .header-actions {
            flex-direction: column;
          }

          .search-bar {
            max-width: 100%;
          }

          .categories-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .card-header {
            flex-direction: column;
          }

          .card-actions {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default Service;
