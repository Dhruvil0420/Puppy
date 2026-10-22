import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import Puppy from '../models/Puppy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MEDIA_DIR = path.join(__dirname, '../puppy-media');
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'teddypups';

async function seedFromLocalFolder() {
  console.log(`\n======================================================`);
  console.log(`  Puppy Local Media & Seed Script`);
  console.log(`======================================================\n`);

  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI missing from .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log(' Connected to MongoDB');

  if (!fs.existsSync(MEDIA_DIR)) {
    console.log(`ℹ️  Directory '${MEDIA_DIR}' does not exist.`);
    console.log(`Creating directory '${MEDIA_DIR}' for local media uploads...`);
    fs.mkdirSync(MEDIA_DIR, { recursive: true });
    console.log(`Place your puppy media folders or files inside '${MEDIA_DIR}' to bulk-seed.\n`);
    await mongoose.disconnect();
    return;
  }

  const entries = fs.readdirSync(MEDIA_DIR, { withFileTypes: true });
  console.log(`📂 Scanning '${MEDIA_DIR}', found ${entries.length} items.\n`);

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const puppyName = entry.name;
      const puppyFolder = path.join(MEDIA_DIR, puppyName);
      const files = fs.readdirSync(puppyFolder);
      console.log(`\n🐾 Processing puppy: ${puppyName} (${files.length} files)`);

      const uploadedImages = [];
      let videoInfo = null;

      for (const file of files) {
        const filePath = path.join(puppyFolder, file);
        const ext = path.extname(file).toLowerCase();

        if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) {
          try {
            console.log(`   Uploading image: ${file}...`);
            const res = await cloudinary.uploader.upload(filePath, {
              folder: `${CLOUDINARY_FOLDER}/puppies`,
              resource_type: 'auto',
              transformation: [{ width: 1600, crop: 'limit' }, { quality: 'auto', fetch_format: 'auto' }],
            });
            uploadedImages.push({
              url: res.secure_url || res.url,
              publicId: res.public_id,
              alt: `${puppyName} photo`,
            });
          } catch (err) {
            console.error(`   ❌ Failed to upload image ${file}:`, err.message);
          }
        } else if (['.mp4', '.webm', '.mov'].includes(ext)) {
          try {
            console.log(`   Uploading video: ${file}...`);
            const res = await cloudinary.uploader.upload(filePath, {
              folder: `${CLOUDINARY_FOLDER}/videos`,
              resource_type: 'video',
            });
            videoInfo = {
              videoUrl: res.secure_url || res.url,
              videoPublicId: res.public_id,
              videoPoster: (res.secure_url || res.url).replace(/\.[^/.]+$/, '.jpg'),
            };
          } catch (err) {
            console.error(`   ❌ Failed to upload video ${file}:`, err.message);
          }
        }
      }

      if (uploadedImages.length > 0 || videoInfo) {
        const puppyDoc = {
          name: puppyName,
          breed: 'Teacup Puppy',
          gender: 'girl',
          origin: 'local',
          status: 'available',
          images: uploadedImages,
          ...(videoInfo || {}),
        };

        const created = await Puppy.create(puppyDoc);
        console.log(`   ✅ Puppy document created in MongoDB: ${created.name} (${created.slug})`);
      }
    }
  }

  console.log('\nSeeding from local media completed.');
  await mongoose.disconnect();
}

seedFromLocalFolder().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
