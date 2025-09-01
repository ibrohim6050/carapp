import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail() email: string;
  @MinLength(6) password: string;
  @IsString() name: string;
  @IsEnum(Role) role: Role; // 'customer' | 'carrier' | 'admin'
  @IsOptional() @IsString() companyName?: string;
}
