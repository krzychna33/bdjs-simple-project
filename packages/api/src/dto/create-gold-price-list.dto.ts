import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateGoldPriceDto } from './create-gold-price.dto';

export class CreateGoldPriceListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateGoldPriceDto)
  public prices!: CreateGoldPriceDto[];
} 