import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date },
  location: { type: String },
  gps: { lat: Number, lng: Number },
  category: { type: String, index: true },
  parishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parish', index: true },
  status: { type: String, enum: ['draft', 'published', 'canceled', 'postponed'], default: 'draft' }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
