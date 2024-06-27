"use strict";

document.addEventListener("DOMContentLoaded", fetchPosts);

async function fetchPosts() {
  const loginData = getLoginData();
  if (!loginData.token) {
    window.location.replace("../microblog/account/home.html");
    return;
  }

  try {
    const response = await fetch(apiBaseURL + "/api/posts/", {
      headers: {
        Authorization: `Bearer ${loginData.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const posts = await response.json();
    displayPosts(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

function displayPosts(posts) {
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");

    const postContent = `
 <img src="https://www.nicepng.com/png/full/933-9332131_profile-picture-default-png.png" alt="Profile Picture">
            <div class="post-content">
                <div class="post-header">
                    <h3>${post.username}</h3>
                    <p>${post.text}</p>
                    <time datetime="${post.createdAt}">${new Date(
      post.createdAt
    ).toLocaleString()}</time>
                </div>
                

            <div class="post-actions">
                    <button>Like</button>
                    <button>Comment</button>
                </div>
        `;

    postElement.innerHTML = postContent;
    postsContainer.appendChild(postElement);
  });
}

// Logout
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("login-data");
  window.location.replace("../microblog/account/home.html");
});
