import mongoose from 'mongoose';
import { app } from '../index';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export const setupTestDB = () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = await mongoose?.connection?.db?.collections();
    for (const collection of collections || []) {
      await collection.deleteMany({});
    }
  });
};

export const getTestApp = () => app; 