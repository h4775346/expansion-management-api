import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3307'),  // Changed from 3306 to 3307
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DB || 'expansion_management',
  synchronize: false,
  logging: false,
  entities: ['src/**/entities/*.entity{.ts,.js}'],
  migrations: ['src/common/database/migrations/**/*{.ts,.js}'],
  subscribers: [],
});