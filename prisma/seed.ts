import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function runSeed() {
  console.log("🌱 Running full ElectroHub seed...");

  // --- ADMIN USER ---
  const adminPassword = await bcrypt.hash('123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@electrohub.com' },
    update: {},
    create: {
      email: 'admin@electrohub.com',
      password: adminPassword,
      role: 'admin',
      name: 'Admin User',
      description: 'Default admin account',
      isVerified: true,
    },
  });

  // --- NORMAL USER ---
  const userPassword = await bcrypt.hash('123456', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@electrohub.com' },
    update: {},
    create: {
      email: 'user@electrohub.com',
      password: userPassword,
      role: 'user',
      name: 'Normal User',
      description: 'Default normal user',
      isVerified: true,
    },
  });

  // --- CATEGORIES ---
  await prisma.category.createMany({
    data: [
      { name: "Telefoane" },
      { name: "Laptopuri" },
      { name: "Componente PC" },
      { name: "Audio-Video" },
      { name: "Electrocasnice" },
    ],
    skipDuplicates: true,
  });

  const categories = await prisma.category.findMany();

  // --- PRODUCTS ---
  await prisma.product.createMany({
    data: [
      {
        name: "iPhone 14 Pro",
        price: 4500,
        stock: 5,
        images: ["https://via.placeholder.com/300"],
        userId: user.id,
        categoryId: categories[0].id,
        description: "Telefon premium, stare excelentă",
      },
      {
        name: "Samsung Galaxy S22",
        price: 3200,
        stock: 3,
        images: ["https://via.placeholder.com/300"],
        userId: user.id,
        categoryId: categories[0].id,
      },
      {
        name: "Laptop ASUS ROG",
        price: 5500,
        stock: 2,
        images: ["https://via.placeholder.com/300"],
        userId: user.id,
        categoryId: categories[1].id,
      },
    ],
  });

  // --- ADDRESS ---
  await prisma.address.create({
    data: {
      userId: user.id,
      name: "Adresa principală",
      address: "Strada Exemplu 123",
      city: "Iași",
    },
  });

  // --- SAVED SEARCH ---
  await prisma.savedSearch.create({
    data: {
      userId: user.id,
      query: "iphone",
      filters: { priceMin: 1000, priceMax: 5000 },
    },
  });

  // --- RATING ---
  await prisma.rating.create({
    data: {
      fromUserId: user.id,
      toUserId: admin.id,
      stars: 5,
      comment: "Super experiență!",
    },
  });

  // --- NOTIFICATION ---
  await prisma.notification.create({
    data: {
      userId: user.id,
      text: "Bun venit pe ElectroHub!",
    },
  });

  // --- CONVERSATION + MESSAGE ---
  const conv = await prisma.conversation.create({
    data: {
      buyerId: user.id,
      sellerId: admin.id,
      productId: 1,
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv.id,
      senderId: user.id,
      text: "Salut! Este disponibil produsul?",
    },
  });

  // --- ORDER + ORDER ITEMS ---
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total: 4500,
      items: {
        create: [
          {
            productId: 1,
            quantity: 1,
            price: 4500,
          },
        ],
      },
    },
  });

  // --- SHIPMENT ---
  await prisma.shipment.create({
    data: {
      orderId: order.id,
      courier: "FanCourier",
      status: "in_preparing",
    },
  });

  console.log("🌱 Full seed completed!");
}

async function main() {
  await runSeed();
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
