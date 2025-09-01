import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { LoadStatus } from '@prisma/client';

export class CreateLoadDto {
  @IsString() title: string;
  @IsString() cargoType: string;
  @IsNumber() @Min(0.1) weightTons: number;
  @IsString() pickupAddr: string;
  @IsString() deliveryAddr: string;
  @IsString() customsPoint: string;
  @IsDateString() targetDate: string;
  @IsOptional() @IsString() notes?: string;
  @IsDateString() biddingDeadlineAt: string;
  @IsOptional() @IsEnum(LoadStatus) status?: LoadStatus;
}
