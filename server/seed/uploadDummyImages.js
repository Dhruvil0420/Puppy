import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import cloudinary from '../config/cloudinary.js';
import { uploadFromUrl } from '../utils/cloudinaryUpload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGES_JSON_PATH = path.join(__dirname, 'images.json');
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'teddypups';

// Dog CEO breeds mapping
const BREED_API_MAP = {
  poodle: 'poodle/toy',
  pomeranian: 'pomeranian',
  maltese: 'maltese',
  maltipoo: 'poodle/toy',
  cavapoo: 'spaniel/cocker',
  'shih-tzu': 'shihtzu',
  bichon: 'bichon/frise',
};

// 3 sample public short mp4 URLs for puppies with videos
const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
];

// Helper: fetch images from Dog.ceo API
async function fetchDogImages(breedPath, count = 10) {
  try {
    const url = `https://dog.ceo/api/breed/${breedPath}/images`;
    const res = await axios.get(url, { timeout: 10000 });
    if (res.data?.status === 'success' && Array.isArray(res.data.message)) {
      return res.data.message;
    }
  } catch (err) {
    console.warn(`Could not fetch breed ${breedPath}:`, err.message);
  }

  // Fallback to random dogs
  try {
    const fallback = await axios.get(`https://dog.ceo/api/breeds/image/random/${count}`, { timeout: 10000 });
    if (fallback.data?.status === 'success') {
      return fallback.data.message;
    }
  } catch (err) {
    console.warn('Fallback random dog fetch failed:', err.message);
  }
  return [];
}

// Upload URL to Cloudinary with retry
async function uploadToCloudinaryWithRetry(url, options, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await cloudinary.uploader.upload(url, options);
      return {
        url: res.secure_url || res.url,
        publicId: res.public_id,
        width: res.width,
        height: res.height,
      };
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`Retry upload for ${url} (attempt ${attempt + 1})...`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

// Concurrency pool limiter
async function mapConcurrent(items, limit, fn) {
  const results = [];
  const executing = [];
  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item));
    results.push(p);
    if (limit <= items.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(results);
}

// 20 puppies from seed (15 available + 5 gone-home)
const PUPPY_KEYS = [
  { key: 'Maltipoo Girl 1', breed: 'maltipoo' },
  { key: 'Korean Teacup Pomeranian 1', breed: 'pomeranian' },
  { key: 'Toy Poodle (Red)', breed: 'poodle' },
  { key: 'Korean Teacup Poodle', breed: 'poodle' },
  { key: 'Korean Teacup Pomeranian 2', breed: 'pomeranian' },
  { key: 'Teacup Cavapoo', breed: 'cavapoo' },
  { key: 'Korean Teacup Maltese', breed: 'maltese' },
  { key: 'Maltipoo (Boy & Girl)', breed: 'maltipoo' },
  { key: 'Shih Tzu Girl', breed: 'shih-tzu' },
  { key: 'Shih Tzu Boy', breed: 'shih-tzu' },
  { key: 'Maltipoo Girl 2', breed: 'maltipoo' },
  { key: 'Imported Maltipoo Girl', breed: 'maltipoo' },
  { key: 'Korean Teacup Pomeranian 3', breed: 'pomeranian' },
  { key: 'Korean Teacup Pomeranian 4', breed: 'pomeranian' },
  { key: 'Korean Teacup Pomeranian Boy', breed: 'pomeranian' },
  { key: 'Ace (Gone Home)', breed: 'maltipoo' },
  { key: 'Coco (Gone Home)', breed: 'pomeranian' },
  { key: 'Teddy (Gone Home)', breed: 'poodle' },
  { key: 'Luna (Gone Home)', breed: 'maltese' },
  { key: 'Milo (Gone Home)', breed: 'cavapoo' },
];

async function run() {
  console.log('🚀 Starting Cloudinary dummy image & video upload seed...');

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary environment variables are missing!');
    console.error('Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env');
    process.exit(1);
  }

  const resultData = {
    puppies: {},
    families: [],
    videos: [],
  };

  // 1. Upload Puppy Photos
  console.log('\n🐶 Uploading puppy photos from Dog.ceo API (concurrency: 3)...');
  const usedPhotos = new Set();

  for (const pup of PUPPY_KEYS) {
    const breedPath = BREED_API_MAP[pup.breed] || 'poodle/toy';
    const dogUrls = await fetchDogImages(breedPath, 50);

    // Shuffle and pick 3 unique images that haven't been assigned yet
    const shuffled = dogUrls.sort(() => 0.5 - Math.random());
    const availableUrls = shuffled.filter((u) => !usedPhotos.has(u));
    const chosenUrls = (availableUrls.length >= 3 ? availableUrls : shuffled).slice(0, 3);
    chosenUrls.forEach((u) => usedPhotos.add(u));

    console.log(`Uploading ${chosenUrls.length} distinct photos for [${pup.key}] (${pup.breed})...`);

    const uploadedList = await mapConcurrent(chosenUrls, 3, (imgUrl) =>
      uploadToCloudinaryWithRetry(imgUrl, {
        folder: `${CLOUDINARY_FOLDER}/puppies`,
        transformation: [
          { width: 1600, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      })
    );

    resultData.puppies[pup.key] = uploadedList;
  }

  // 2. Upload Happy Families Photos (14 distinct photos)
  console.log('\n📸 Uploading 14 distinct photos for Happy Families wall...');
  const randomPool = [
    ...(await fetchDogImages('retriever/golden', 15)),
    ...(await fetchDogImages('labrador', 15)),
    ...(await fetchDogImages('samoyed', 15)),
    ...(await fetchDogImages('spaniel/cocker', 15)),
  ].sort(() => 0.5 - Math.random());

  const familyUrls = randomPool.filter((u) => !usedPhotos.has(u)).slice(0, 14);
  familyUrls.forEach((u) => usedPhotos.add(u));

  resultData.families = await mapConcurrent(familyUrls, 3, (imgUrl) =>
    uploadToCloudinaryWithRetry(imgUrl, {
      folder: `${CLOUDINARY_FOLDER}/families`,
      transformation: [
        { width: 1600, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    })
  );

  // 3. Upload Sample Videos with uploadFromUrl
  console.log('\n🎥 Uploading 3 sample videos to Cloudinary via uploadFromUrl...');
  resultData.videos = await mapConcurrent(SAMPLE_VIDEOS, 2, async (videoUrl) => {
    try {
      const res = await uploadFromUrl(videoUrl, {
        resourceType: 'video',
        sub: 'videos',
      });
      return {
        url: res.url,
        publicId: res.publicId,
        poster: res.poster,
        duration: res.duration,
      };
    } catch (err) {
      console.warn('Failed sample video upload:', err.message);
      return null;
    }
  });
  resultData.videos = resultData.videos.filter(Boolean);

  // 4. Save to seed/images.json
  fs.writeFileSync(IMAGES_JSON_PATH, JSON.stringify(resultData, null, 2));
  console.log(`\n✅ Saved all Cloudinary assets to: ${IMAGES_JSON_PATH}`);
  console.log('You can now run "npm run seed" to populate the database with these uploaded photos.');
}

run().catch((err) => {
  console.error('❌ Upload dummy images failed:', err);
  process.exit(1);
});
