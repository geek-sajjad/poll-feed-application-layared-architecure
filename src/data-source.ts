import { DataSource } from 'typeorm';
import { User } from './entities/user';
import { config } from './config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: config.nodeEnv === 'development', // Only in development
  logging: config.nodeEnv === 'development',
  entities: [User], // Add your entities here
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
  ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');

    if (config.nodeEnv === 'production') {
      await AppDataSource.runMigrations();
      console.log('✅ Migrations executed successfully');
    }
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    process.exit(1);
  }
};
