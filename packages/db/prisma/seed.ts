// packages/db/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { name: "Sockets & Drives",      slug: "sockets-drives",    iconName: "circle-dot" },
  { name: "Wrenches",              slug: "wrenches",           iconName: "wrench" },
  { name: "Power Tools",           slug: "power-tools",        iconName: "zap" },
  { name: "Hand Tools",            slug: "hand-tools",         iconName: "hammer" },
  { name: "Measuring & Levels",    slug: "measuring",          iconName: "ruler" },
  { name: "Plumbing",              slug: "plumbing",           iconName: "droplets" },
  { name: "Electrical",            slug: "electrical",         iconName: "plug" },
  { name: "Automotive",            slug: "automotive",         iconName: "car" },
  { name: "Garden & Outdoor",      slug: "garden",             iconName: "leaf" },
  { name: "Ladders & Scaffolding", slug: "ladders",            iconName: "arrow-up" },
  { name: "Kits & Sets",           slug: "kits-sets",          iconName: "package" },
  { name: "Other",                 slug: "other",              iconName: "more-horizontal" },
];

const platformConfigs = [
  { key: 'platform_fee_percent',        value: '25' },
  { key: 'lender_fee_percent',          value: '15' },
  { key: 'renter_fee_percent',          value: '10' },
  { key: 'damage_protection_percent',   value: '15' },
  { key: 'payout_delay_hours',          value: '24' },
  { key: 'default_delivery_fee',        value: '4.99' },
  { key: 'default_delivery_radius_km',  value: '25' },
];

// Reusing some of our mock listings logic to seed the DB
const mockLenders = [
  { email: 'marcus@example.com', firstName: 'Marcus', lastName: 'T.' },
  { email: 'sarah@example.com', firstName: 'Sarah', lastName: 'K.' },
  { email: 'james@example.com', firstName: 'James', lastName: 'R.' },
];

const mockListingsData = [
  {
    slug: 'dewalt-20v-max-impact-driver',
    title: 'DeWalt 20V MAX Impact Driver Kit',
    brand: 'DeWalt',
    model: 'DCF887D2',
    condition: 'EXCELLENT',
    images: ['/tools/impact-driver.png'],
    pricePerDay: 18,
    pricePerWeek: 95,
    depositAmount: 90,
    deliveryOption: 'BOTH',
    deliveryFee: 5.99,
    deliveryRadiusKm: 15,
    latitude: 43.6532,
    longitude: -79.3832,
    categorySlug: 'power-tools',
    description: 'High-performance 20V MAX impact driver with brushless motor. Includes 2 batteries, charger, and hard case. Perfect for decking, framing, and general construction. Three-speed settings with precision drive mode for delicate fastening applications.',
    instantBook: true,
    lenderEmail: 'admin@tooldrop.ca',
    isOfficial: true,
  },
  {
    slug: 'makita-circular-saw-7-25',
    title: 'Makita 7-1/4" Circular Saw',
    brand: 'Makita',
    model: '5007MGA',
    condition: 'GOOD',
    images: ['/tools/circular-saw.png'],
    pricePerDay: 22,
    pricePerWeek: 120,
    depositAmount: 110,
    deliveryOption: 'BOTH',
    deliveryFee: 7.99,
    deliveryRadiusKm: 20,
    latitude: 43.6426,
    longitude: -79.3871,
    categorySlug: 'power-tools',
    description: 'Magnesium construction for a lightweight but durable saw. 15 AMP motor delivers 5,800 RPM. Built-in dust blower keeps line of cut free from sawdust. Electric brake for additional safety.',
    instantBook: false,
    lenderEmail: 'admin@tooldrop.ca',
    isOfficial: true,
  },
  {
    slug: 'bosch-laser-level-360',
    title: 'Bosch 360° Green Laser Level',
    brand: 'Bosch',
    model: 'GLL3-330CG',
    condition: 'LIKE_NEW',
    images: ['/tools/laser-level.png'],
    pricePerDay: 35,
    pricePerWeek: 180,
    depositAmount: 200,
    deliveryOption: 'PICKUP_ONLY',
    latitude: 43.6711,
    longitude: -79.3865,
    categorySlug: 'measuring',
    description: 'Connected 360-degree three-plane green line laser with layout beam. Bluetooth connectivity for remote control. Self-leveling accuracy of ±1/8" at 33 ft. Includes mounting device and carrying case.',
    instantBook: true,
    lenderEmail: 'admin@tooldrop.ca',
    isOfficial: true,
  },
  {
    slug: 'milwaukee-m18-hammer-drill',
    title: 'Milwaukee M18 FUEL Hammer Drill',
    brand: 'Milwaukee',
    model: '2804-22',
    condition: 'EXCELLENT',
    images: ['/tools/hammer-drill.png'],
    pricePerDay: 20,
    pricePerWeek: 110,
    depositAmount: 100,
    deliveryOption: 'BOTH',
    deliveryFee: 4.99,
    deliveryRadiusKm: 25,
    latitude: 43.6505,
    longitude: -79.3745,
    categorySlug: 'power-tools',
    description: 'Powerstate brushless motor delivers up to 1,400 in-lbs of torque. Autostop control mode for enhanced safety. Redlink Plus intelligence provides optimized performance and overload protection.',
    instantBook: true,
    lenderEmail: 'admin@tooldrop.ca',
    isOfficial: true,
  },
  {
    slug: 'ridgid-pipe-wrench-set',
    title: 'Ridgid Heavy-Duty Pipe Wrench Set (3pc)',
    brand: 'Ridgid',
    condition: 'GOOD',
    images: ['/tools/pipe-wrench.png'],
    pricePerDay: 12,
    pricePerWeek: 65,
    depositAmount: 60,
    deliveryOption: 'BOTH',
    deliveryFee: 4.99,
    deliveryRadiusKm: 15,
    latitude: 43.6629,
    longitude: -79.3957,
    categorySlug: 'plumbing',
    description: 'Set of 3 professional-grade pipe wrenches (14", 18", 24"). Heavy-duty ductile iron construction. I-beam handles for maximum strength and minimum weight.',
    instantBook: false,
    lenderEmail: 'james@example.com',
  },
  {
    slug: 'craftsman-200pc-socket-set',
    title: 'Craftsman 200-Piece Mechanics Tool Set',
    brand: 'Craftsman',
    condition: 'EXCELLENT',
    images: ['/tools/socket-set.png'],
    pricePerDay: 25,
    pricePerWeek: 130,
    depositAmount: 150,
    deliveryOption: 'BOTH',
    deliveryFee: 6.99,
    deliveryRadiusKm: 20,
    latitude: 44.6488,
    longitude: -63.5752,
    categorySlug: 'sockets-drives',
    description: 'Comprehensive 200-piece mechanics tool set including 1/4", 3/8", and 1/2" drive ratchets and sockets. Covers SAE and Metric sizes, all shapes (6-point, 12-point). Includes extensions and universal joints. Perfect for automotive and heavy machinery work.',
    instantBook: true,
    lenderEmail: 'admin@tooldrop.ca',
    isOfficial: true,
  },
  {
    slug: 'irwin-bolt-extraction-set',
    title: 'Irwin Hanson Bolt Extractor Set (15-Piece)',
    brand: 'Irwin',
    condition: 'EXCELLENT',
    images: ['/tools/extractor-set.png'],
    pricePerDay: 15,
    pricePerWeek: 80,
    depositAmount: 70,
    deliveryOption: 'BOTH',
    deliveryFee: 4.99,
    deliveryRadiusKm: 20,
    latitude: 44.6511,
    longitude: -63.5901,
    categorySlug: 'hand-tools',
    description: 'Professional grade bolt extractor set. Reverse spiral flutes are designed to bite down to provide maximum gripping power. High carbon steel ensures longer life and greater durability. Works with hand ratchets, impact wrenches, and air ratchets.',
    instantBook: true,
    lenderEmail: 'admin@tooldrop.ca',
    isOfficial: true,
  },
  {
    slug: 'bondhus-hex-key-set-all',
    title: 'Bondhus ProHold Hex Key Set (Metric & SAE)',
    brand: 'Bondhus',
    condition: 'EXCELLENT',
    images: ['/tools/allen-keys.png'],
    pricePerDay: 8,
    pricePerWeek: 40,
    depositAmount: 30,
    deliveryOption: 'BOTH',
    deliveryFee: 3.99,
    deliveryRadiusKm: 20,
    latitude: 44.6455,
    longitude: -63.5721,
    categorySlug: 'hand-tools',
    description: 'Full set of Bondhus ProHold hex keys (Allen keys). Includes both Metric and SAE sets. Ball end tips allow for up to a 25-degree entry angle. ProGuard finish for superior corrosion protection. Includes heavy-duty carrying cases.',
    instantBook: true,
    lenderEmail: 'admin@tooldrop.ca',
    isOfficial: true,
  },
  {
    slug: 'honda-eu2200i-generator',
    title: 'Honda 2200W Portable Inverter Generator',
    brand: 'Honda',
    model: 'EU2200i',
    condition: 'EXCELLENT',
    images: ['/tools/generator.png'],
    pricePerDay: 45,
    pricePerWeek: 220,
    depositAmount: 300,
    deliveryOption: 'PICKUP_ONLY',
    latitude: 44.6622,
    longitude: -63.6122,
    categorySlug: 'power-tools',
    description: 'Super quiet portable inverter generator. Ideal for construction sites, camping, or emergency home backup. Delivers 2200 watts of clean, stable power. Extremely fuel-efficient, running up to 8.1 hours on a single gallon of fuel.',
    instantBook: true,
    lenderEmail: 'admin@tooldrop.ca',
    isOfficial: true,
  },
  {
    slug: 'husqvarna-450e-chainsaw',
    title: 'Husqvarna 450e II Gas Chainsaw',
    brand: 'Husqvarna',
    model: '450e II',
    condition: 'GOOD',
    images: ['/tools/chainsaw.png'],
    pricePerDay: 35,
    pricePerWeek: 180,
    depositAmount: 150,
    deliveryOption: 'BOTH',
    deliveryFee: 9.99,
    deliveryRadiusKm: 15,
    latitude: 44.6712,
    longitude: -63.6055,
    categorySlug: 'garden',
    description: 'Powerful second-generation all-round saw for people who value professional qualities in a saw. Starts easily even with a slower pull, comes with flip-up tank caps. The X-Torq® motor means lower fuel consumption and reduced emission levels.',
    instantBook: false,
    lenderEmail: 'admin@tooldrop.ca',
    isOfficial: true,
  },
  {
    slug: 'werner-22ft-multi-ladder',
    title: 'Werner 22 ft. Aluminum Multi-Position Ladder',
    brand: 'Werner',
    model: 'MT-22',
    condition: 'EXCELLENT',
    images: ['/tools/ladder.png'],
    pricePerDay: 25,
    pricePerWeek: 120,
    depositAmount: 100,
    deliveryOption: 'BOTH',
    deliveryFee: 14.99,
    deliveryRadiusKm: 20,
    latitude: 44.6433,
    longitude: -63.5822,
    categorySlug: 'ladders',
    description: 'Professional grade 22 ft. multi-position ladder. 28 different working positions: extension ladder, stepladder, stairway stepladder, as well as 2 scaffold bases. Shatterproof J-locks and oversized slip-resistant feet.',
    instantBook: true,
    lenderEmail: 'admin@tooldrop.ca',
    isOfficial: true,
  },
  {
    slug: 'ryobi-leaf-blower-18v',
    title: 'Ryobi ONE+ 18V Brushless Leaf Blower',
    brand: 'Ryobi',
    model: 'P21010',
    condition: 'LIKE_NEW',
    images: ['/tools/leaf-blower.png'],
    pricePerDay: 15,
    pricePerWeek: 75,
    depositAmount: 50,
    deliveryOption: 'BOTH',
    deliveryFee: 5.99,
    deliveryRadiusKm: 25,
    latitude: 44.6355,
    longitude: -63.5688,
    categorySlug: 'garden',
    description: 'Lightweight and powerful brushless leaf blower. Variable speed trigger for maximum clearing power. Jet fan design for airflow up to 350 CFM. Quiet operation compared to gas blowers. Includes 4.0Ah battery and charger.',
    instantBook: true,
    lenderEmail: 'admin@tooldrop.ca',
    isOfficial: true,
  },
  {
    slug: 'dewalt-table-saw-10in',
    title: 'DeWalt 10-Inch Jobsite Table Saw',
    brand: 'DeWalt',
    model: 'DWE7491RS',
    condition: 'EXCELLENT',
    images: ['/tools/table-saw.png'],
    pricePerDay: 40,
    pricePerWeek: 200,
    depositAmount: 250,
    deliveryOption: 'PICKUP_ONLY',
    latitude: 44.6588,
    longitude: -63.5788,
    categorySlug: 'power-tools',
    description: '10-inch jobsite table saw with rolling stand. Rack and pinion fence system makes fence adjustments fast, smooth and accurate. 32-1/2 inch rip capacity easily cuts a variety of larger shelving and trim materials.',
    instantBook: true,
    lenderEmail: 'admin@tooldrop.ca',
    isOfficial: true,
  },
  {
    slug: 'the-legendary-10mm-socket',
    title: 'DeWalt 10mm Deep Socket (3/8" Drive)',
    brand: 'DeWalt',
    model: 'DWASPT10',
    condition: 'EXCELLENT',
    images: ['/tools/10mm-socket.png'],
    pricePerDay: 2,
    pricePerWeek: 10,
    depositAmount: 5,
    deliveryOption: 'PICKUP_ONLY',
    latitude: 44.6488,
    longitude: -63.5752,
    categorySlug: 'sockets-drives',
    description: 'Lost yours again? We’ve got you. Rent the legendary 10mm deep socket by itself. 3/8" drive, 6-point, chrome vanadium steel. Save yourself a trip to the store and a $15 replacement cost.',
    instantBook: true,
    lenderEmail: 'admin@tooldrop.ca',
    isOfficial: true,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Seed categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`  ✓ ${categories.length} categories seeded`);

  // Seed platform config
  for (const config of platformConfigs) {
    await prisma.platformConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }
  console.log(`  ✓ ${platformConfigs.length} platform configs seeded`);

  // Seed admin user
  const adminEmail = 'admin@tooldrop.ca';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  let adminId = existingAdmin?.id;
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD || 'admin123dev', 12);
    const newAdmin = await prisma.user.create({
      data: {
        email: adminEmail,
        firstName: 'Admin',
        lastName: 'ToolDrop',
        role: 'ADMIN',
        status: 'ACTIVE',
        emailVerified: new Date(),
        passwordHash,
      },
    });
    adminId = newAdmin.id;
    console.log('  ✓ Admin user seeded (admin@tooldrop.ca)');
  } else {
    console.log('  ✓ Admin user already exists');
  }

  // Seed Mock Lenders
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const createdLenders: Record<string, string> = {};
  if (adminId) createdLenders[adminEmail] = adminId;
  
  for (const lender of mockLenders) {
    const user = await prisma.user.upsert({
      where: { email: lender.email },
      update: {},
      create: {
        email: lender.email,
        firstName: lender.firstName,
        lastName: lender.lastName,
        role: 'LENDER',
        status: 'ACTIVE',
        passwordHash,
      },
    });
    createdLenders[lender.email] = user.id;
  }
  console.log(`  ✓ ${mockLenders.length} mock lenders seeded`);

  // Seed Mock Listings
  const categoryMap = await prisma.category.findMany().then(cats => 
    cats.reduce((acc, cat) => ({ ...acc, [cat.slug]: cat.id }), {} as Record<string, string>)
  );

  for (const data of mockListingsData) {
    const { lenderEmail, categorySlug, ...listingData } = data;
    
    const listingUpsertData = {
        ...listingData,
        condition: listingData.condition as any,
        deliveryOption: listingData.deliveryOption as any,
        lenderId: createdLenders[lenderEmail],
        categoryId: categoryMap[categorySlug],
        isApproved: true,
        isAvailable: true,
      };

    await prisma.listing.upsert({
      where: { slug: listingData.slug },
      update: {
        images: listingData.images,
        title: listingData.title,
        description: listingData.description,
        pricePerDay: listingData.pricePerDay,
        isApproved: true,
        isAvailable: true,
      },
      create: listingUpsertData,
    });
  }
  console.log(`  ✓ ${mockListingsData.length} mock listings seeded`);

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
