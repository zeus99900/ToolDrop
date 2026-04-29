// Mock data for development — will be replaced with real DB queries
import type { ToolCondition, DeliveryOption } from './types';

export interface MockListing {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model?: string;
  condition: ToolCondition;
  images: string[];
  pricePerDay: number;
  pricePerWeek?: number;
  depositAmount: number;
  deliveryOption: DeliveryOption;
  deliveryFee?: number;
  deliveryRadiusKm?: number;
  latitude: number;
  longitude: number;
  avgRating?: number;
  totalRentals: number;
  viewCount: number;
  tags: string[];
  categorySlug: string;
  description: string;
  instantBook: boolean;
  lender: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    avgRatingAsLender?: number;
    totalRentals: number;
  };
}

export const mockListings: MockListing[] = [
  {
    id: '1',
    slug: 'dewalt-20v-max-impact-driver',
    title: 'DeWalt 20V MAX Impact Driver Kit',
    brand: 'DeWalt',
    model: 'DCF887D2',
    condition: 'EXCELLENT',
    images: ['/tools/impact-driver.jpg'],
    pricePerDay: 18,
    pricePerWeek: 95,
    depositAmount: 90,
    deliveryOption: 'BOTH',
    deliveryFee: 5.99,
    deliveryRadiusKm: 15,
    latitude: 43.6532,
    longitude: -79.3832,
    avgRating: 4.8,
    totalRentals: 47,
    viewCount: 312,
    tags: ['power-tool', 'cordless', '20V', 'impact'],
    categorySlug: 'power-tools',
    description: 'High-performance 20V MAX impact driver with brushless motor. Includes 2 batteries, charger, and hard case. Perfect for decking, framing, and general construction. Three-speed settings with precision drive mode for delicate fastening applications.',
    instantBook: true,
    lender: { id: 'l1', firstName: 'Marcus', lastName: 'T.', avgRatingAsLender: 4.9, totalRentals: 128 },
  },
  {
    id: '2',
    slug: 'makita-circular-saw-7-25',
    title: 'Makita 7-1/4" Circular Saw',
    brand: 'Makita',
    model: '5007MGA',
    condition: 'GOOD',
    images: ['/tools/circular-saw.jpg'],
    pricePerDay: 22,
    pricePerWeek: 120,
    depositAmount: 110,
    deliveryOption: 'BOTH',
    deliveryFee: 7.99,
    deliveryRadiusKm: 20,
    latitude: 43.6426,
    longitude: -79.3871,
    avgRating: 4.6,
    totalRentals: 35,
    viewCount: 198,
    tags: ['power-tool', 'corded', 'saw', 'cutting'],
    categorySlug: 'power-tools',
    description: 'Magnesium construction for a lightweight but durable saw. 15 AMP motor delivers 5,800 RPM. Built-in dust blower keeps line of cut free from sawdust. Electric brake for additional safety.',
    instantBook: false,
    lender: { id: 'l2', firstName: 'Sarah', lastName: 'K.', avgRatingAsLender: 4.7, totalRentals: 82 },
  },
  {
    id: '3',
    slug: 'bosch-laser-level-360',
    title: 'Bosch 360° Green Laser Level',
    brand: 'Bosch',
    model: 'GLL3-330CG',
    condition: 'LIKE_NEW',
    images: ['/tools/laser-level.jpg'],
    pricePerDay: 35,
    pricePerWeek: 180,
    depositAmount: 200,
    deliveryOption: 'PICKUP_ONLY',
    latitude: 43.6711,
    longitude: -79.3865,
    avgRating: 5.0,
    totalRentals: 12,
    viewCount: 156,
    tags: ['measuring', 'laser', 'precision', 'professional'],
    categorySlug: 'measuring',
    description: 'Connected 360-degree three-plane green line laser with layout beam. Bluetooth connectivity for remote control. Self-leveling accuracy of ±1/8" at 33 ft. Includes mounting device and carrying case.',
    instantBook: true,
    lender: { id: 'l3', firstName: 'James', lastName: 'R.', avgRatingAsLender: 5.0, totalRentals: 45 },
  },
  {
    id: '4',
    slug: 'milwaukee-m18-hammer-drill',
    title: 'Milwaukee M18 FUEL Hammer Drill',
    brand: 'Milwaukee',
    model: '2804-22',
    condition: 'EXCELLENT',
    images: ['/tools/hammer-drill.jpg'],
    pricePerDay: 20,
    pricePerWeek: 110,
    depositAmount: 100,
    deliveryOption: 'BOTH',
    deliveryFee: 4.99,
    deliveryRadiusKm: 25,
    latitude: 43.6505,
    longitude: -79.3745,
    avgRating: 4.7,
    totalRentals: 61,
    viewCount: 445,
    tags: ['power-tool', 'cordless', 'drill', '18V'],
    categorySlug: 'power-tools',
    description: 'Powerstate brushless motor delivers up to 1,400 in-lbs of torque. Autostop control mode for enhanced safety. Redlink Plus intelligence provides optimized performance and overload protection.',
    instantBook: true,
    lender: { id: 'l1', firstName: 'Marcus', lastName: 'T.', avgRatingAsLender: 4.9, totalRentals: 128 },
  },
  {
    id: '5',
    slug: 'ridgid-pipe-wrench-set',
    title: 'Ridgid Heavy-Duty Pipe Wrench Set (3pc)',
    brand: 'Ridgid',
    condition: 'GOOD',
    images: ['/tools/pipe-wrench.jpg'],
    pricePerDay: 12,
    pricePerWeek: 65,
    depositAmount: 60,
    deliveryOption: 'BOTH',
    deliveryFee: 4.99,
    deliveryRadiusKm: 15,
    latitude: 43.6629,
    longitude: -79.3957,
    avgRating: 4.4,
    totalRentals: 23,
    viewCount: 89,
    tags: ['plumbing', 'wrench', 'pipe', 'heavy-duty'],
    categorySlug: 'plumbing',
    description: 'Set of 3 professional-grade pipe wrenches (14", 18", 24"). Heavy-duty ductile iron construction. I-beam handles for maximum strength and minimum weight.',
    instantBook: false,
    lender: { id: 'l4', firstName: 'Mike', lastName: 'D.', avgRatingAsLender: 4.5, totalRentals: 38 },
  },
  {
    id: '6',
    slug: 'husqvarna-chainsaw-20',
    title: 'Husqvarna 20" Gas Chainsaw',
    brand: 'Husqvarna',
    model: '460 Rancher',
    condition: 'GOOD',
    images: ['/tools/chainsaw.jpg'],
    pricePerDay: 45,
    pricePerWeek: 240,
    depositAmount: 250,
    deliveryOption: 'PICKUP_ONLY',
    latitude: 43.6834,
    longitude: -79.3992,
    avgRating: 4.9,
    totalRentals: 18,
    viewCount: 267,
    tags: ['garden', 'chainsaw', 'gas', 'heavy-duty'],
    categorySlug: 'garden',
    description: '60.3cc X-Torq engine for lower fuel consumption and reduced emissions. 20" bar. Includes chain brake, anti-vibration system, and protective carrying case. Safety certification required.',
    instantBook: false,
    lender: { id: 'l5', firstName: 'Dave', lastName: 'W.', avgRatingAsLender: 4.8, totalRentals: 55 },
  },
  {
    id: '7',
    slug: 'fluke-digital-multimeter',
    title: 'Fluke 117 Digital Multimeter',
    brand: 'Fluke',
    model: '117',
    condition: 'LIKE_NEW',
    images: ['/tools/multimeter.jpg'],
    pricePerDay: 15,
    pricePerWeek: 80,
    depositAmount: 75,
    deliveryOption: 'BOTH',
    deliveryFee: 4.99,
    deliveryRadiusKm: 30,
    latitude: 43.6548,
    longitude: -79.3583,
    avgRating: 4.9,
    totalRentals: 29,
    viewCount: 178,
    tags: ['electrical', 'multimeter', 'testing', 'diagnostic'],
    categorySlug: 'electrical',
    description: 'True-RMS multimeter ideal for commercial electrical work. Non-contact voltage detection integrated. AutoVolt automatic AC/DC voltage selection. Cat III 600V safety rated.',
    instantBook: true,
    lender: { id: 'l3', firstName: 'James', lastName: 'R.', avgRatingAsLender: 5.0, totalRentals: 45 },
  },
  {
    id: '8',
    slug: 'werner-extension-ladder-28',
    title: 'Werner 28ft Fiberglass Extension Ladder',
    brand: 'Werner',
    model: 'D6228-2',
    condition: 'EXCELLENT',
    images: ['/tools/ladder.jpg'],
    pricePerDay: 25,
    pricePerWeek: 130,
    depositAmount: 150,
    deliveryOption: 'DELIVERY_ONLY',
    deliveryFee: 14.99,
    deliveryRadiusKm: 15,
    latitude: 43.6391,
    longitude: -79.4112,
    avgRating: 4.3,
    totalRentals: 41,
    viewCount: 312,
    tags: ['ladder', 'extension', 'fiberglass', 'heavy-duty'],
    categorySlug: 'ladders',
    description: '300 lb load capacity. Fiberglass rails for electrical safety. ALFLO rung joints for twist-proof performance. Includes rope and pulley system for easy extension.',
    instantBook: false,
    lender: { id: 'l2', firstName: 'Sarah', lastName: 'K.', avgRatingAsLender: 4.7, totalRentals: 82 },
  },
];

export const categories = [
  { name: "Sockets & Drives",      slug: "sockets-drives",    iconName: "circle-dot",       count: 24 },
  { name: "Wrenches",              slug: "wrenches",           iconName: "wrench",           count: 18 },
  { name: "Power Tools",           slug: "power-tools",        iconName: "zap",              count: 67 },
  { name: "Hand Tools",            slug: "hand-tools",         iconName: "hammer",           count: 43 },
  { name: "Measuring & Levels",    slug: "measuring",          iconName: "ruler",            count: 15 },
  { name: "Plumbing",              slug: "plumbing",           iconName: "droplets",         count: 12 },
  { name: "Electrical",            slug: "electrical",         iconName: "plug",             count: 21 },
  { name: "Automotive",            slug: "automotive",         iconName: "car",              count: 33 },
  { name: "Garden & Outdoor",      slug: "garden",             iconName: "leaf",             count: 28 },
  { name: "Ladders & Scaffolding", slug: "ladders",            iconName: "arrow-up",         count: 9 },
  { name: "Kits & Sets",           slug: "kits-sets",          iconName: "package",          count: 14 },
  { name: "Other",                 slug: "other",              iconName: "more-horizontal",  count: 7 },
];
