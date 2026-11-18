import type { NextFunction, Request, Response } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { adminAuth } from '../lib/firebase-admin.ts';
import { upsertUserWithRole } from '../db/repository.ts';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  userRole?: string;
}

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing bearer token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const dbUser = await upsertUserWithRole(
      decodedToken.uid,
      decodedToken.email || '',
      decodedToken.name || ''
    );

    if (dbUser.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden: This account does not have administrator permissions.',
      });
    }

    req.user = decodedToken;
    req.userRole = dbUser.role;
    return next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};
