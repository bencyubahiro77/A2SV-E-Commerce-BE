import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import logger from '../src/utils/logger';

const prisma = new PrismaClient();

async function main() {
  logger.info('Starting database seeding...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@ecommerce.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  logger.info('Admin user created:', {
    email: 'admin@ecommerce.com',
    password: 'Admin@123456',
    role: 'ADMIN',
  });

  // Create Regular User
  const userPassword = await bcrypt.hash('User@123456', 12);
  await prisma.user.upsert({
    where: { email: 'user@ecommerce.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'user@ecommerce.com',
      password: userPassword,
      role: 'USER',
    },
  });

  logger.info('Regular user created:', {
    email: 'user@ecommerce.com',
    password: 'User@123456',
    role: 'USER',
  });

  // Create Sample Products
  await Promise.all([
    prisma.product.create({
      data: {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking',
        price: 29.99,
        stock: 200,
        category: 'Accessories',
        userId: admin.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'USB-C Hub',
        description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
        price: 49.99,
        stock: 150,
        category: 'Accessories',
        userId: admin.id,
      },
    })
  ]);

  logger.info('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    logger.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
