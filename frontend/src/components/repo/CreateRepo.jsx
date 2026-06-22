import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./createRepo.css";

const CreateRepo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    content: "",
    issues: "",
    visibility: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createdRepoId, setCreatedRepoId] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? e.target.checked : value;

    setFormData({
      ...formData,
      [name]: val,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Convert comma-separated issues into array
      const issuesArray = formData.issues
        ? formData.issues.split(",").map((id) => id.trim())
        : [];

      const response = await fetch("http://localhost:3001/repo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          owner: userId,
          visibility: formData.visibility,
          content: formData.content ? [formData.content] : [],
          issues: issuesArray,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Repository created successfully!");
        setCreatedRepoId(data.repositoryID);

        // optional redirect after 2 sec
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(data.error || "Failed to create repository");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="repo-page">
        <div className="repo-container">
          <div className="repo-header">
            <h1>Create a new repository</h1>
            <p>
              A repository contains your project files, description, visibility,
              and linked issue references.
            </p>
          </div>

          <form className="repo-form" onSubmit={handleSubmit}>
            <div className="repo-form-group">
              <label>Repository Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter repository name"
                required
              />
            </div>

            <div className="repo-form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a short description"
              />
            </div>

            <div className="repo-form-group">
              <label>Initial Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Add initial content or file text"
              />
              <small>This will be stored as an array in backend</small>
            </div>

            <div className="repo-form-group">
              <label>Issue IDs</label>
              <input
                type="text"
                name="issues"
                value={formData.issues}
                onChange={handleChange}
                placeholder="Comma separated issue IDs"
              />
            </div>

            <div className="repo-form-group repo-visibility-group">
              <label>Private Repository</label>
              <input
                type="checkbox"
                name="visibility"
                checked={formData.visibility}
                onChange={handleChange}
              />
            </div>

            {error && <div className="repo-message error-message">{error}</div>}

            {successMessage && (
              <div className="repo-message success-message">
                <p>{successMessage}</p>
                {createdRepoId && <p>ID: {createdRepoId}</p>}
              </div>
            )}

            <button
              type="submit"
              className="repo-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Repository"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRepo;