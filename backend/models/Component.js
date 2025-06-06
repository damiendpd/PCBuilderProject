import mongoose from 'mongoose';

const componentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Case'], required: true },
  brand: { type: String },
  price: { type: Number, required: true },
  specs: { type: Object }, // pour les specs comme "socket", "watt", etc.
  image: { type: String }, // URL de l’image
}, { timestamps: true });

export default mongoose.model('Component', componentSchema);