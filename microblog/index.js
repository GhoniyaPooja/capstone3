"use strict";

document.addEventListener('DOMContentLoaded', async () => {
    const usernameElement = document.querySelector("#username");
    const bioElement = document.querySelector("#bio");
    const editBioBtn = document.querySelector("#editBioBtn");
    const modal = document.getElementById("editBioModal");
    const bioTextarea = document.getElementById("bioTextarea");
    const saveBioBtn = document.getElementById("saveBioBtn");
    const logoutButton = document.getElementById("logoutButton");
    const postsBtn = document.querySelector('.profile-tabs button'); 
    const profileContent = document.querySelector('.profile-content');

    const baseURL = 'http://microbloglite.us-east-2.elasticbeanstalk.com';
    const loginData = getLoginData();
    if (!loginData.token) {
        window.location.replace('../account/login.html');
        return;
    }

    let loggedInUsername = '';

    try {
        // Fetch user data to display in profile
        const userResponse = await fetch(`${baseURL}/api/users/${loginData.username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${loginData.token}`,
                'Content-Type': 'application/json'
            }
        });

      

        const userData = await userResponse.json();
        loggedInUsername = userData.username; // Store the logged-in user's username
        displayProfile(userData);

        // Edit Bio button functionality
        editBioBtn.addEventListener('click', () => {
            bioTextarea.value = bioElement.textContent.replace('Bio: ', '');
            modal.style.display = "block";
        });

        // Close modal on click outside
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };

        // Save Bio button 
        saveBioBtn.addEventListener('click', async () => {
            const newBio = bioTextarea.value;

            try {
                // Update user bio
                const updateResponse = await fetch(`${baseURL}/api/users/${loginData.username}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${loginData.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ Bio: newBio })
                });


                bioElement.textContent = `Bio: ${newBio}`;
                modal.style.display = "none";
            } catch (error) {
                console.error('Error updating bio:', error);
                alert('Failed to update bio. Please try again.');
            }
        });

        // Fetch and display posts when "Posts" button is clicked
        postsBtn.addEventListener('click', async () => {
            try {
                const postsResponse = await fetch(`${baseURL}/api/posts`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${loginData.token}`,
                        'Content-Type': 'application/json'
                    }
                });


                const postsData = await postsResponse.json();
                const userPosts = postsData.filter(post => post.username === loggedInUsername);
                displayPosts(userPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        });

    } catch (error) {
        console.error('Error fetching user profile:', error);
    }

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('login-data');
        window.location.replace('../microblog/account/home.html');
    });
});

//to login data from localStorage
function getLoginData() {
    const loginJSON = window.localStorage.getItem('login-data');
    return JSON.parse(loginJSON) || {};
}

//to display profile data
function displayProfile(userData) {
    const usernameElement = document.querySelector("#username");
    const bioElement = document.querySelector("#bio");

    usernameElement.textContent = `${userData.username}`; // Display the username
    bioElement.textContent = `Bio: ${userData.Bio || ''}`;
}

//to display posts
function displayPosts(posts) {
    const profileContent = document.querySelector('.profile-content');
    profileContent.innerHTML = ''; // Clear previous content
    if (posts.length === 0) {
        profileContent.innerHTML = '<p>No posts available.</p>';
    } else {
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <p>${post.text}</p>
                <small>Posted on ${new Date(post.createdAt).toLocaleString()}</small>
            `;
            profileContent.appendChild(postElement);
        });
    }
}
