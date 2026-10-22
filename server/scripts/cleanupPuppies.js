import 'dotenv/config';
import readline from 'readline';
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import Puppy from '../models/Puppy.js';

const isDryRun = process.argv.includes('--dry-run');
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'teddypups';

function promptConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function cleanup() {
  console.log(`\n======================================================`);
  console.log(`  Puppy Media & Document Cleanup Script`);
  console.log(`  Mode: ${isDryRun ? 'DRY-RUN (No changes will be made)' : 'LIVE DESTRUCTION'}`);
  console.log(`======================================================\n`);

  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI missing from .env');
    process.exit(1);
  }

  // 1. Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI);
  console.log(' Connected to MongoDB');

  // 2. Fetch all puppies
  const puppies = await Puppy.find({});
  console.log(`📋 Found ${puppies.length} puppy document(s) in MongoDB.\n`);

  const imageAssets = [];
  const videoAssets = [];

  for (const pup of puppies) {
    // Collect images
    if (Array.isArray(pup.images)) {
      for (const img of pup.images) {
        if (img?.publicId) {
          imageAssets.push({
            puppyId: pup._id,
            puppyName: pup.name,
            publicId: img.publicId,
            resourceType: 'image',
          });
        }
      }
    }
    // Collect videos
    if (pup.videoPublicId) {
      videoAssets.push({
        puppyId: pup._id,
        puppyName: pup.name,
        publicId: pup.videoPublicId,
        resourceType: 'video',
      });
    }
  }

  console.log(`🔎 Scan results:`);
  console.log(`   - Images with publicId : ${imageAssets.length}`);
  console.log(`   - Videos with publicId : ${videoAssets.length}`);
  console.log(`   - Total media assets   : ${imageAssets.length + videoAssets.length}`);
  console.log(`   - Puppies to remove    : ${puppies.length}\n`);

  if (isDryRun) {
    console.log(`[DRY-RUN] Sample images that would be deleted from Cloudinary:`);
    imageAssets.slice(0, 5).forEach((item) => {
      console.log(`   • [image] ${item.publicId} (${item.puppyName})`);
    });
    if (imageAssets.length > 5) {
      console.log(`   ... and ${imageAssets.length - 5} more.`);
    }

    console.log(`\n[DRY-RUN] Videos that would be deleted from Cloudinary:`);
    videoAssets.forEach((item) => {
      console.log(`   • [video] ${item.publicId} (${item.puppyName})`);
    });

    console.log(`\n[DRY-RUN] No media deleted and no database records modified.`);
    console.log(`[DRY-RUN] Run without '--dry-run' when you are ready to execute.\n`);
    await mongoose.disconnect();
    return;
  }

  // Live destruction confirmation
  const confirm = await promptConfirmation(
    `⚠️  Are you sure you want to permanently delete ALL ${imageAssets.length + videoAssets.length} Cloudinary assets and ${puppies.length} Puppy records? Type 'yes' to proceed: `
  );

  if (confirm !== 'yes') {
    console.log('\n❌ Action aborted by user. Nothing was deleted.');
    await mongoose.disconnect();
    return;
  }

  let deletedCloudinaryImages = 0;
  let deletedCloudinaryVideos = 0;
  let failedCloudinary = 0;

  console.log('\n🗑️  Deleting media assets from Cloudinary...');

  // Delete images
  for (const item of imageAssets) {
    try {
      const res = await cloudinary.uploader.destroy(item.publicId, { resource_type: 'image' });
      if (res.result === 'ok' || res.result === 'not found') {
        deletedCloudinaryImages++;
      } else {
        console.warn(`   ⚠️ Warning deleting ${item.publicId}: ${res.result}`);
        failedCloudinary++;
      }
    } catch (err) {
      console.error(`   ❌ Failed deleting image ${item.publicId}:`, err.message);
      failedCloudinary++;
    }
  }

  // Delete videos
  for (const item of videoAssets) {
    try {
      const res = await cloudinary.uploader.destroy(item.publicId, { resource_type: 'video' });
      if (res.result === 'ok' || res.result === 'not found') {
        deletedCloudinaryVideos++;
      } else {
        console.warn(`   ⚠️ Warning deleting video ${item.publicId}: ${res.result}`);
        failedCloudinary++;
      }
    } catch (err) {
      console.error(`   ❌ Failed deleting video ${item.publicId}:`, err.message);
      failedCloudinary++;
    }
  }

  // Also try deleting remaining assets in the puppies folder via Admin API
  try {
    console.log(`\n🧹 Checking for orphan files in folder '${CLOUDINARY_FOLDER}/puppies'...`);
    await cloudinary.api.delete_resources_by_prefix(`${CLOUDINARY_FOLDER}/puppies/`, {
      resource_type: 'image',
    });
    await cloudinary.api.delete_resources_by_prefix(`${CLOUDINARY_FOLDER}/puppies/`, {
      resource_type: 'video',
    });
  } catch (err) {
    console.warn(`   Notice: Admin API cleanup:`, err.message);
  }

  // Delete all Puppy documents from MongoDB
  console.log('\n🗑️  Removing Puppy documents from MongoDB...');
  const deleteResult = await Puppy.deleteMany({});
  const removedPuppies = deleteResult.deletedCount || 0;

  console.log(`\n======================================================`);
  console.log(`  Cleanup Summary:`);
  console.log(`   - Images deleted from Cloudinary : ${deletedCloudinaryImages}`);
  console.log(`   - Videos deleted from Cloudinary : ${deletedCloudinaryVideos}`);
  console.log(`   - Failed Cloudinary deletions    : ${failedCloudinary}`);
  console.log(`   - Puppy records deleted in Mongo : ${removedPuppies}`);
  console.log(`======================================================\n`);

  await mongoose.disconnect();
}

cleanup().catch((err) => {
  console.error('Fatal cleanup error:', err);
  process.exit(1);
});
