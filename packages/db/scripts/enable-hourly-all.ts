import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating all listings to allow hourly rentals...');
  
  const listings = await prisma.listing.findMany();
  
  for (const listing of listings) {
    const hourlyRate = listing.pricePerDay / 8;
    await prisma.listing.update({
      where: { id: listing.id },
      data: {
        allowHourly: true,
        pricePerHour: hourlyRate
      }
    });
    console.log(`Updated listing: ${listing.title} with hourly rate: $${hourlyRate.toFixed(2)}`);
  }
  
  console.log('Done!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
