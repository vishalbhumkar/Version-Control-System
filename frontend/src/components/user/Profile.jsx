import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon, PersonIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authcontext";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const { setCurrentUser } = useAuth();
  const [repositories, setRepositories] = useState([]);

 useEffect(() => {
  const userId = localStorage.getItem("userId");

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/userProfile/${userId}`
      );
      setUserDetails(response.data);
    } catch (err) {
      console.error("Cannot fetch user details: ", err);
    }
  };

  const fetchUserRepos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/repo/user/${userId}`
      );
      setRepositories(response.data.repositories);
    } catch (err) {
      console.error("Cannot fetch repositories: ", err);
    }
  };

  if (userId) {
    fetchUserDetails();
    fetchUserRepos();
  }
}, []);

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <div className="profile-top-nav">
          <UnderlineNav aria-label="Profile">
            <UnderlineNav.Item icon={BookIcon} aria-current="page">
              Overview
            </UnderlineNav.Item>
            <UnderlineNav.Item icon={RepoIcon}>Repositories</UnderlineNav.Item>
          </UnderlineNav>
        </div>

        <div className="profile-page-wrapper">
          <aside className="user-profile-section">
            <div className="profile-image-wrapper">
              {/* <img
                className="profile-image"
                src={
                  userDetails?.avatar ||
                  "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                }
                alt={userDetails?.username || "profile"}
              /> */}
              <div className="profile-image">
                <PersonIcon size={64} />
              </div>
            </div>

            <div className="user-meta">
              <h2 className="display-name">{userDetails?.username || "User"}</h2>
              <p className="user-name">
                @{userDetails?.name || "Owner"}
              </p>
            </div>

            <button className="follow-btn">Follow</button>

            <div className="follower">
              <span>
                <strong>10</strong> Followers
              </span>
              <span>
                <strong>3</strong> Following
              </span>
            </div>
          </aside>

          <main className="user-repo-section">
            {/* <section className="popular-section">
              <div className="section-header">
                <h3>Popular repositories</h3>
              </div>

              <div className="repo-card-wrapper">
                <div className="repo-card-wrapper">
  {repositories.length === 0 ? (
    <p>No repositories found</p>
  ) : (
    repositories.map((repo) => (
      <div className="repo" key={repo._id}>
        <div className="repo-top">
          <h4 className="repo-name">{repo.name}</h4>
          <span className="repo-badge">
            {repo.visibility ? "Private" : "Public"}
          </span>
        </div>
        <p className="description">
          {repo.description || "No description"}
        </p>
      </div>
    ))
  )}
</div>

                
              </div>
            </section> */}
            <section className="popular-section">
  <div className="section-header">
    <h3>Popular repositories</h3>
  </div>

  <div className="repo-card-wrapper">
    {repositories.length === 0 ? (
      <p className="no-repo-text">No repositories found</p>
    ) : (
      repositories.map((repo) => (
        <div className="repo" key={repo._id}>
          <div className="repo-top">
            {/* <h4 className="repo-name">{repo.name}</h4>  */}
            {/* comment to implement logics for repository clickable */}
            <h4
                  className="repo-name"
                  onClick={() => navigate(`/repo/${repo._id}`)}
                >
                  {repo.name}
                </h4>
            <span className="repo-badge">
              {repo.visibility ? "Private" : "Public"}
            </span>
          </div>
          <p className="description">
            {repo.description || "No description"}
          </p>
        </div>
      ))
    )}
  </div>
</section>

            <div className="heatmap-section">
              <h3 className="heatmap-title">Contribution activity</h3>
              <div className="heatmap-container">
                <HeatMapProfile userId={localStorage.getItem("userId")} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Profile;


