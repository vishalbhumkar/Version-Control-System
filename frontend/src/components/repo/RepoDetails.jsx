
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./repoDetails.css";

const RepoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repo, setRepo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [activeIssue, setActiveIssue] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  // ================= REPO =================
  const fetchRepo = async () => {
    const res = await fetch(`44.193.25.58:3001/repo/${id}`);
    const data = await res.json();
    const repoData = Array.isArray(data) ? data[0] : data;

    setRepo(repoData);
    setDescription(repoData?.description || "");
    setContent(repoData?.content?.join("\n") || "");
  };

  // ================= ISSUES =================
  const fetchIssues = async () => {
    const res = await fetch(`44.193.25.58:3001/issue/repo/${id}`);
    const data = await res.json();
    setIssues(data);
  };

  useEffect(() => {
    fetchRepo();
    fetchIssues();
  }, [id]);

  // ================= ISSUE ACTIONS =================
  const handleDeleteIssue = async (issueId) => {
    await fetch(`44.193.25.58:3001/issue/delete/${issueId}`, {
      method: "DELETE",
    });
    fetchIssues();
  };

  const handleToggleStatus = async (issue) => {
    await fetch(`44.193.25.58:3001/issue/update/${issue._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: issue.title,
        description: issue.description,
        status: issue.status === "open" ? "closed" : "open",
      }),
    });

    fetchIssues();
  };

  // ================= REPO ACTIONS =================
  const handleUpdate = async () => {
    await fetch(`44.193.25.58:3001/repo/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        content: content.split("\n"),
      }),
    });

    setEditMode(false);
    fetchRepo();
  };

  const handleDelete = async () => {
    await fetch(`44.193.25.58:3001/repo/delete/${id}`, {
      method: "DELETE",
    });
    navigate("/");
  };

  const handleToggle = async () => {
    await fetch(`44.193.25.58:3001/repo/toggle/${id}`, {
      method: "PATCH",
    });
    fetchRepo();
  };

  if (!repo) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="repo-layout">
        {/* ================= LEFT: REPO ================= */}
        <div className="repo-left">
          <div className="repo-header">
            <h2>{repo.name}</h2>
            <span>{repo.visibility ? "Private" : "Public"}</span>
          </div>

          <p className="repo-owner">
            Owner: {repo.owner?.username || "Unknown"}
          </p>

          {/* Description */}
          <div className="repo-section">
            <h3>Description</h3>
            {editMode ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            ) : (
              <p>{repo.description}</p>
            )}
          </div>

          {/* Content */}
          <div className="repo-section">
            <h3>Content</h3>
            {editMode ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            ) : (
              <ul>
                {repo.content?.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Buttons */}
          <div className="repo-actions">
            <button onClick={() => setEditMode(!editMode)}>
              {editMode ? "Cancel" : "Edit"}
            </button>

            {editMode && <button onClick={handleUpdate}>Update</button>}

            <button onClick={handleToggle}>Toggle Visibility</button>
            <button onClick={handleDelete} className="delete-btn">
              Delete Repo
            </button>

            <button onClick={() => navigate(`/repo/${id}/create-issue`)}>
              Create Issue
            </button>
          </div>
        </div>

        {/* ================= RIGHT: ISSUES ================= */}
        <div className="repo-right">
          <h3>Issues</h3>

          {issues.length === 0 ? (
            <p>No issues found</p>
          ) : (
            issues.map((issue) => (
              <div key={issue._id} className="issue-card">
                <div
                  className="issue-header"
                  onClick={() =>
                    setActiveIssue(
                      activeIssue === issue._id ? null : issue._id
                    )
                  }
                >
                  <span className="issue-title">{issue.title}</span>

                  <div className="issue-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(issue);
                      }}
                    >
                      {issue.status === "open" ? "Close" : "Open"}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteIssue(issue._id);
                      }}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Expand animation */}
                <div
                  className={`issue-body ${
                    activeIssue === issue._id ? "show" : ""
                  }`}
                >
                  <p>{issue.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default RepoDetails;
