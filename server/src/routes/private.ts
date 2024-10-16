// authRoutes.ts
import { Router } from 'express';
import { email, updateProfile, MessageFetch, getUserProfile } from '../controllers/private';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/user-profile', getUserProfile)

router.get('/email', email);

router.put('/profile', authMiddleware, updateProfile);


router.get('/messages/:email', MessageFetch);

export default router;