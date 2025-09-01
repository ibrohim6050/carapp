import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { LoadStatus } from '@prisma/client';

export class CreateLoadDto {
  @IsString() @MinLength(2) title: string;
  @IsString() cargoType: string;
  @IsNumber() @Min(0) weightTons: number;
  @IsString() pickupAddr: string;
  @IsString() deliveryAddr: string;
  @IsString() customsPoint: string;
  @IsDateString() targetDate: string;
  @IsOptional() @IsString() notes?: string;
  @IsDateString() biddingDeadlineAt: string;
  @IsOptional() @IsEnum(LoadStatus) status?: LoadStatus;
}
