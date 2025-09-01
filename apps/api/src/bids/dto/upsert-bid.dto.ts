import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class UpsertBidDto {
  @IsString() amountCurrency: string;
  @IsNumber() @Min(0) amountValue: number;
  @IsOptional() @IsInt() @Min(0) etaDays?: number;
  @IsOptional() @IsString() comment?: string;
}
