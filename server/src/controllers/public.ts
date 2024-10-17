import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ulid } from 'ulid';
import { signupSchema, loginSchema } from '../validators/auth';
import { findUserByEmail, createUser } from '../repositories/userRepository';

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
};

// Signup logic
export const signup = async (req: Request, res: Response) => {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return;
    }

    const { email, display_name, username, password } = result.data;

    try {
        const userId = ulid();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Call createUser from the userRepository
        const dbResult = await createUser(userId, email, display_name, username, hashedPassword);

        const token = jwt.sign({ userId: dbResult.rows[0].id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        res.cookie('authToken', token, cookieOptions);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'User creation failed.' });
    }
};

// Login logic
export const login = async (req: Request, res: Response) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return;
    }

    const { email, password } = result.data;

    try {
        const dbResult = await findUserByEmail(email);

        if (dbResult.rows.length > 0) {
            const user = dbResult.rows[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                // Create JWT token
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

                res.cookie('authToken', token, { ...cookieOptions, httpOnly: false });
                res.cookie('userId', user.id, { ...cookieOptions, httpOnly: false });
                res.cookie('email', user.email, { ...cookieOptions, httpOnly: false });

                res.status(200).json({ message: 'Login successful' });
            } else {
                res.status(401).json({ error: 'Invalid credentials.' });
            }
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed.' });
    }
};

// Logout logic
export const logout = (req: Request, res: Response) => {
    res.clearCookie('authToken', { ...cookieOptions, httpOnly: false });
    res.clearCookie('email', { ...cookieOptions, httpOnly: false });
    res.clearCookie('userId', { ...cookieOptions, httpOnly: false });
    res.status(200).json({ message: 'Logged out successfully' });
};