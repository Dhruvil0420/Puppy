import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    area: { type: String, trim: true },
    message: { type: String, trim: true },
    puppy: { type: mongoose.Schema.Types.ObjectId, ref: 'Puppy' },
    puppyName: { type: String, trim: true },
    source: {
      type: String,
      enum: ['contact', 'puppy'],
      default: 'contact',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
    adminNote: { type: String, trim: true },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
