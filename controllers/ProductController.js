import Product from '../models/Product.js';
const getProducts = async (req, res) => {
    // parse the query string
    // console.log(req.query);
    const {page, brand, category} = req.query;
    let products = [];
    if(page && page!='n') {
        const pageNum = parseInt(page) || 1;
        products = await Product
            .find()
            .limit(9)
            .skip((pageNum - 1) * 9)
            .lean()
            .exec();
    }else if(page && page == 'n') {
        products = await Product
            .find()
            .lean()
            .exec();
    }

    if(brand) {
        products = products.filter(product => brand.includes(product.brand));
    }
    if(category) {
        products = products.filter(product => category.includes(product.category));
    }
    // console.log(products);
    return res.status(200).json({ products });
    
}


const likeProduct = async (req, res) => {
    const {username, songID} = req.body;
    return res.status(201).json({message: `you liked this songID ${songID}`})
}

const getProductByID = async (req, res) => {
    const {productID} = req.params;
    try {
        const product = await Product
            .findById(productID)
            .lean()
            .exec();
        return res.status(200).json({ product });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getProductsByBrand = async (req, res) => {
    console.log("req.params: ", req.params);
    const {brand} = req.params;
    try {
        const products = await Product
            .find({brand})
            .lean()
            .exec();
        return res.status(200).json({ products });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export {getProductByID, getProducts, likeProduct, getProductsByBrand};