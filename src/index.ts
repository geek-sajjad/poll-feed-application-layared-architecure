import { app } from './app';
import { config } from './config';
import { initializeDatabase } from './data-source';
import { redisClient } from './redis/client';

const startServer = async (): Promise<void> => {
  try {
    // Initialize database
    await initializeDatabase();

    // Initialize Redis
    await redisClient.connect();

    // Start the server
    app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`📡 Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
// process.on('SIGTERM', async () => {
//   console.log('🛑 SIGTERM received, shutting down gracefully');
//   await redisClient.disconnect();
//   process.exit(0);
// });

// process.on('SIGINT', async () => {
//   console.log('🛑 SIGINT received, shutting down gracefully');
//   await redisClient.disconnect();
//   process.exit(0);
// });

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
