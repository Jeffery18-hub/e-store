const BASE_USER_URL = 'http://localhost:3000/api/user';

// check if user is logged in
// get token from local storage
let isLoggedIn;
const token = window.localStorage.getItem('token');
if (token) {
    verifyJWT(token).then((res) => {
        isLoggedIn = res;
        if (isLoggedIn) {
            window.location.href = '/';
        }
    });
}

async function verifyJWT(token) {
    const response = await fetch(`${BASE_USER_URL}/verifyJWT`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    console.log(data);
    if (data.message === 'user verified') {
        return true;
    }
    return false;
}

// select needed elements
const form = document.getElementById('signup-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const emailInput = document.getElementById('email');

function validateForm(username, password, email) {
    // validate inputs on the frondend
    // Check the username pattern
    const usernamePattern = /^\w+$/;
    if (!usernamePattern.test(username)) {
        alert('Username is not valid.');
        return false;
    }

    // Check the email pattern
    const emailPattern = /^[^@]+@\w+(\.\w+)+$/;
    if (!emailPattern.test(email)) {
        alert('Email is not valid.');
        return false;
    }

    // Check the password pattern
    const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,10}/;
    if (!passwordPattern.test(password)) {
        alert('Password is not valid.');
        return false;
    }

    return true;
}

const handleSubmit = (e) => {
    e.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;
    const email = emailInput.value;

    // validate inputs on the frondend
    const isValid = validateForm(username, password, email);
    // console.log(isValid)

    if (!isValid) {
        alert('Malformed Inputs for Signing Up');
        return;
    }

    console.log(email, username, password);

    fetch(`${BASE_USER_URL}/register`, {
        method: 'POST',
        headers: {
            // must specify content-type if you used express.urlencoded() middleware
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password,
        }),
    })
        .then((res) => {
            if (!res.ok) {
                alert('Error Signing Up');
                return;
            }
            return res.json();
        })
        .then(({ token }) => {
            // after signup, set the token and username to the localStorage, you don't have to set the username in localStorage, it is just for display purposes
            window.localStorage.setItem('token', token);
            // window.localStorage.setItem('username', username);
        })
        .then(() => (window.location.href = '/')) // after setting everything in localStorage, redirect to home page
        .catch((err) => {
            alert(err.message);
        });
};

form.addEventListener('submit', handleSubmit);
