import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

let prismaInstance: PrismaClient | null = null;

export const getPrismaClient = (): PrismaClient => {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
    });

    // Log database queries in development
    if (process.env.NODE_ENV === 'development') {
      prismaInstance.$on('query' as never, (e: any) => {
        logger.debug('Query: ' + e.query);
        logger.debug('Duration: ' + e.duration + 'ms');
      });
    }

    prismaInstance.$on('error' as never, (e: any) => {
      logger.error('Database error:', e);
    });

    prismaInstance.$on('warn' as never, (e: any) => {
      logger.warn('Database warning:', e);
    });

    logger.info('Database connection established');
  }

  return prismaInstance;
};

export const disconnectDatabase = async (): Promise<void> => {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    logger.info('Database connection closed');
    prismaInstance = null;
  }
};

export const prisma = getPrismaClient();
