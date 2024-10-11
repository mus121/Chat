import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import { authMiddleware } from './middleware/auth';
import chatRoutes from './routes/chat';
import initSocket from './services/socket';
import { createServer } from 'http';

dotenv.config();

// Create Express app
const app: Express = express();
const server = createServer(app);

// Initialize Socket.IO
initSocket(server);

// Middleware
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/chat', chatRoutes);

// Apply middleware to protect the route
app.get('/api/protected', authMiddleware, (req: express.Request, res: express.Response) => {
  const userId = req.body.userId;
  res.status(200).json({ message: 'You have accessed a protected route!', userId });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
