const BASE_USER_URL = 'http://localhost:3000/api/user';

// check if user is logged in
// get token from local storage
let isLoggedIn;
const token = window.localStorage.getItem('token');
if(token) {
    verifyJWT(token).then((res) => {
    isLoggedIn = res;
    if(isLoggedIn) {
      window.location.href = '/';
    } 
  })
}

async function verifyJWT(token) {
  const response = await fetch(`${BASE_USER_URL}/verifyJWT`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  const data = await response.json();
  console.log(data);
  if(data.message === 'user verified') {
    return true;
  }
  return false;
}


// select needed elements
const form = document.getElementById('login-form');
const loginMethod = document.getElementById('login-method');
const usernameInput = document.getElementById('username-input');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');

if(loginMethod) {
  loginMethod.addEventListener('change', (e) => {
    if(e.target.value === 'email') {
      // console.log('email');
      usernameInput.style.display = 'none';
      emailInput.style.display = 'inline';
    } else {
      // console.log('username');
      emailInput.style.display = 'none';
      usernameInput.style.display = 'inline';
    }
  })
}

function validateForm(username, password, email) {
  // validate inputs on the frondend
    // Check the username pattern
    const usernamePattern = /^\w+$/;
    if (username && !usernamePattern.test(username)) {
      alert('Username is not valid.');
      return false;
    }

    // Check the email pattern
    const emailPattern = /^[^@]+@\w+(\.\w+)+$/;
    if (email && !emailPattern.test(email)) {
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

  // TODO: validate inputs on the frondend
  // if (!validateForm(username, password, email)) {
  //   alert('Malformed Inputs for Logging In');
  //   return;
  // }

  fetch(`${BASE_USER_URL}/login`, {
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
        alert('Error Logging In');
        return;
      }
      return res.json();
    })
    .then((data) => {
      // after login, set the token and username to the localStorage, you don't have to set the username in localStorage, it is just for display purposes
      window.localStorage.setItem('token', data.token);
      if(data.isAdmin) {
        window.location.href = '/admin';
      }else{
        window.location.href = '/';
      }
    })
    // .then(() => (window.location.href = '/')) // after setting everything in localStorage, redirect to home page
    .catch((err) => {
      alert(err.message);
    });
};

form.addEventListener('submit', handleSubmit);
