import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(data: { email: string; password: string; name: string; role: Role; companyName?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new BadRequestException('Email already registered');

    let companyId: string | undefined;
    if (data.role === 'carrier') {
      const company = await this.prisma.company.create({ data: { name: data.companyName || `${data.name}'s Company` } });
      companyId = company.id;
    }

    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { email: data.email, passwordHash: hash, role: data.role, companyId }
    });

    const token = await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role, companyId });
    return { user: { id: user.id, email: user.email, role: user.role, companyId }, accessToken: token };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role, companyId: user.companyId || undefined });
    return { user: { id: user.id, email: user.email, role: user.role, companyId: user.companyId }, accessToken: token };
  }
}
