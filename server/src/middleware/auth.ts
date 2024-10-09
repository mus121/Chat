import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Log all cookies for debugging
    console.log('Cookies: ', req.cookies);
    
    // Retrieve the token from cookies
    const token = req.cookies.authToken;

    if (!token) {
        res.status(401).json({ error: 'Access Denied, no token provided' });
        return; 
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { userId: string };
        
        // Attach the userId to the request body for further use
        req.body.userId = decoded.userId; 
        console.log('Decoded User ID: ', req.body.userId);
        
        next(); 
    } catch (error) {
        console.error('Token verification error:', error); 
        res.status(400).json({ error: 'Invalid Token' });
    }
};
