import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Log all cookies for debugging
    const token = req.cookies.authToken;
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMUo5WEcxWkY1NDNXSDQ2OVJISkpBNlBZOCIsImlhdCI6MTcyODc3NTU3NCwiZXhwIjoxNzI4Nzc5MTc0fQ.Q3qww-otMqWXYo7JVgzEjkgQzhR9-Ds8W7CjjNhkLt8';
    console.log("Token",token)
    if (!token) {
        res.status(401).json({ error: 'Access Denied, no token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { userId: string };
        req.body.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(400).json({ error: 'Invalid Token' });
    }
};
