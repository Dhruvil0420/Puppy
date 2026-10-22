import mongoose from 'mongoose';
import slugify from 'slugify';

/* ── Sub-schema for images ─────────────────────────────────────── */
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  { _id: false }
);

/* ── Main schema ───────────────────────────────────────────────── */
const puppySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    displayTitle: { type: String, trim: true },
    breed: { type: String, required: true, trim: true },
    breedGroups: [
      {
        type: String,
        enum: ['maltipoo', 'pomeranian', 'poodle', 'cavapoo', 'shih-tzu', 'other'],
      },
    ],
    gender: {
      type: String,
      required: true,
      enum: ['boy', 'girl', 'boy-and-girl'],
    },
    ageLabel: { type: String, trim: true },
    origin: {
      type: String,
      enum: ['local', 'imported'],
      default: 'local',
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'gone-home'],
      default: 'available',
    },
    images: [imageSchema],
    videoUrl: { type: String, trim: true },
    videoPublicId: { type: String, trim: true },
    videoPoster: { type: String, trim: true },
    description: { type: String, trim: true },
    featuredOnHero: { type: Boolean, default: false },
    showOnHome: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    goneHomeAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* ── Indexes ───────────────────────────────────────────────────── */
puppySchema.index({ slug: 1 });
puppySchema.index({ status: 1, sortOrder: 1 });
puppySchema.index({ breedGroups: 1 });
puppySchema.index({ origin: 1 });

/* ── Virtuals ──────────────────────────────────────────────────── */
puppySchema.virtual('genderLabel').get(function () {
  const map = { boy: 'Boy', girl: 'Girl', 'boy-and-girl': 'Boy & Girl' };
  return map[this.gender] || this.gender;
});

puppySchema.virtual('subtitle').get(function () {
  return [this.breed, this.genderLabel, this.ageLabel].filter(Boolean).join(' · ');
});

puppySchema.virtual('primaryImage').get(function () {
  return this.images?.[0]?.url || '';
});

puppySchema.virtual('photos').get(function () {
  return (this.images || []).map((img) => img.url).filter(Boolean);
});

/* ── Pre-save: auto-generate unique slug from name+breed+gender ─ */
puppySchema.pre('save', async function (next) {
  if (
    !this.isModified('name') &&
    !this.isModified('breed') &&
    !this.isModified('gender') &&
    this.slug
  ) {
    return next();
  }

  const base = slugify(`${this.name} ${this.breed} ${this.gender}`, {
    lower: true,
    strict: true,
  });

  let slug = base;
  let counter = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await mongoose
      .model('Puppy')
      .findOne({ slug, _id: { $ne: this._id } });
    if (!existing) break;
    counter += 1;
    slug = `${base}-${counter}`;
  }

  this.slug = slug;
  next();
});

const Puppy = mongoose.model('Puppy', puppySchema);
export default Puppy;
