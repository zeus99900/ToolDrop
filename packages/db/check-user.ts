import { prisma } from './src/index';

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'alice@example.com' } });
  if (user) {
    console.log('User found in DB: YES');
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.firstName} ${user.lastName}`);
    console.log(`Role: ${user.role}`);
    console.log(`Is Password Hashed Correctly: ${user.passwordHash?.startsWith('$2')}`);
  } else {
    console.log('User found in DB: NO');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
