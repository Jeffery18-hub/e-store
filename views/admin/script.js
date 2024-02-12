// fetch user data from server
const BASE_USER_URL = 'http://localhost:3000/api/user';

fetch(`${BASE_USER_URL}/admin`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.localStorage.getItem('token')}`
    }
})
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        const adminContainer = document.getElementById('admin-container');
        for(let user of data.users) {
            const div = document.createElement('div');
            div.style.border = '1px solid black';
            div.innerHTML = `
                <h4>${`username: ${user.username}`}</h4>
                <p>${`email: ${user.email}`}</p>
                <p>${`likes: ${user.likes.length}`}</p>
                <p>${`id: ${user._id}`}</p> 
            `
            adminContainer.append(div);
        }
    })
    .catch((err) => {
        // alert(err.message);
        console.log(err.message);
    })