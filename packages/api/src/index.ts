import 'reflect-metadata';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { validateDto } from './middleware/validation.middleware';
import { CreateGoldPriceDto } from './dto/create-gold-price.dto';
import { CreateGoldPriceListDto } from './dto/create-gold-price-list.dto';
import { GetGoldPricesDto } from './dto/get-gold-prices.dto';
import { GoldPriceController } from './gold-price.controller';
import { GoldPriceService } from './gold-price.service';

export const app = express();
const port = 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27037/gold-prices?authSource=admin';

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
}

// Routes
const goldPriceController = new GoldPriceController(new GoldPriceService());
app.get('/api/gold-prices/get', validateDto(GetGoldPricesDto, 'query'), goldPriceController.getAllPrices);
app.post('/api/gold-prices/add/single', validateDto(CreateGoldPriceDto), goldPriceController.createPrice);
app.post('/api/gold-prices/add/list', validateDto(CreateGoldPriceListDto), goldPriceController.createManyPrices);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
  });
} 