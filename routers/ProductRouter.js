import express from 'express';
import {
  getProductByID,
  likeProduct,
  getProducts,
  getProductsByBrand,
} from '../controllers/ProductController.js';

const router = express.Router();
router
  .get('/', getProducts)
  .get('/details/:productID', getProductByID)
  .get('/brands/:brand', getProductsByBrand)
  .put('/', likeProduct);

export default router;
