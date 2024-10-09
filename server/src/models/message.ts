import { pool } from '../config/dbConfig';

// Function to create a new message
export const createMessage = async (content: string, senderId: string, chatId: string, displayName: string) => {
    const result = await pool.query(
        'INSERT INTO messages (content, sender_id, chat_id, display_name) VALUES ($1, $2, $3, $4) RETURNING *',
        [content, senderId, chatId, displayName]
    );
    return result.rows[0];
};

// Function to get messages by chat ID
export const getMessagesByChatId = async (chatId: string) => {
    const result = await pool.query('SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC', [chatId]);
    return result.rows;
};
