document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const fullName = document.getElementById('fullName').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

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
                if (response.status === 409) {
                    displayMessage('Username already exists. Please choose another username.', 'danger');
                } else {
                    throw new Error('Registration failed');
                }
            } else {
                registerForm.reset();
                displayMessage('Registration successful!', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html'; 
                }, 2000); // Delay before (2 seconds)
            }
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
