import fs from 'fs';
import Product from '../models/Product.js';
import User from '../models/User.js';
import connection from '../config/db.js';
import * as argon2 from 'argon2';

const jsonString = fs.readFileSync('./config/products.json', 'utf8');
const productArr = JSON.parse(jsonString).products;

// console.log(productArr);

console.log('seeding...');

connection.once('open', async () => {
	try {
		// reset db
		await Promise.all([User.collection.drop(), Product.collection.drop()]);

		// create a user
		const hasshedPassword = await argon2.hash('qwe');
		const user = await User.create({
			username: 'user1',
			email: 'user1@google.com',
			password: hasshedPassword,
			likes: [],
		});

		// create products
		const insertedProducts = await Product.insertMany(productArr);
		const productID = insertedProducts.map((product) => product._id); // get product ids

		// update user likes with products(index 0 and 1)
		const updatedUser = await User.findByIdAndUpdate(user._id, {
			likes: [productID[0], productID[1]],
		});

		console.log('seeding done!');
	} catch (error) {
		console.log(error);
	} finally {
		await connection.close();
	}
});
