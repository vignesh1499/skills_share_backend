import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';



//To Generate Token
export const generateToken = (payload : object) => {
    return  jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

//To Verify Token
export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
}