// Frontend Script (script.js)

document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message); // Show success message
        } else {
            alert('Registration failed: ' + result.message); // Show error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.'); // Show generic error
    }
});


// Login Form Submit
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const result = await response.json();
    document.getElementById('loginMessage').textContent = result.message;

    // If login is successful and user is approved
    if (result.status === 'approved') {
        window.location.href = 'dashboard.html'; // Redirect to the dashboard
    }
});

// Fetch Pending Users for Admin Dashboard
async function fetchPendingUsers() {
    const response = await fetch('http://localhost:3000/admin/pending-users');
    const users = await response.json();

    const tableBody = document.querySelector('#pendingUsersTable tbody');
    tableBody.innerHTML = ''; // Clear table

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="approveUser(${user.id})">Approve</button>
                <button onclick="rejectUser(${user.id})">Reject</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Approve User
async function approveUser(userId) {
    await fetch(`http://localhost:3000/admin/approve-user/${userId}`, {
        method: 'POST'
    });
    fetchPendingUsers(); // Refresh list after action
}

// Reject User
async function rejectUser(userId) {
    await fetch(`http://localhost:3000/admin/reject-user/${userId}`, {
        method: 'POST'
    });
    fetchPendingUsers(); // Refresh list after action
}

// Initial call to fetch pending users
if (document.getElementById('pendingUsersTable')) {
    fetchPendingUsers();
}
