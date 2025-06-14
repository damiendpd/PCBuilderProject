import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  url: {
    type: String
  }
});

const componentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Case'],
    required: true
  },
  brand: { type: String },
  price: { type: Number, required: true },
  specs: { type: Object },
  offers: [offerSchema] // Liste des offres liées aux partenaires
}, { timestamps: true });

export default mongoose.model('Component', componentSchema);