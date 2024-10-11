// authRoutes.ts
import { Router } from 'express';
import { signup, login, logout, email } from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/signup', signup); // Signup route
router.post('/login', login); // Login route
router.get('/protected-route', authMiddleware, (req, res) => {
    res.send(`Hello User ${req.body.userId}, you have access!`);
});
router.post('/logout', logout); // Login route


// Fetch all users' emails

router.get('/email', email);

export default router;
