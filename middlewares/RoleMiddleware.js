import jwt from 'jsonwebtoken';
import validator from 'validator';

const roleValidate = (req, res, next) => {
    const {username} = req.body.user;

    if(username === 'admin') {
        return res.status(200).json({isAdmin: true});
    }

    next();
}

export default roleValidate;