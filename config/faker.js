// fake some products data
// 5 brands and 3 categories -> each brand has 6 products -> total num of products is 30
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

const brands = ['Samsung', 'LG', 'Panasonic', 'Sony', 'Lenovo'];
const categories = ['Fridges','Kettles','Televisions'];
let products = [];
// Generate 6 products for each brand
brands.forEach(brand => {
  for (let i = 0; i < 6; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const product = {
      brand: brand,
      category: category,
      title: `${brand} ${faker.commerce.productName()}`,
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
      stock: faker.datatype.number({ min: 0, max: 100 })
    };
    products.push(product);
  }
});

const data = {
  categories,
  products
};

// export data to a file
const filePath = './config/products.json';
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
