import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Log all cookies for debugging
    console.log('Cookies: ', req.cookies);
    const token = req.cookies.authToken;
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMUo5Ujg4UkdGMVFXMUE1S1IyOFlGNkRNVCIsImlhdCI6MTcyODU0MjU0MSwiZXhwIjoxNzI4NTQ2MTQxfQ.ain6ee7H9IMD7P6GfkonB-NqJdM38dAIvfPinf55XTQ';

    if (!token) {
        res.status(401).json({ error: 'Access Denied, no token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { userId: string };
        req.body.userId = decoded.userId;
        console.log('Decoded User ID: ', req.body.userId);
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(400).json({ error: 'Invalid Token' });
    }
};
