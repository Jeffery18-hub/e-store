import express from 'express';
import {
    register,
    login,
    logout,
    getAdminData,
    fetchFavoriteList,
    verifyJWT,
    removeFavorite,
    favoriteProduct,
} from '../controllers/UserController.js';
import jwtValidate from '../middlewares/AuthMiddleware.js';
import roleVailidate from '../middlewares/RoleMiddleware.js';
const router = express.Router();

router
    .get('/logout', logout)
    .post('/register', register)
    .post('/login', login)
    .get('/admin', jwtValidate, getAdminData)
    // .put('/info', jwtValidate, editInfo) // TODO: not required
    .get('/verifyJWT', jwtValidate, roleVailidate, verifyJWT) // TODO: weird here, maybe verifyJWT is not necessary
    .get('/favoriteList', jwtValidate, roleVailidate, fetchFavoriteList)
    .delete('/removeFavorite/:id', jwtValidate, roleVailidate, removeFavorite)
    .put('/favorite/:id', jwtValidate, roleVailidate, favoriteProduct);

export default router;
