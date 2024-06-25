"use strict"

document.addEventListener('DOMContentLoaded', fetchPosts);

async function fetchPosts() {
    const loginData = getLoginData();
    if (!loginData.token) {
        window.location.replace('../microblog/account/home.html');
        return;
    }

    try {
        const response = await fetch(apiBaseURL + '/api/posts/', {
            headers: {
                'Authorization': `Bearer ${loginData.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }

        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

function displayPosts(posts) {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        const postContent = `
            <h3>${post.username}</h3>
            <p>${post.text}</p>
            <time>${new Date(post.createdAt).toLocaleString()}</time>
        `;

        postElement.innerHTML = postContent;
        postsContainer.appendChild(postElement);
    });
}

// Logout
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('login-data');
    window.location.replace('../microblog/account/home.html');
});

