import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    whatsappNumber: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    mapsUrl: { type: String, trim: true },
    instagram: { type: String, trim: true },
    tiktok: { type: String, trim: true },
    facebook: { type: String, trim: true },
    tagline: { type: String, trim: true },
    footerText: { type: String, trim: true },
    happyMomentsCount: { type: Number, default: 0 },
    whatsappDefaultMessage: { type: String, trim: true },
  },
  { timestamps: true }
);

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
