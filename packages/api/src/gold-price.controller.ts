import { Request, Response } from 'express';
import { CreateGoldPriceDto } from './dto/create-gold-price.dto';
import { CreateGoldPriceListDto } from './dto/create-gold-price-list.dto';
import { GoldPriceResponseDto } from './dto/gold-price.response.dto';
import { GetGoldPricesDto } from './dto/get-gold-prices.dto';
import { ApiResponse } from './dto/api-response.dto';
import { GoldPriceService } from './gold-price.service';
import { plainToInstance } from 'class-transformer';

export class GoldPriceController {

  constructor(private readonly goldPriceService: GoldPriceService) {}

  getAllPrices = async (req: Request<{}, {}, {}, GetGoldPricesDto>, res: Response) => {
    try {
      const { limit = 10 } = req.query;
      const prices = await this.goldPriceService.getAllPrices(limit);
      const response: ApiResponse<GoldPriceResponseDto[]> = {
        data: plainToInstance(GoldPriceResponseDto, prices),
        status: 200
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch gold prices', status: 500 });
    }
  }

  createPrice = async (req: Request<{}, {}, CreateGoldPriceDto>, res: Response) => {
    try {
      const prices = await this.goldPriceService.createGoldPrices([req.body]);
      const response: ApiResponse<GoldPriceResponseDto> = {
        data: plainToInstance(GoldPriceResponseDto, prices[0]),
        status: 201
      };
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create gold price', status: 400 });
    }
  }

  createManyPrices = async (req: Request<{}, {}, CreateGoldPriceListDto>, res: Response) => {
    try {
      const prices = await this.goldPriceService.createGoldPrices(req.body.prices);
      const response: ApiResponse<GoldPriceResponseDto[]> = {
        data: plainToInstance(GoldPriceResponseDto, prices),
        status: 201
      };
      res.status(201).json(response);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed to create gold prices', status: 400 });
    }
  }
} 