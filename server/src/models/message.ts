// models/Message.ts
import { PoolClient } from 'pg';
import { pool } from '../config/dbConfig';

interface Message {
    id?: number;
    sender_email: string;
    recipient_email: string;
    message_content: string;
    timestamp?: Date;
}

class MessageModel {
    // Method to add a new message
    async addMessage(sender_email: string, recipient_email: string, message_content: string): Promise<Message> {
        const query = `
            INSERT INTO messages (sender_email, recipient_email, message_content, timestamp)
            VALUES ($1, $2, $3, NOW()) RETURNING *;
        `;
        const values = [sender_email, recipient_email, message_content];

        const client: PoolClient = await pool.connect();
        try {
            const result = await client.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error adding message', error);
            throw error;
        } finally {
            client.release();
        }
    }

    // Method to get all messages between two users
    async getMessages(sender_email: string, recipient_email: string, message_content: string): Promise<Message[]> {
        const query = `
            SELECT id, sender_email, recipient_email, message_content, timestamp 
            FROM messages 
            WHERE (sender_email = $1 AND recipient_email = $2) 
            OR (sender_email = $2 AND recipient_email = $1)
            ORDER BY timestamp ASC;
        `;
        const values = [sender_email, recipient_email, message_content];

        const client: PoolClient = await pool.connect();
        try {
            const result = await client.query(query, values);
            return result.rows; 
        } catch (error) {
            console.error('Error fetching messages', error);
            throw error;
        } finally {
            client.release();
        }
    }


    async addGroupMessage(senderEmail: string, groupId: string, content: string) {
        const query = `INSERT INTO group_messages (sender, group_id, content, timestamp) VALUES ($1, $2, $3, NOW())`;
        const values = [senderEmail, groupId, content];
        await pool.query(query, values);
    }
}

export default new MessageModel();