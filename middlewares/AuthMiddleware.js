import jwt from 'jsonwebtoken';
import validator from 'validator';

const jwtValidate = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if(!token || validator.isEmpty(token)) {
        return res.status(401).json({message: 'No token provided'});
    }

    // decode the token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    
    if(!decoded.id || !validator.isMongoId(decoded.id)) {
        return res.status(401).json({message: 'Invalid token provided'});
    }

    // attach user to request
    req.body.user = decoded; 
    
    next();
}

export default jwtValidate;