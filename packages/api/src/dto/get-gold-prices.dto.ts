import { IsNumber, IsOptional, IsPositive, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetGoldPricesDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(100)
  @Transform(({ value }) => value ? parseInt(value) : 10)
  limit?: number = 10;
} 