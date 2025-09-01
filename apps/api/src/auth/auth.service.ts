import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    if (dto.role === 'admin') {
      const key = process.env.ADMIN_SETUP_KEY || '';
      if (!dto.adminSetupKey || dto.adminSetupKey !== key) {
        throw new BadRequestException('Invalid admin setup key');
      }
    }
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already registered');
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({ data: { email: dto.email, role: dto.role as Role, passwordHash: hash } });
    return { id: user.id, email: user.email, role: user.role };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = await this.jwt.signAsync({ sub: user.id, role: user.role, companyId: user.companyId || null });
    return { accessToken: token, user: { id: user.id, email: user.email, role: user.role } };
  }
}
