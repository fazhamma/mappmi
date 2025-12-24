import { DataSource } from 'typeorm';
import { CountryCertStat } from '../models/CountryCertStat';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'pmi_user',
  password: process.env.DATABASE_PASSWORD || 'pmi_password',
  database: process.env.DATABASE_NAME || 'pmi_certifications',
  entities: [CountryCertStat],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Error during database connection:', error);
    throw error;
  }
};
