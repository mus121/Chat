// authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/dbConfig';
import {updatedProfileSchema} from '../validators/profile';

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
};

export const email = async (req: Request, res: Response) => {
    try {

        const result = await pool.query('SELECT email FROM users');
        const emails = result.rows.map(row => row.email);

     await pool.query('UPDATE messages SET unread_count = 0 WHERE recipient_email = $1', [email]);

        res.status(200).json(emails);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });  
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.authToken;

        if (!token) {
            res.status(401).json({ message: 'Unauthorized User' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT secret is not defined');
        }

        const decoded = jwt.verify(token, jwtSecret) as { id: string };
        const userId = decoded.id;

        const userQuery = 'SELECT username, email, display_name FROM users WHERE id = $1';
        const { rows } = await pool.query(userQuery, [userId]);

        if (rows.length === 0) {
            res.status(400).json({ message: 'User Not Found' });
            return;
        }

        res.json({ username: rows[0].username, email: rows[0].email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {

    const userId = req.cookies.userId;

    if (!userId) {
        res.status(401).json({ error: 'UnAuthorize' });
        return
    }

    const result = updatedProfileSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    const { email, display_name, username } = req.body;

    try {
        const updateQuery = `
            UPDATE users 
            SET email = $1, display_name = $2, username = $3
            WHERE id = $4
        `;

        const values = [email, display_name, username, userId];

        await pool.query(updateQuery, values);

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Profile update failed' });
    }
}

export const MessageFetch = async (req: Request, res: Response) => {
    const { email } = req.params; 
    const loggedInUserEmail = req.cookies.email; 

    if (!loggedInUserEmail) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }

    try {
        const result = await pool.query(
            `SELECT * FROM messages 
            WHERE (sender_email = $1 AND recipient_email = $2) 
            OR (sender_email = $2 AND recipient_email = $1)
            ORDER BY timestamp ASC`,
            [loggedInUserEmail, email]
        );
        await pool.query(
            `UPDATE messages
            SET unread_count = 0
            WHERE (sender_email = $1 AND recipient_email = $2) OR (sender_email = $2 AND recipient_email = $1)`,
            [loggedInUserEmail, email]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};
