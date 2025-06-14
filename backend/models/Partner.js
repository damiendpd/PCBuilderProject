import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String },
  affiliateInfo: {
    commissionRate: { type: Number }, 
    conditions: { type: String },
  },
}, { timestamps: true });

export default mongoose.model('Partner', partnerSchema);
