import { IsDateString, IsNumber, IsPositive } from 'class-validator';
import { ICreateGoldPrice } from '../common/interfaces/create-gold-price.interface';

export class CreateGoldPriceDto implements ICreateGoldPrice {
  @IsDateString()
  public date!: string;

  @IsNumber()
  @IsPositive()
  public price!: number;
} 