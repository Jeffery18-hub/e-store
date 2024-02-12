const BASE_PRODUCT_URL = 'http://localhost:3000/api/products';
const BASE_USER_URL = 'http://localhost:3000/api/user';
const likeBtn = document.getElementById('like-btn');
const otherProductsContainer = document.getElementById(
    'other-products-container',
);

// console.log(window.location.search); // query string
const urlParams = new URLSearchParams(window.location.search);
const productID = urlParams.get('productId');
const brand = urlParams.get('brand');

renderProducts(productID, brand);

// check whether user is logged in
// get token from local storage
let isLoggedIn;
const token = window.localStorage.getItem('token');
if (token) {
    verifyJWT(token).then((res) => {
        isLoggedIn = res;
        if (isLoggedIn) {
            likeBtn.style.display = 'block';
            likeBtn.addEventListener('click', () => {
                likeProduct(productID);
            });
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
    // console.log(data);
    if (data.message === 'user verified') {
        return true;
    }
    return false;
}

async function renderProducts(productID, brand) {
    // console.log(brand)
    const response = await fetch(`${BASE_PRODUCT_URL}/brands/${brand}`);
    const data = await response.json();
    // console.log(data);
    const products = data.products;
    const product = products.find((product) => product._id === productID);
    const tbody = document.querySelector('tbody');

    const tr = document.createElement('tr');
    const tdID = document.createElement('td');
    const tdBrand = document.createElement('td');
    const tdCategory = document.createElement('td');
    const tdTitle = document.createElement('td');
    const tdDescription = document.createElement('td');
    const tdPrice = document.createElement('td');
    const tdStock = document.createElement('td');

    tdID.textContent = product._id;
    tdBrand.textContent = product.brand;
    tdCategory.textContent = product.category;
    tdTitle.textContent = product.title;
    tdDescription.textContent = product.description;
    tdPrice.textContent = product.price;
    tdStock.textContent = product.stock;

    tr.append(
        tdID,
        tdBrand,
        tdCategory,
        tdTitle,
        tdDescription,
        tdPrice,
        tdStock,
    );
    tbody.append(tr);

    // render other products of the same brand;
    for (let product of products) {
        if (product._id !== productID) {
            addOtherProduct(product);
        }
    }
}

function addOtherProduct(product) {
    const productDiv = document.createElement('div');
    // img link
    const imgLink = document.createElement('a');
    imgLink.href = `./index.html?productId=${product._id}&brand=${product.brand}`;

    // img for the link
    const img = document.createElement('img');
    img.style.width = '6rem';
    img.style.height = '6rem';
    img.src = '../images/acer.jpg';
    img.className = 'product-img';
    // text for the sub div
    const text = document.createElement('p');
    text.textContent = product.title;

    imgLink.appendChild(img);
    productDiv.appendChild(imgLink);
    productDiv.appendChild(text);
    otherProductsContainer.appendChild(productDiv);
}

async function likeProduct(productID) {
    const token = window.localStorage.getItem('token');
    const response = await fetch(`${BASE_USER_URL}/favorite/${productID}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    console.log(data);
    alert(data.message);
}
