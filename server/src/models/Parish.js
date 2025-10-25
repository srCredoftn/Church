import mongoose from 'mongoose';

const ParishSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  archdiocese: { type: String, default: 'Cotonou' },
  logoUrl: { type: String },
  gps: { lat: Number, lng: Number },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Parish || mongoose.model('Parish', ParishSchema);
