import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Ensure this is set in your environment variables

export const registerUser = async ({
  email,
  displayName,
  username,
  password,
}: {
  email: string;
  displayName: string;
  username: string;
  password: string;
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        displayName,
        username,
        password: hashedPassword,
      },
    });
    return { id: user.id, displayName: user.displayName, username: user.username }; 
  } catch (error: unknown) {  // Explicitly type error as unknown
    if (error instanceof Error) {
      throw new Error('User registration failed: ' + error.message);
    } else {
      throw new Error('User registration failed: Unknown error');
    }
  }
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null; // User not found
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return null; 
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  return { token }; // Return the token
};
