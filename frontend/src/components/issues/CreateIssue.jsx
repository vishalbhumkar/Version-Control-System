import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./createIssue.css";

const CreateIssue = () => {
  const { id } = useParams(); // repo ID
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `44.193.25.58:3001/issue/create/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create issue");
        setLoading(false);
        return;
      }

      setSuccess("Issue created successfully!");

      // redirect back to repo after 1 sec
      setTimeout(() => {
        navigate(`/repo/${id}`);
      }, 1000);

    } catch (err) {
      console.error(err);
      setError("Server error");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="issue-page">
        <div className="issue-container">
          <div className="issue-header">
            <h1>Create Issue</h1>
            <p>Create a new issue for this repository</p>
          </div>

          <form className="issue-form" onSubmit={handleSubmit}>
            {/* Title */}
            <div className="issue-form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter issue title"
              />
            </div>

            {/* Description */}
            <div className="issue-form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe the issue..."
                rows="5"
              />
            </div>

            {/* Status */}
            <div className="issue-form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Messages */}
            {error && <div className="issue-error">{error}</div>}
            {success && <div className="issue-success">{success}</div>}

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Issue"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateIssue;
