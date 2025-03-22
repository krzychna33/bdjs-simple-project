// generate mongodb schema for gold price, it should impelemnt gold price interface
import { Schema, model } from 'mongoose';
import { IGoldPriceModel } from './common/interfaces/gold-price-model.interface';

export const GoldPriceSchema = new Schema<IGoldPriceModel>({
  date: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
});

export const GoldPriceModel = model<IGoldPriceModel>('GoldPrice', GoldPriceSchema);