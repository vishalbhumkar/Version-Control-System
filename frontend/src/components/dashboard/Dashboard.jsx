import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]); // user repos
  const [suggestedRepositories, setSuggestedRepositories] = useState([]); // all repos
  const [isExpanded, setIsExpanded] = useState(false);

  // 🔹 LEFT SEARCH (user repos)
  const [userSearch, setUserSearch] = useState("");
  const [userSearchResults, setUserSearchResults] = useState([]);

  // 🔹 CENTER SEARCH (global repos)
  const [globalSearch, setGlobalSearch] = useState("");
  const [globalResults, setGlobalResults] = useState([]);
  const [filteredRecentRepos, setFilteredRecentRepos] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/auth");
      return;
    }

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `https://vcs-69so.onrender.com/repo/user/${userId}`,
        );
        const data = await response.json();
        setRepositories(data.repositories || []);
        setUserSearchResults(data.repositories || []);
      } catch (err) {
        console.error("Error fetching user repos:", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`https://vcs-69so.onrender.com/repo/all`);
        const data = await response.json();
        const publicRepos = (data || []).filter((repo) => !repo.visibility);
        setSuggestedRepositories(publicRepos);
      } catch (err) {
        console.error("Error fetching all repos:", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, [navigate]);

  // ✅ LEFT SEARCH FILTER (USER REPOS)
  useEffect(() => {
    if (!userSearch.trim()) {
      setUserSearchResults(repositories);
    } else {
      const filtered = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(userSearch.toLowerCase()),
      );
      setUserSearchResults(filtered);
    }
  }, [userSearch, repositories]);

  // ✅ GLOBAL SEARCH (API CALL)
  useEffect(() => {
    const fetchGlobalSearch = async () => {
      if (!globalSearch.trim()) {
        setFilteredRecentRepos([]);
        return;
      }

      // Filter local recent repositories to only show public repositories
      const filtered = suggestedRepositories.filter(
        (repo) =>
          !repo.visibility &&
          (repo.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
            (repo.description &&
              repo.description
                .toLowerCase()
                .includes(globalSearch.toLowerCase())))
      );
      setFilteredRecentRepos(filtered);
    };

    const delayDebounce = setTimeout(() => {
      fetchGlobalSearch();
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [globalSearch, suggestedRepositories]);

  return (
    <>
      <Navbar />

      <section id="dashboard">
        {/* 🔹 LEFT SIDEBAR */}
        <aside className="left-aside">
          <div>
            <div className="left-header">
              <h3>User repositories</h3>
              <Link to="/create" className="new-repo-btn">
                New
              </Link>
            </div>

            <div className="search-main">
              <input
                type="text"
                value={userSearch}
                placeholder="Find your repository..."
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            <div className="repo-list">
              {userSearchResults.map((repo) => (
                <div
                  key={repo._id}
                  className="repo-item"
                  onClick={() => navigate(`/repo/${repo._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    className="repo-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <span>{repo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* 🔹 MAIN CONTENT */}
        <main className="main-content">
          <div className="feed-header">
            <h2>Recent repositories</h2>
          </div>

          {/* 🔥 GLOBAL SEARCH */}
          <div className="search-main">
            <input
              type="text"
              value={globalSearch}
              placeholder="Search all repositories..."
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </div>

          {/* 🔥 SEARCH RESULTS */}
          {globalSearch && (
            <div className="suggested-section expanded">
              {filteredRecentRepos.length > 0 ? (
                filteredRecentRepos.map((repo) => (
                  <div
                    key={repo._id}
                    className="repo-card"
                    onClick={() => navigate(`/repo/${repo._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="repo-card-header">
                      <h4>{repo.name}</h4>
                    </div>
                    <div className="repo-card-description">
                      <p>{repo.description || "No description available"}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-results">No repositories found</p>
              )}
            </div>
          )}

          {/* 🔥 TRENDING */}
          {!globalSearch && (
            <>
              <div className={`suggested-section ${isExpanded ? "expanded" : ""}`}>
                {suggestedRepositories.slice(0, isExpanded ? suggestedRepositories.length : 3).map((repo) => (
                  <div
                    key={repo._id}
                    className="repo-card"
                    onClick={() => navigate(`/repo/${repo._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="repo-card-header">
                      <h4>{repo.name}</h4>
                    </div>
                    <div className="repo-card-description">
                      <p>{repo.description || "No description available"}</p>
                    </div>
                  </div>
                ))}
              </div>

              {!isExpanded && suggestedRepositories.length > 3 && (
                <button
                  className="more-btn"
                  onClick={() => setIsExpanded(true)}
                >
                  More
                </button>
              )}
            </>
          )}
        </main>

        {/* 🔹 RIGHT SIDEBAR */}
        <aside className="right-aside">
          <div className="event-box">
            <h3>Upcoming Events</h3>
            <ul>
              <li>
                <p>Tech Conference - Dec 15</p>
              </li>
              <li>
                <p>Developer Meetup - Dec 25</p>
              </li>
              <li>
                <p>React Summit - Jan 5</p>
              </li>
              <li>
                <p>Web Dev Workshop - Jan 12</p>
              </li>
              <li>
                <p>JavaScript Bootcamp - Jan 20</p>
              </li>
              <li>
                <p>AI & ML Conference - Feb 1</p>
              </li>
              <li>
                <p>DevOps Summit - Feb 14</p>
              </li>
              <li>
                <p>Cloud Technologies - Feb 28</p>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
