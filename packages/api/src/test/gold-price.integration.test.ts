import request from 'supertest';
import { setupTestDB, getTestApp } from './setup';
import { GoldPriceModel } from '../gold-price.schema';

setupTestDB();

describe('Gold Price API Integration Tests', () => {
  const app = getTestApp();

  describe('GET /api/gold-prices/get', () => {
    it('should return empty array when no prices exist', async () => {
      const response = await request(app)
        .get('/api/gold-prices/get')
        .expect(200);

      expect(response.body).toEqual({
        data: [],
        status: 200
      });
    });

    it('should return latest gold prices with default limit', async () => {
      // Create test data
      const testPrices = [
        { date: '2024-03-14', price: 2150.50 },
        { date: '2024-03-13', price: 2140.75 },
        { date: '2024-03-12', price: 2130.25 },
        { date: '2024-03-11', price: 2120.00 },
        { date: '2024-03-10', price: 2110.50 }
      ];
      await GoldPriceModel.insertMany(testPrices);

      const response = await request(app)
        .get('/api/gold-prices/get')
        .expect(200);

      expect(response.body.data).toHaveLength(5);
      expect(response.body.status).toBe(200);
      expect(response.body.data[0].price).toBe(2150.50); // Should be sorted by date desc
    });

    it('should respect limit parameter', async () => {
      // Create test data
      const testPrices = Array.from({ length: 15 }, (_, i) => ({
        date: new Date(2024, 2, 14 - i).toISOString(),
        price: 2150.50 - i
      }));
      await GoldPriceModel.insertMany(testPrices);

      const response = await request(app)
        .get('/api/gold-prices/get?limit=3')
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0].price).toBe(2150.50);
    });

    it('should validate limit parameter', async () => {
      await request(app)
        .get('/api/gold-prices/get?limit=-1')
        .expect(400);

      await request(app)
        .get('/api/gold-prices/get?limit=101')
        .expect(400);
    });
  });

  describe('POST /api/gold-prices/add/single', () => {
    it('should create a single gold price', async () => {
      const newPrice = {
        date: '2024-03-14',
        price: 2150.50
      };

      const response = await request(app)
        .post('/api/gold-prices/add/single')
        .send(newPrice)
        .expect(201);

      expect(response.body.status).toBe(201);
      expect(response.body.data).toMatchObject({
        date: newPrice.date,
        price: newPrice.price
      });
      expect(response.body.data.id).toBeDefined();

      // Verify in database
      const savedPrice = await GoldPriceModel.findById(response.body.data.id);
      expect(savedPrice).toMatchObject(newPrice);
    });

    it('should validate required fields', async () => {
      await request(app)
        .post('/api/gold-prices/add/single')
        .send({})
        .expect(400);

      await request(app)
        .post('/api/gold-prices/add/single')
        .send({ date: '2024-03-14' })
        .expect(400);

      await request(app)
        .post('/api/gold-prices/add/single')
        .send({ price: 2150.50 })
        .expect(400);
    });
  });

  describe('POST /api/gold-prices/add/list', () => {
    it('should create multiple gold prices', async () => {
      const newPrices = {
        prices: [
          { date: '2024-03-14', price: 2150.50 },
          { date: '2024-03-13', price: 2140.75 },
          { date: '2024-03-12', price: 2130.25 }
        ]
      };

      const response = await request(app)
        .post('/api/gold-prices/add/list')
        .send(newPrices)
        .expect(201);

      expect(response.body.status).toBe(201);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0].price).toBe(2150.50);

      // Verify in database
      const savedPrices = await GoldPriceModel.find();
      expect(savedPrices).toHaveLength(3);
    });

    it('should validate prices array', async () => {
      await request(app)
        .post('/api/gold-prices/add/list')
        .send({ prices: [] })
        .expect(400);

      await request(app)
        .post('/api/gold-prices/add/list')
        .send({ prices: [{ date: '2024-03-14' }] })
        .expect(400);
    });
  });
}); 