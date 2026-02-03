import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Create a user (admin)
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "$2b$10$2c6RzAV/EjMgpxxnZLlsseWkw.KRbVQMSZJbh/73oPJqatEbyq5QG"
,
      name: "Admin User",
    }
  });

  // 2. Create categories
  const laptops = await prisma.category.create({
    data: { name: "Laptops" },
  });

  const phones = await prisma.category.create({
    data: { name: "Phones" },
  });

  // 3. Create products
  await prisma.product.create({
    data: {
      name: "Dell XPS 15",
      description: "High-end laptop for professionals",
      price: 9000,
      stock: 5,
      categoryId: laptops.id,
      imageUrl: "https://example.com/xps15.jpg",
      userId: admin.id,
    },
  });

  await prisma.product.create({
    data: {
      name: "iPhone 15 Pro",
      description: "Latest Apple flagship phone",
      price: 7000,
      stock: 10,
      categoryId: phones.id,
      imageUrl: "https://example.com/iphone15.jpg",
      userId: admin.id,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
