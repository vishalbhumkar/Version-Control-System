import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authcontext.jsx";
import axios from "axios";
import "./navbar.css";

const Navbar = () => {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔍 Handle Search
  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await axios.get(
        `https://vcs-69so.onrender.com/user/name/${value}`
      );

      setResults(res.data);
      setShowDropdown(true);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        <Link to="/" className="nav-link-group">
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
            className="nav-logo"
          />
          <h3 className="nav-title">Dashboard</h3>
        </Link>
      </div>

      {/* CENTER SEARCH */}
      <div className="nav-search-container">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onFocus={() => search && setShowDropdown(true)}
          className="nav-search"
        />

        {/* 🔥 DROPDOWN */}
        {showDropdown && (
          <div className="search-dropdown">
            {results.length > 0 ? (
              results.map((user) => (
                <div
                  key={user._id}
                  className="search-item"
                  onClick={() => {
                    navigate(`/user/${user._id}`);
                    setShowDropdown(false);
                  }}
                >
                  <span className="search-username">
                    {user.username}
                  </span>
                  <span className="search-email">
                    {user.email}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-results">No users found</div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <Link to="/create" className="nav-icon-link">
          <span className="nav-icon">+</span>
          <p className="nav-text">Create</p>
        </Link>

        <Link to="/profile" className="nav-profile">
          <div className="profile-icon-container">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="person-icon"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </Link>

        <div className="profile-top-actions">
          <button
            onClick={() => {
              localStorage.clear();
              setCurrentUser(null);
              window.location.href = "/auth";
            }}
            id="logout"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
