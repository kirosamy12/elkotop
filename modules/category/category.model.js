import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, trim: true }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export default mongoose.model('Category', categorySchema);
