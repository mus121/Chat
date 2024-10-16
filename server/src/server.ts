import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import publicRoutes from './routes/public';
import privateRoutes from './routes/private';
import initSocket from './services/socket';
import { createServer } from 'http';

dotenv.config();

const app: Express = express();
const server = createServer(app);

initSocket(server);

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

//Public Routes
app.use('/api/auth', publicRoutes);

// Private Routes
app.use('/api/private', privateRoutes);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
