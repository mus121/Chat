import express from 'express';
import { sendMessage, getMessagesByChatId } from '../controllers/chat';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Send a message
router.post('/send', authMiddleware, sendMessage);

// Get all messages by chatId (group or direct)
router.get('/:chatId/messages', authMiddleware, getMessagesByChatId);

export default router;
