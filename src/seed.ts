import * as bcrypt from 'bcrypt';

export async function runSeed(prisma) {
  console.log("🌱 Running automatic seed...");

  // --- ADMIN USER ---
  const adminPassword = await bcrypt.hash('123456', 10);
  await prisma.user.upsert({
    where: { email: 'admin@electrohub.com' },
    update: {},
    create: {
      email: 'admin@electrohub.com',
      password: adminPassword,
      role: 'admin',
      name: 'Admin User',
      description: 'Default admin account',
      imageUrl: null,
    },
  });

  // --- NORMAL USER ---
  const userPassword = await bcrypt.hash('123456', 10);
  await prisma.user.upsert({
    where: { email: 'user@electrohub.com' },
    update: {},
    create: {
      email: 'user@electrohub.com',
      password: userPassword,
      role: 'user',
      name: 'Normal User',
      description: 'Default normal user',
      imageUrl: null,
    },
  });

  console.log("🌱 Seed completed!");
}
