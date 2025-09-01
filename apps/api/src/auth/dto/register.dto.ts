import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';
export class RegisterDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsEnum(Role) role: Role; // 'customer' | 'admin'
  @IsOptional() @IsString() adminSetupKey?: string;
}
