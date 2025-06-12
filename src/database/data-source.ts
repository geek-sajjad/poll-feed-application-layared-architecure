import { DataSource } from 'typeorm';
import { config } from '../config';
import { PollEntity } from '@/entities/poll-entity';
import { VoteEntity } from '@/entities/vote-entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: false, // Only in development
  logging: false,
  entities: [PollEntity, VoteEntity], // Add your entities here
  migrations: ['src/database/migrations/*.js'],
  // subscribers: ['src/database/subscribers/*.ts'],
  // ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
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
