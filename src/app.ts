import express, { Application } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import {
  securityHeaders,
  corsOptions,
  compressionMiddleware,
  rateLimiter,
  requestLogger,
} from './middlewares/security.middleware';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import routes from './routes';
import logger from './utils/logger';
import { swaggerSpec } from './docs/swagger';

// Load environment variables
dotenv.config();

// Create Express application
const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(securityHeaders);
  app.use(corsOptions);
  app.use(compressionMiddleware);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging
  app.use(requestLogger);

  // Rate limiting
  app.use(rateLimiter);

  // Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'E-Commerce API Docs',
  }));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', version: 'v1' });
  });

  // API routes 
  app.use('/api/v1', routes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler 
  app.use(errorHandler);

  logger.info('Express application configured');

  return app;
};

export default createApp;
