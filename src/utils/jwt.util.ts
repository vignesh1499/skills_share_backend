import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refreshSecret';


//To Generate Token
export const generateToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

//To Generate Refresh Token
export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}


//To Verify Token
export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as jwt.JwtPayload
    } catch {
        throw new Error('Invalid or expired refresh token')
    }
}
