import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
    brand: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    price: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    stock: {
        type: Number,
        require: true,
    },
});

const Product = new model('Product', ProductSchema);

export default Product;
