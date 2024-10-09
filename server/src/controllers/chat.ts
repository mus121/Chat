import { pool } from '../config/dbConfig';
import { directMessageSchema, groupMessageSchema } from '../validators/validators';
import { Request, Response } from 'express';
// Save direct message to DB
export const saveDirectMessageToDB = async (messageData: any) => {
  const result = directMessageSchema.safeParse(messageData);

  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.issues.map((err: { message: any; }) => err.message).join(', ')}`);
  }

  try {
    await pool.query(
      'INSERT INTO messages (content, sender_id, recipient_id, display_name, chat_id) VALUES ($1, $2, $3, $4, $5)',
      [messageData.content, messageData.senderId, messageData.recipientId, messageData.displayName, messageData.chatId]
    );
  } catch (error) {
    console.error('Error saving direct message:', error);
    throw error;
  }
};

// Save group message to DB
export const saveGroupMessageToDB = async (messageData: any) => {
  const result = groupMessageSchema.safeParse(messageData);

  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.issues.map((err: { message: any; }) => err.message).join(', ')}`);
  }

  try {
    await pool.query(
      'INSERT INTO group_messages (content, sender_id, display_name, chat_id) VALUES ($1, $2, $3, $4)',
      [messageData.content, messageData.senderId, messageData.displayName, messageData.chatId]
    );
  } catch (error) {
    console.error('Error saving group message:', error);
    throw error;
  }
};

// Example sendMessage function for both group and direct messages
export const sendMessage = async (req: Request, res: Response) => {
    const messageData = req.body; 
    const isGroupChat = req.query.isGroupChat === 'true'; 
  
    try {
      if (isGroupChat) {
        await saveGroupMessageToDB(messageData);
      } else {
        await saveDirectMessageToDB(messageData);
      }
  
      res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  };

// Get messages by chatId
export const getMessagesByChatId = async (req: any, res: any) => {
  const { chatId } = req.params;
  const isGroupChat = req.query.isGroupChat === 'true'; 

  try {
    const query = isGroupChat
      ? 'SELECT * FROM group_messages WHERE chat_id = $1 ORDER BY created_at'
      : 'SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at';

    const dbResult = await pool.query(query, [chatId]);

    res.status(200).json(dbResult.rows);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};
