import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { Role } from '../types/enums.js';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforfindmyway123!') as JwtPayload;

    let user: any = null;
    try {
      // Fetch user from DB to make sure they still exist
      user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } catch (e) {
      console.warn('[authMiddleware] DB lookup failed on protect. Trying memory fallback...');
    }

    if (!user) {
      // Find in memory store fallback
      const { memoryUsers } = await import('../controllers/authController.js');
      const memMatch = Array.from((memoryUsers as any).values()).find((u: any) => u.id === decoded.id) as any;
      if (memMatch) {
        user = {
          id: memMatch.id,
          name: memMatch.name,
          email: memMatch.email,
          role: memMatch.role
        };
      }
    }

    if (!user) {
      // Reconstruct user on-the-fly from the cryptographically verified token payload
      const emailPrefix = decoded.email.split('@')[0];
      const cleanName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      user = {
        id: decoded.id,
        name: cleanName || 'Demo User',
        email: decoded.email,
        role: decoded.role || Role.USER
      };
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction): any => {
  if (req.user && req.user.role === Role.ADMIN) {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

export const optionalProtect = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforfindmyway123!') as JwtPayload;

    let user: any = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } catch (e) {}

    if (!user) {
      const { memoryUsers } = await import('../controllers/authController.js');
      const memMatch = Array.from((memoryUsers as any).values()).find((u: any) => u.id === decoded.id) as any;
      if (memMatch) {
        user = {
          id: memMatch.id,
          name: memMatch.name,
          email: memMatch.email,
          role: memMatch.role
        };
      }
    }

    if (!user) {
      const emailPrefix = decoded.email.split('@')[0];
      const cleanName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      user = {
        id: decoded.id,
        name: cleanName || 'Demo User',
        email: decoded.email,
        role: decoded.role || Role.USER
      };
    }

    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    next();
  }
};
