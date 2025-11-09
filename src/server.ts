import createApp from './app';
import { disconnectDatabase } from './config/database';
import logger from './utils/logger';

const PORT = process.env.PORT || 5530;

const startServer = async () => {
  try {
    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(` Server is running on port ${PORT}`);
      logger.info(` Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(` API Base URL: http://localhost:${PORT}/api`);
      logger.info(` Health Check: http://localhost:${PORT}/api/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await disconnectDatabase();
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals (graceful)
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle critical errors (immediate exit)
    const handleCriticalError = async (error: Error | any, source: string) => {
      logger.error(`${source}:`, error);
      try {
        await disconnectDatabase();
      } catch (dbError) {
        logger.error('Error disconnecting database:', dbError);
      }
      process.exit(1);
    };

    process.on('uncaughtException', (error) => handleCriticalError(error, 'Uncaught Exception'));
    process.on('unhandledRejection', (reason) => handleCriticalError(reason, 'Unhandled Rejection'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
