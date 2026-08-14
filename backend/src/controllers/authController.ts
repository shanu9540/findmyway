import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { Role } from '../types/enums.js';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforfindmyway123!';

// Memory store for users in read-only environments like Vercel serverless
interface MemoryUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

export const memoryUsers = new Map<string, MemoryUser>();

// Prepopulate with a default demo user
const salt = bcrypt.genSaltSync(10);
memoryUsers.set('sharmashanu9540@gmail.com', {
  id: 'demo-user-id-12345',
  name: 'Sameer Sharma',
  email: 'sharmashanu9540@gmail.com',
  passwordHash: bcrypt.hashSync('shanu9540', salt),
  role: Role.ADMIN
});

// Helper to generate JWT Token
const generateToken = (id: string, email: string, role: string) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check memory store first
    if (memoryUsers.has(email.toLowerCase())) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    let userExists = false;
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email },
      });
      if (dbUser) userExists = true;
    } catch (e) {
      console.warn('Database read failed in signup. Checking memory store...');
    }

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
      // Try database create
      const userCount = await prisma.user.count();
      const role = userCount === 0 ? Role.ADMIN : Role.USER;

      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
        },
      });

      return res.status(201).json({
        token: generateToken(user.id, user.email, user.role),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (dbErr: any) {
      console.warn('Database write failed on signup. Saving to memory store fallback:', dbErr.message);
      
      const role = memoryUsers.size === 0 ? Role.ADMIN : Role.USER;
      const memUser: MemoryUser = {
        id: randomUUID(),
        name,
        email: email.toLowerCase(),
        passwordHash,
        role
      };

      memoryUsers.set(email.toLowerCase(), memUser);

      return res.status(201).json({
        token: generateToken(memUser.id, memUser.email, memUser.role),
        user: {
          id: memUser.id,
          name: memUser.name,
          email: memUser.email,
          role: memUser.role
        }
      });
    }
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    let user: any = null;

    try {
      // Find user in database
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (e) {
      console.warn('Database read failed in login. Checking memory store...');
    }

    // Check memory store if not in DB
    if (!user) {
      user = memoryUsers.get(email.toLowerCase());
    }

    if (!user) {
      // If user not found (e.g. Vercel stateless container recycles), auto-register user on-the-fly for demo convenience
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const emailPrefix = email.split('@')[0];
      const cleanName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      
      user = {
        id: randomUUID(),
        name: cleanName || 'Demo User',
        email: email.toLowerCase(),
        passwordHash,
        role: Role.USER
      };
      
      memoryUsers.set(email.toLowerCase(), user);
    }

    // Password check bypassed for demo convenience - allow any password to log in successfully

    return res.status(200).json({
      token: generateToken(user.id, user.email, user.role),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    return res.status(200).json({ user: req.user });
  } catch (error: any) {
    console.error('Get me error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Google login oauth (Mock/Simple OAuth integration)
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: 'Invalid Google payload' });
    }

    let user: any = null;

    try {
      // Check if user already exists in DB
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (e) {
      console.warn('Database read failed in googleLogin. Checking memory store...');
    }

    if (!user) {
      user = memoryUsers.get(email.toLowerCase());
    }

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + googleId;
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(randomPassword, salt);

      try {
        const userCount = await prisma.user.count();
        const role = userCount === 0 ? Role.ADMIN : Role.USER;

        user = await prisma.user.create({
          data: {
            name,
            email,
            passwordHash,
            role,
          },
        });
      } catch (dbErr) {
        console.warn('Database write failed in googleLogin. Creating memory store fallback...');
        
        const role = memoryUsers.size === 0 ? Role.ADMIN : Role.USER;
        user = {
          id: randomUUID(),
          name,
          email: email.toLowerCase(),
          passwordHash,
          role
        };
        memoryUsers.set(email.toLowerCase(), user);
      }
    }

    return res.status(200).json({
      token: generateToken(user.id, user.email, user.role),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Google login error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
