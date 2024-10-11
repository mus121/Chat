import { pool } from '../config/dbConfig';
import { directMessageSchema, groupMessageSchema } from '../validators/validators';
import { Request, Response } from 'express';
import { ulid } from 'ulid'; // Import the ULID library

// Define interfaces for message data
interface DirectMessage {
  id: string; 
  content: string;
  senderId: string;
  recipientId: string; 
  displayName: string;
  chatId: string;
  isGroupChat: false; 
}

interface GroupMessage {
  id: string; 
  content: string;
  senderId: string;
  displayName: string;
  chatId: string;
  isGroupChat: true; 
}

// Save direct message to DB
export const saveDirectMessageToDB = async (messageData: DirectMessage) => {
  const result = directMessageSchema.safeParse(messageData);

  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.issues.map((err) => err.message).join(', ')}`);
  }

  try {
    await pool.query(
      'INSERT INTO messages (id, content, sender_id, recipient_id, display_name, chat_id, is_group_chat) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [messageData.id, messageData.content, messageData.senderId, messageData.recipientId, messageData.displayName, messageData.chatId, false]
    );
  } catch (error) {
    console.error('Error saving direct message:', error);
    throw error;
  }
};

// Save group message to DB
export const saveGroupMessageToDB = async (messageData: GroupMessage) => {
  const result = groupMessageSchema.safeParse(messageData);

  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.issues.map((err) => err.message).join(', ')}`);
  }

  try {
    await pool.query(
      'INSERT INTO group_messages (id, content, sender_id, display_name, chat_id, is_group_chat) VALUES ($1, $2, $3, $4, $5, $6)',
      [messageData.id, messageData.content, messageData.senderId, messageData.displayName, messageData.chatId , true]
    );
  } catch (error) {
    console.error('Error saving group message:', error);
    throw error;
  }
};

// Send message function for both group and direct messages
export const sendMessage = async (req: Request, res: Response) => {
  const messageData: DirectMessage | GroupMessage = {
    ...req.body,
    senderId: req.body.userId,
    id: ulid(),
  };

  const isGroupChat = req.query.isGroupChat === 'true';

  try {
    if (isGroupChat) {
      await saveGroupMessageToDB(messageData as GroupMessage);
    } else {
      await saveDirectMessageToDB(messageData as DirectMessage);
    }

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get messages by chatId
export const getMessagesByChatId = async (req: Request, res: Response) => {
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
