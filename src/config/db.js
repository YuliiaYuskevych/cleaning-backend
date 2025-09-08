import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initializeAdmin } from './initAdmin.js';

dotenv.config();

const { MONGO_URI, DB_NAME } = process.env;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,
    });
    console.log(`Connected to MongoDB: ${DB_NAME}`);

    await initializeAdmin();
  } catch (error) {
    console.error('DB connection error:', error);
    process.exit(1);
  }
};
