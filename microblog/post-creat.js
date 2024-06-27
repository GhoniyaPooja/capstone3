"use strict"


document.getElementById('createPostForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const postContent = document.getElementById('postContent').value.trim();
    
    
    if (postContent === '') {
      alert('Please enter some content for your post.');
      return;
    }
    
    const loginData = getLoginData();
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        text: postContent
      })
    };
    
    fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts', options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create post.');
        }
        return response.json();
      })
      .then(data => {
        window.location.href = 'posts/posts.html';
      })
      .catch(error => {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
      });
  });

  
  //to login data from localStorage
  function getLoginData() {
    const loginJSON = window.localStorage.getItem('login-data');
    return JSON.parse(loginJSON) || {};
  }
  

  // Logout 
  logoutButton.addEventListener("click", (e) => {
    e.preventDefault()
  logout()
});

