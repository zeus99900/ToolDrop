import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'zdalshorman@gmail.com' }
  });
  
  if (user) {
    console.log(`User ${user.email} has role: ${user.role}`);
    if (user.role !== 'ADMIN') {
      console.log('Promoting user to ADMIN...');
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' }
      });
      console.log('User promoted successfully.');
    } else {
      console.log('User is already an ADMIN.');
    }
  } else {
    console.log('User not found.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
