/**
 * Seed script – wipes the database and inserts demo data.
 *
 *   npm run seed
 *
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD from .env.
 * Reads seed/images.json (created via `npm run seed:images`).
 * If images.json is missing, falls back to local placeholders and informs the user.
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from '../config/db.js';
import Admin from '../models/Admin.js';
import Setting from '../models/Setting.js';
import Puppy from '../models/Puppy.js';
import HappyFamily from '../models/HappyFamily.js';
import Testimonial from '../models/Testimonial.js';
import Faq from '../models/Faq.js';
import Enquiry from '../models/Enquiry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const IMAGES_JSON_PATH = path.join(__dirname, 'images.json');

const UPLOADS_PUPPIES = path.join(ROOT, 'public', 'uploads', 'puppies');
const UPLOADS_FAMILIES = path.join(ROOT, 'public', 'uploads', 'families');

function ensureDirs() {
  [UPLOADS_PUPPIES, UPLOADS_FAMILIES].forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
  });
}

function createPlaceholder(dir, filename, label, bgColor = '#e8d5c0', textColor = '#7a5c3f') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <rect width="600" height="600" fill="${bgColor}" rx="12"/>
  <text x="300" y="280" font-family="Arial,sans-serif" font-size="22" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${label}</text>
  <text x="300" y="330" font-family="Arial,sans-serif" font-size="56" text-anchor="middle" dominant-baseline="middle">🐶</text>
</svg>`;
  fs.writeFileSync(path.join(dir, filename), svg);
  const rel = dir.includes('families') ? 'families' : 'puppies';
  return `/uploads/${rel}/${filename}`;
}

const AVAILABLE_PUPPIES = [
  {
    name: 'Maltipoo',
    breed: 'Maltipoo',
    breedGroups: ['maltipoo'],
    gender: 'girl',
    ageLabel: '2 months',
    origin: 'local',
    description: 'Charming Maltipoo girl with a silky, hypoallergenic coat. Playful and gentle.',
    featuredOnHero: true,
    showOnHome: true,
  },
  {
    name: 'Korean Teacup Pomeranian',
    breed: 'Pomeranian',
    breedGroups: ['pomeranian'],
    gender: 'girl',
    ageLabel: '2 months',
    origin: 'imported',
    description: 'Ultra-small Korean Teacup Pomeranian girl with a stunning bear face and thick double coat.',
    featuredOnHero: true,
    showOnHome: true,
  },
  {
    name: 'Toy Poodle (Red)',
    breed: 'Toy Poodle',
    breedGroups: ['poodle'],
    gender: 'boy',
    ageLabel: '2.5 months',
    origin: 'local',
    description: 'Vibrant deep-red Toy Poodle boy. Highly intelligent, affectionate, and easy to train.',
    featuredOnHero: true,
    showOnHome: true,
  },
  {
    name: 'Korean Teacup Poodle',
    breed: 'Toy Poodle',
    breedGroups: ['poodle'],
    gender: 'girl',
    ageLabel: '2 months',
    origin: 'imported',
    description: 'Petite Korean Teacup Poodle girl with curly apricot fur. Playful, sweet, and tiny.',
    featuredOnHero: true,
    showOnHome: true,
  },
  {
    name: 'Korean Teacup Pomeranian',
    breed: 'Pomeranian',
    breedGroups: ['pomeranian'],
    gender: 'boy',
    ageLabel: '2 months',
    origin: 'imported',
    description: 'Cream Korean Teacup Pomeranian boy with a lush coat and spunky personality.',
    featuredOnHero: true,
    showOnHome: true,
  },
  {
    name: 'Teacup Cavapoo',
    breed: 'Cavapoo',
    breedGroups: ['cavapoo'],
    gender: 'girl',
    ageLabel: '2 months',
    origin: 'local',
    description: 'Sweet Teacup Cavapoo girl. Friendly, loving, and wonderful with families and children.',
    featuredOnHero: true,
    showOnHome: true,
  },
  {
    name: 'Korean Teacup Maltese',
    breed: 'Maltese',
    breedGroups: ['other'],
    gender: 'girl',
    ageLabel: '2 months',
    origin: 'imported',
    description: 'Pure white Korean Teacup Maltese girl with button eyes and a baby-doll face.',
    showOnHome: true,
  },
  {
    name: 'Maltipoo',
    breed: 'Maltipoo',
    breedGroups: ['maltipoo'],
    gender: 'boy-and-girl',
    ageLabel: '2 months',
    origin: 'local',
    description: 'Brother and sister Maltipoo pair. Can be adopted together or separately.',
    showOnHome: true,
  },
  {
    name: 'Shih Tzu',
    breed: 'Shih Tzu',
    breedGroups: ['shih-tzu'],
    gender: 'girl',
    ageLabel: '2 months',
    origin: 'local',
    description: 'Sweet Shih Tzu girl with a beautiful long coat. Calm and loving.',
    showOnHome: true,
  },
  {
    name: 'Shih Tzu',
    breed: 'Shih Tzu',
    breedGroups: ['shih-tzu'],
    gender: 'boy',
    ageLabel: '2 months',
    origin: 'local',
    description: 'Playful Shih Tzu boy. Great with kids and other pets.',
    showOnHome: true,
  },
  {
    name: 'Maltipoo',
    breed: 'Maltipoo',
    breedGroups: ['maltipoo'],
    gender: 'girl',
    ageLabel: '2.5 months',
    origin: 'local',
    description: 'Adorable Maltipoo girl, almost 3 months. Fluffy apricot coat.',
    showOnHome: true,
  },
  {
    name: 'Maltipoo',
    breed: 'Maltipoo',
    breedGroups: ['maltipoo'],
    gender: 'girl',
    ageLabel: '2 months',
    origin: 'imported',
    description: 'Imported Maltipoo girl with a teddy-bear face. Tiny and adorable.',
    showOnHome: true,
  },
  {
    name: 'Korean Teacup Pomeranian',
    breed: 'Pomeranian',
    breedGroups: ['pomeranian'],
    gender: 'girl',
    ageLabel: '2 months',
    origin: 'imported',
    description: 'Imported Korean Teacup Pomeranian girl. Compact and fluffy.',
    showOnHome: true,
  },
  {
    name: 'Korean Teacup Pomeranian',
    breed: 'Pomeranian',
    breedGroups: ['pomeranian'],
    gender: 'girl',
    ageLabel: '2 months',
    origin: 'imported',
    description: 'Another gorgeous Korean Teacup Pomeranian girl. Show-quality coat.',
    showOnHome: true,
  },
  {
    name: 'Korean Teacup Pomeranian',
    breed: 'Pomeranian',
    breedGroups: ['pomeranian'],
    gender: 'boy',
    ageLabel: '2 months',
    origin: 'imported',
    description: 'Handsome Korean Teacup Pomeranian boy. Bold and lively.',
    showOnHome: true,
  },
];

const GONE_HOME_PUPPIES = [
  {
    name: 'Ace',
    breed: 'Maltipoo',
    breedGroups: ['maltipoo'],
    gender: 'boy',
    ageLabel: '4 months',
    origin: 'local',
    status: 'gone-home',
    goneHomeAt: new Date('2026-08-15'),
    showOnHome: false,
    description: 'Ace found his forever family in Dubai Marina!',
  },
  {
    name: 'Coco',
    breed: 'Pomeranian',
    breedGroups: ['pomeranian'],
    gender: 'girl',
    ageLabel: '3.5 months',
    origin: 'imported',
    status: 'gone-home',
    goneHomeAt: new Date('2026-08-20'),
    showOnHome: false,
    description: 'Coco is now pampered in Palm Jumeirah.',
  },
  {
    name: 'Teddy',
    breed: 'Toy Poodle',
    breedGroups: ['poodle'],
    gender: 'boy',
    ageLabel: '4 months',
    origin: 'local',
    status: 'gone-home',
    goneHomeAt: new Date('2026-09-01'),
    showOnHome: false,
    description: 'Teddy found his forever home in Abu Dhabi.',
  },
  {
    name: 'Luna',
    breed: 'Maltese',
    breedGroups: ['other'],
    gender: 'girl',
    ageLabel: '3 months',
    origin: 'imported',
    status: 'gone-home',
    goneHomeAt: new Date('2026-09-10'),
    showOnHome: false,
    description: 'Luna is happily living in Downtown Dubai.',
  },
  {
    name: 'Milo',
    breed: 'Cavapoo',
    breedGroups: ['cavapoo'],
    gender: 'boy',
    ageLabel: '3.5 months',
    origin: 'local',
    status: 'gone-home',
    goneHomeAt: new Date('2026-09-18'),
    showOnHome: false,
    description: 'Milo is the newest member of a wonderful family in Dubai.',
  },
];

const HAPPY_FAMILIES = [
  { alt: 'Family with Maltipoo puppy', caption: 'The Johnsons & their new Maltipoo!' },
  { alt: 'Girl hugging Poodle puppy', caption: 'Little Emma with her Toy Poodle' },
  { alt: 'Couple with Cavapoo', caption: 'Happy new Cavapoo parents' },
  { alt: 'Family in living room with puppy', caption: 'Home sweet home with our bundle of joy' },
  { alt: 'Boy playing with Pomeranian', caption: 'Best friends from day one' },
  { alt: 'Puppy in new home', caption: 'Settling in wonderfully' },
  { alt: 'Maltipoo in garden', caption: 'Enjoying the backyard sunshine' },
  { alt: 'Family photo with Shih Tzu', caption: 'Welcome home, buddy!' },
  { alt: 'Kids with new puppy', caption: 'Smiles all around' },
  { alt: 'Puppy sleeping on couch', caption: 'Already queen of the couch' },
  { alt: 'Dog park outing', caption: 'First trip to the park' },
  { alt: 'Holiday family photo with puppy', caption: 'Our first holiday together' },
  { alt: 'Cozy cuddle moment', caption: 'Cuddle sessions are non-negotiable' },
  { alt: 'Downtown stroll', caption: 'Morning walks in Downtown Dubai' },
];

const TESTIMONIAL = {
  name: 'Sarah M.',
  location: 'Dubai, UAE',
  quote:
    'TeddyPups made our dream come true! Our little Maltipoo is the most loving and healthy puppy. The team was incredibly supportive throughout the whole process – from choosing the right breed to bringing our fur baby home. Highly recommend!',
  featured: true,
  sortOrder: 1,
};

const FAQS = [
  {
    question: 'What breeds do you specialise in?',
    answer:
      'We specialise in teacup and toy breeds including Maltipoo, Pomeranian, Toy Poodle, Cavapoo, and Shih Tzu. All our puppies are health-checked and come with vaccination records.',
    showOnHome: true,
    sortOrder: 1,
  },
  {
    question: 'How can I adopt a puppy?',
    answer:
      'Simply browse our available puppies, pick the one you love, and contact us via WhatsApp or the enquiry form. We\'ll arrange a visit to our showroom in Downtown Dubai so you can meet your new fur baby in person.',
    showOnHome: true,
    sortOrder: 2,
  },
  {
    question: 'Do you ship puppies?',
    answer:
      'Yes, we offer safe and comfortable delivery across the UAE. For international shipping, please contact us directly to discuss arrangements and requirements.',
    showOnHome: true,
    sortOrder: 3,
  },
  {
    question: 'Are the puppies vaccinated?',
    answer:
      'Absolutely. Every puppy receives age-appropriate vaccinations, de-worming, and a full veterinary health check before going to their new home. You\'ll receive a complete health booklet.',
    showOnHome: false,
    sortOrder: 4,
  },
  {
    question: 'What is included with my puppy?',
    answer:
      'Each puppy comes with a vaccination booklet, microchip, health certificate, a starter kit with food and treats, and lifetime breeder support.',
    showOnHome: false,
    sortOrder: 5,
  },
  {
    question: 'Do you offer a health guarantee?',
    answer:
      'Yes, all our puppies come with a health guarantee. We stand behind the health of every puppy we place and offer guidance on nutrition, training, and veterinary care.',
    showOnHome: false,
    sortOrder: 6,
  },
  {
    question: 'Can I visit the showroom?',
    answer:
      'Yes! We welcome visits to our Downtown Dubai showroom by appointment. This ensures a quiet, calm environment for each family and puppy.',
    showOnHome: false,
    sortOrder: 7,
  },
  {
    question: 'What is the difference between local and imported puppies?',
    answer:
      'Local puppies are born and raised in the UAE by verified breeders. Imported puppies come from trusted international breeders in South Korea and Europe, accompanied by a dedicated flight nanny.',
    showOnHome: false,
    sortOrder: 8,
  },
  {
    question: 'How do I prepare for my new puppy?',
    answer:
      'We provide a comprehensive puppy-care guide covering everything from setting up your home to feeding schedules and training tips. Our team is always available for advice after adoption.',
    showOnHome: false,
    sortOrder: 9,
  },
];

async function seed() {
  console.log('🌱 Seeding database...\n');
  await connectDB();

  // Wipe all collections
  await Promise.all([
    Admin.deleteMany({}),
    Setting.deleteMany({}),
    Puppy.deleteMany({}),
    HappyFamily.deleteMany({}),
    Testimonial.deleteMany({}),
    Faq.deleteMany({}),
    Enquiry.deleteMany({}),
  ]);
  console.log('✔ Collections wiped');

  ensureDirs();

  // Check if seed/images.json exists
  let cloudinaryData = null;
  if (fs.existsSync(IMAGES_JSON_PATH)) {
    try {
      cloudinaryData = JSON.parse(fs.readFileSync(IMAGES_JSON_PATH, 'utf-8'));
      console.log('✔ Found seed/images.json with Cloudinary assets!');
    } catch (e) {
      console.warn('⚠️ Could not parse seed/images.json, falling back to local placeholders.');
    }
  } else {
    console.log('ℹ️ seed/images.json not found. For live Cloudinary photos, run: npm run seed:images');
  }

  // Admin
  await Admin.create({
    email: process.env.ADMIN_EMAIL || 'admin@teddypups.ae',
    passwordHash: process.env.ADMIN_PASSWORD || 'admin123',
    name: 'TeddyPups Admin',
  });
  console.log('✔ Admin created');

  // Settings
  await Setting.create({
    whatsappNumber: '+971541676733',
    phone: '+971541676733',
    email: 'info@teddypups.ae',
    address: 'Downtown Dubai, UAE',
    mapsUrl: 'https://maps.google.com/?q=Downtown+Dubai',
    instagram: 'https://instagram.com/teddypups',
    tiktok: 'https://tiktok.com/@teddypups',
    facebook: 'https://facebook.com/teddypups',
    tagline: 'Your Teacup Puppy Showroom in Dubai',
    footerText: '© 2026 TeddyPups U.A.E. All rights reserved.',
    happyMomentsCount: 250,
    whatsappDefaultMessage: 'Hi TeddyPups! I\'m interested in adopting a puppy 🐶',
  });
  console.log('✔ Settings created');

  const puppyKeys = Object.keys(cloudinaryData?.puppies || {});

  // Available puppies
  for (let i = 0; i < AVAILABLE_PUPPIES.length; i++) {
    const data = AVAILABLE_PUPPIES[i];
    const key = puppyKeys[i];
    let images = [];
    let videoUrl = '';

    if (cloudinaryData && key && cloudinaryData.puppies[key]?.length > 0) {
      images = cloudinaryData.puppies[key].map((item) => ({
        url: item.url,
        publicId: item.publicId,
        alt: `${data.name} - ${data.breed}`,
      }));
    } else {
      const tempSlug = `puppy-${i + 1}`;
      images = [
        { url: createPlaceholder(UPLOADS_PUPPIES, `${tempSlug}-1.svg`, `${data.name} 1`), alt: data.name, publicId: '' },
        { url: createPlaceholder(UPLOADS_PUPPIES, `${tempSlug}-2.svg`, `${data.name} 2`), alt: data.name, publicId: '' },
      ];
    }

    // Attach videoUrl, videoPublicId, and videoPoster to puppies that have a video
    let videoPublicId = '';
    let videoPoster = '';
    if (cloudinaryData?.videos?.length > 0 && i < 3) {
      const vid = cloudinaryData.videos[i % cloudinaryData.videos.length];
      if (vid) {
        videoUrl = vid.url;
        videoPublicId = vid.publicId;
        videoPoster = vid.poster;
      }
    }

    await Puppy.create({
      ...data,
      images,
      videoUrl: videoUrl || undefined,
      videoPublicId: videoPublicId || undefined,
      videoPoster: videoPoster || undefined,
      sortOrder: i + 1,
    });
  }
  console.log(`✔ ${AVAILABLE_PUPPIES.length} available puppies created`);

  // Gone-home puppies
  for (let i = 0; i < GONE_HOME_PUPPIES.length; i++) {
    const data = GONE_HOME_PUPPIES[i];
    const key = puppyKeys[AVAILABLE_PUPPIES.length + i];
    let images = [];

    if (cloudinaryData && key && cloudinaryData.puppies[key]?.length > 0) {
      images = cloudinaryData.puppies[key].map((item) => ({
        url: item.url,
        publicId: item.publicId,
        alt: `${data.name} - ${data.breed}`,
      }));
    } else {
      const tempSlug = `gone-${i + 1}`;
      images = [
        { url: createPlaceholder(UPLOADS_PUPPIES, `${tempSlug}-1.svg`, `${data.name}`), alt: data.name, publicId: '' },
      ];
    }

    await Puppy.create({
      ...data,
      images,
      sortOrder: 100 + i,
    });
  }
  console.log(`✔ ${GONE_HOME_PUPPIES.length} gone-home puppies created`);

  // Happy families
  for (let i = 0; i < HAPPY_FAMILIES.length; i++) {
    const fam = HAPPY_FAMILIES[i];
    let imageUrl = '';
    let publicId = '';

    if (cloudinaryData?.families?.[i]) {
      imageUrl = cloudinaryData.families[i].url;
      publicId = cloudinaryData.families[i].publicId;
    } else {
      const filename = `family-${i + 1}.svg`;
      imageUrl = createPlaceholder(UPLOADS_FAMILIES, filename, fam.alt, '#f0e8e0', '#6b5744');
    }

    await HappyFamily.create({
      imageUrl,
      publicId,
      alt: fam.alt,
      caption: fam.caption,
      sortOrder: i + 1,
    });
  }
  console.log(`✔ ${HAPPY_FAMILIES.length} happy families created`);

  // Testimonial
  await Testimonial.create(TESTIMONIAL);
  console.log('✔ Testimonial created');

  // FAQs
  await Faq.insertMany(FAQS);
  console.log(`✔ ${FAQS.length} FAQs created`);

  console.log('\n✨ Database seeding completed successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
