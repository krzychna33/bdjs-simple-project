import { IGoldPriceModel } from "../common/interfaces/gold-price-model.interface";

export class GoldPriceResponseDto implements IGoldPriceModel {
  id!: string;
  date!: string;
  price!: number;
} 