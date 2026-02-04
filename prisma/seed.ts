import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- CREATE ADMIN USER ---
  const adminPassword = await bcrypt.hash('123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@electrohub.com' },
    update: {},
    create: {
      email: 'admin@electrohub.com',
      password: adminPassword,
      role: 'ADMIN',
      name: 'Admin User',
    },
  });

  // --- CREATE NORMAL USER ---
  const userPassword = await bcrypt.hash('123456', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@electrohub.com' },
    update: {},
    create: {
      email: 'user@electrohub.com',
      password: userPassword,
      role: 'USER',
      name: 'Normal User',
    },
  });

  // --- CREATE CATEGORIES ---
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Laptops' },
      { name: 'Smartphones' },
      { name: 'Accessories' },
    ],
    skipDuplicates: true,
  });

  // --- GET CATEGORY IDs ---
  const laptops = await prisma.category.findUnique({ where: { name: 'Laptops' } });
  const phones = await prisma.category.findUnique({ where: { name: 'Smartphones' } });
  const accessories = await prisma.category.findUnique({ where: { name: 'Accessories' } });

  // --- CREATE PRODUCTS ---
  await prisma.product.createMany({
    data: [
      {
        name: 'HP Pavilion 15',
        price: 3499,
        stock: 12,
        categoryId: laptops!.id,
      },
      {
        name: 'iPhone 14 Pro',
        price: 5999,
        stock: 8,
        categoryId: phones!.id,
      },
      {
        name: 'Samsung Galaxy S23',
        price: 4999,
        stock: 10,
        categoryId: phones!.id,
      },
      {
        name: 'Logitech MX Master 3S',
        price: 499,
        stock: 20,
        categoryId: accessories!.id,
      },
    ],
  });

  // --- CREATE SAMPLE ORDER FOR USER ---
  const product = await prisma.product.findFirst();

  if (product) {
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: product.price,
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        quantity: 1,
        price: product.price,
      },
    });
  }

  console.log('🌱 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
