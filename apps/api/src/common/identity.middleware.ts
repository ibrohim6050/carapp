import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.types';

export interface Identity {
  role: 'customer'|'carrier'|'admin';
  userId: string;
  companyId?: string;
}

declare global {
  namespace Express {
    interface Request { identity?: Identity; }
  }
}

@Injectable()
export class IdentityMiddleware implements NestMiddleware {
  constructor(private jwt: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const auth = req.header('authorization') || req.header('Authorization');
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.substring(7);
      try {
        const payload = this.jwt.verify<JwtPayload>(token, { secret: process.env.JWT_SECRET || 'dev' });
        req.identity = { role: payload.role, userId: payload.sub, companyId: payload.companyId || undefined };
        return next();
      } catch (e) {
        throw new UnauthorizedException('Invalid token');
      }
    }
    // Dev fallback headers
    const role = (req.header('x-role') || 'customer') as Identity['role'];
    const userId = req.header('x-user-id') || 'demo-user';
    const companyId = req.header('x-company-id') || undefined;
    if (!userId) throw new UnauthorizedException('Missing x-user-id');
    if (role === 'carrier' && !companyId) throw new UnauthorizedException('Carriers must provide x-company-id');
    req.identity = { role, userId, companyId };
    next();
  }
}
