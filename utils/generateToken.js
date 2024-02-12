import jwt from 'jsonwebtoken';

const generateToken = (id, username) => {
    const token = jwt.sign({ id, username }, process.env.JWT_KEY, {
        expiresIn: '1d',
    });
    return token;
};

export default generateToken;
