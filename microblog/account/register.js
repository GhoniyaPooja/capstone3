"use strict"
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const fullName = document.getElementById('fullName').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!fullName || !username || !password) {
            displayMessage('Please fill out all fields.', 'danger');
            return;
        }

        try {
            const response = await fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName: fullName,
                    username: username,
                    password: password
                })
            });

           
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }
                registerForm.reset();
                displayMessage('Registration successful!', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html'; 
                }, 2000); //Delay
            
        } catch (error) {
            console.error('Error during registration:', error);
            displayMessage('Registration failed. Please try again later.', 'danger');
        }
    });

    function displayMessage(message, type) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
    }
});
