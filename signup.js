async function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please fill out all fields.');
        return;
    }

    const signupData = {
        email,
        password
    };

    try {
        const response = await fetch('http://localhost:5000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        });

        if (response.ok) {
            localStorage.setItem('signedUp', 'true');
            window.location.href = 'login.html';
        } else {
            alert('Failed to signup. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while signing up. Please try again.');
    }
}
