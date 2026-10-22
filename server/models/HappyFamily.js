import mongoose from 'mongoose';

const happyFamilySchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    publicId: { type: String, default: '' },
    alt: { type: String, default: '' },
    caption: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const HappyFamily = mongoose.model('HappyFamily', happyFamilySchema);
export default HappyFamily;
