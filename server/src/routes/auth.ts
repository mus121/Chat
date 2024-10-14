// authRoutes.ts
import { Router } from 'express';
import { signup, login, logout, email, updateProfile, MessageFetch } from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/signup', signup); // Signup route
router.post('/login', login); // Login route
router.post('/logout', logout);

// Fetch all users' emails
router.get('/email', email);

router.put('/profile', authMiddleware, updateProfile);

// Message Get Api 
router.get('/messages/:email', MessageFetch);
export default router;
