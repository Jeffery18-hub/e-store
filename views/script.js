const BASE_USER_URL = 'http://localhost:3000/api/user';
const BASE_PRODUCT_URL = 'http://localhost:3000/api/products';
const loginLink = document.getElementById('login-link');
const signupLink = document.getElementById('signup-link');
const favoriteAside = document.getElementById('favorite');
const favoriteList = document.getElementById('favorite-list');
const favoriteLoginHint = document.getElementById('favorite-login-hint');
const favoriteLoginLink = document.getElementById('login-link-aside');
const logoutLink = document.getElementById('logout-link');
const leftBtn = document.getElementById('load-left');
const rightBtn = document.getElementById('load-right');
const confirmBtn = document.getElementById('filter-confirm-btn');
const resetBtn = document.getElementById('filter-reset-btn');
const sonyCB = document.getElementById('sony');
const samsungCB = document.getElementById('samsung');
const lgCB = document.getElementById('lg');
const panasonicCB = document.getElementById('panasonic');
const lenovoCB = document.getElementById('lenovo');
const fridgesCB = document.getElementById('fridges');
const kettlesCB = document.getElementById('kettles');
const televisionsCB = document.getElementById('televisions');
const grid = document.getElementById('3-3-grid');

// check if user is logged in
// const username = window.localStorage.getItem('username');
// const isLoggedIn = username !== null;
// This is a naive implementation of checking whether the user is logged in
// It's better to have a dedicated API in the backend for checking if the token is valid
// The steps are as follows:
// 1. check if token exists in localStorage
// 2. if not, then it means user is not logged in
// 3. if so, make a GET request to the API, append the token in either the header or the cookie. 
//    ex. http://localhost:3000/api/user/verifyToken
// 4. If the response is OK, that means user is logged in.

// get token from local storage
let isLoggedIn;
let token = window.localStorage.getItem('token');
if(!token) {
  logoutDisplay();
}else {
  verifyJWT(token).then((res) => {
    isLoggedIn = res;
    if(isLoggedIn) {
      loginDisplay();
    } else if(!isLoggedIn) {
      logoutDisplay();
    }
  })
}

function loginDisplay() {
  // hide
  loginLink.style.display = 'none';
  signupLink.style.display = 'none';
  favoriteLoginHint.style.display = 'none';
  // show
  logoutLink.style.display = 'inline';
  favoriteList.style.display = 'block';
  // fetch favorite list from backend
  fetchFavoriteList();
}

function fetchFavoriteList() {
  token = window.localStorage.getItem('token');
  fetch(`${BASE_USER_URL}/favoriteList`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      // render favorite list
      const products = data.products;
      // console.log(products);
      // console.log(productTitles);
      for(let {title,_id} of products) {
        const li = document.createElement('li');

        // text
        const text = document.createTextNode(title);

        // button to remove
        const btn = document.createElement('button');
        btn.textContent = 'X';
        // btn listener
        btn.addEventListener('click', () => {
          li.remove();
          // remove from backend
          removeFavorite(_id);
        });
        // append
        li.style.fontSize = '1rem';
        li.appendChild(text);
        li.appendChild(btn);
        favoriteList.appendChild(li);
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function removeFavorite(id) {
  const token = window.localStorage.getItem('token');
  fetch(`${BASE_USER_URL}/removeFavorite/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      alert('Removed from favorite list');
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function logoutDisplay() {
  // show login/signup
  loginLink.style.display = 'inline';
  signupLink.style.display = 'inline';
  favoriteLoginHint.style.display = 'block';
  // hide un-wanted content
  logoutLink.style.display = 'none';
  favoriteList.style.display = 'none';
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
  // console.log(data);
  if(data.message === 'user verified') {
    return true;
  }
  return false;
}

const logoutHanlder = () => {
  // fetch(`${BASE_URL}/logout`)
  //   .then((res) => res.json())
  //   .then((data) => {
  //     console.log(data);
  //     // after logging out, remove token and username from localStorage
  //     window.localStorage.removeItem('token');
  //     // window.localStorage.removeItem('username');
  //   })
  //   .then(() => window.location.href = '/')
  //   .catch((err) => {
  //     // alert(err.message);
  //     console.log(err.message);
  //   });

  window.localStorage.removeItem('token');
  window.location.href = '/';
};

logoutLink.addEventListener('click', logoutHanlder);


// fetch products data from backend: page 1
let pageNum = 1;
loadPageOne();

function loadPageOne() {
  leftBtn.disabled = true;
  rightBtn.disabled = false;
  fetch(`${BASE_PRODUCT_URL}?page=1`)
  .then((res) => res.json())
  .then((data) => {
    const products = data.products;
    // const productTitles = products.map((product) => product.title);
    // console.log(productTitles);
    for(let {title,_id, brand} of products) {
      addProductPic(title, _id, brand);
    }
  })
  .catch((err) => {
    // alert(err.message);
    console.log(err.message);
  });
}


function addProductPic(title, id, brand) {
  const girdSubDiv = document.createElement('div');
  // img link
  const imgLink = document.createElement('a');
  imgLink.href = `./product/index.html?productId=${id}&brand=${brand}`;

  // img for the link
  const img = document.createElement('img');
  img.style.width = '33%';
  img.style.height = '33%';
  img.src = './images/acer.jpg';
  img.className = 'product-img';
  // text for the sub div
  const text = document.createElement('p');
  text.textContent = title;

  imgLink.appendChild(img);
  girdSubDiv.appendChild(imgLink);
  girdSubDiv.appendChild(text);

  grid.appendChild(girdSubDiv);
}

function resetProductPics() {
  grid.innerHTML = '';
}

leftBtn.addEventListener('click', (e) => {
  e.preventDefault;
  resetProductPics();
  pageNum--;
  handleBtnsEnables();
  fetch(`${BASE_PRODUCT_URL}?page=${pageNum}`)
    .then((res) => res.json())
    .then((data) => {
      const products = data.products;
      // console.log(productTitles);
      for(let {title, _id, brand} of products) {
        addProductPic(title, _id, brand);
      }
    })
    .catch((err) => {
      // alert(err.message);
      console.log(err.message);
    });
})

rightBtn.addEventListener('click', (e) => {
  e.preventDefault;
  resetProductPics();
  pageNum++;
  handleBtnsEnables();
  fetch(`${BASE_PRODUCT_URL}?page=${pageNum}`)
    .then((res) => res.json())
    .then((data) => {
      const products = data.products;
      // console.log(productTitles);
      for(let {title, _id, brand} of products) {
        addProductPic(title, _id, brand);
      }
    })
    .catch((err) => {
      // alert(err.message);
      console.log(err.message);
    });
})

function handleBtnsEnables() {
  if(pageNum <= 1) {
    leftBtn.disabled = true;
  } else {
    leftBtn.disabled = false;
  }
  if(pageNum >= 4) {
    rightBtn.disabled = true;
  } else {
    rightBtn.disabled = false;
  }
}

favoriteLoginLink.addEventListener('click', () => {
  window.location.href = '/login';
});

confirmBtn.addEventListener('click', handleConfirmBtn);
resetBtn.addEventListener('click', handleResetBtn);


function handleConfirmBtn(e) {
  e.preventDefault();
  const brandFilters = [];
  const categoriesFilters = [];
  if(sonyCB.checked) {
    brandFilters.push('Sony');
  }
  if(samsungCB.checked) {
    brandFilters.push('Samsung');
  }
  if(lgCB.checked) {
    brandFilters.push('LG');
  }
  if(panasonicCB.checked) {
    brandFilters.push('Panasonic');
  }
  if(lenovoCB.checked) {
    brandFilters.push('Lenovo');
  }
  if(fridgesCB.checked) {
    categoriesFilters.push('Fridges');
  }
  if(kettlesCB.checked) {
    categoriesFilters.push('Kettles');
  }
  if(televisionsCB.checked) {
    categoriesFilters.push('Televisions');
  }

  // console.log(brandFilters, categoriesFilters);
  // filter products and send request to backend
  const queryBrands = brandFilters.join(';');
  const queryCategories = categoriesFilters.join(';');
  const url = `${BASE_PRODUCT_URL}?page=n&brand=${queryBrands}&category=${queryCategories}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const products = data.products;
      resetProductPics();
      for(let {title, _id, brand} of products) {
        addProductPic(title, _id, brand);
      }
      leftBtn.style.display = 'none';
      rightBtn.style.display = 'none';

    })
    .catch((err) => {
      // alert(err.message);
      console.log(err.message);
    });
}


function handleResetBtn(e) {
  e.preventDefault();
  resetProductPics();
  leftBtn.style.display = 'inline';
  rightBtn.style.display = 'inline';
  pageNum = 1;
  handleBtnsEnables();
  loadPageOne();
}