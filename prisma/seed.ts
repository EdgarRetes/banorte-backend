import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear roles base
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER' },
  });

  // Crear usuario administrador
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
  const adminHashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: 'admin@local.com' },
    update: { password: adminHashed, roleId: adminRole.id },
    create: {
      firstName: 'Admin',
      lastName1: 'User',
      email: 'admin@local.com',
      password: adminHashed,
      roleId: adminRole.id,
    },
  });

  // Crear usuario normal de prueba
  const userPassword = process.env.SEED_USER_PASSWORD || 'User123!';
  const userHashed = await bcrypt.hash(userPassword, 10);

  await prisma.user.upsert({
    where: { email: 'user@local.com' },
    update: { password: userHashed, roleId: userRole.id },
    create: {
      firstName: 'Usuario',
      lastName1: 'Normal',
      email: 'user@local.com',
      password: userHashed,
      roleId: userRole.id,
    },
  });

  console.log('Seed completado correctamente.');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
