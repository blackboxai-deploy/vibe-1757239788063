import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  githubToken?: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// JWT implementation using jsonwebtoken library
export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

  static generateToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '24h'
    });
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static getUserFromRequest(request: NextRequest): JWTPayload | null {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    return this.verifyToken(token);
  }
}

// Middleware helper for protecting routes
export function requireAuth(handler: (req: NextRequest, user: JWTPayload) => Promise<Response>) {
  return async (req: NextRequest): Promise<Response> => {
    const user = AuthService.getUserFromRequest(req);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return handler(req, user);
  };
}

// Admin-only middleware
export function requireAdmin(handler: (req: NextRequest, user: JWTPayload) => Promise<Response>) {
  return requireAuth(async (req: NextRequest, user: JWTPayload) => {
    if (user.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return handler(req, user);
  });
}