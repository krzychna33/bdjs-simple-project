import { GoldPriceModel } from './gold-price.schema';
import { CreateGoldPriceDto } from './dto/create-gold-price.dto';
import { CreateGoldPriceListDto } from './dto/create-gold-price-list.dto';
import { GoldPriceResponseDto } from './dto/gold-price.response.dto';
import { plainToInstance } from 'class-transformer';
import { IGoldPriceModel } from './common/interfaces/gold-price-model.interface';

export class GoldPriceService {
  async getAllPrices(limit: number = 10): Promise<IGoldPriceModel[]> {
    const prices = await GoldPriceModel.find().lean()
      .sort({ date: -1 })
      .limit(limit);
    return prices.map(price => ({ ...price, id: price._id.toString() }));
  }

  async createGoldPrices(prices: CreateGoldPriceDto[]): Promise<IGoldPriceModel[]> {
    const operations = prices.map(price => ({
      updateOne: {
        filter: { date: price.date },
        update: { $set: price },
        upsert: true
      }
    }));

    const result = await GoldPriceModel.bulkWrite(operations, { ordered: false });
    const createdPrices = await GoldPriceModel.find({
      date: { $in: prices.map(p => p.date) }
    }).sort({ date: -1 }).lean();
    
    return createdPrices.map(price => ({ ...price, id: price._id.toString() }));
  }
} 