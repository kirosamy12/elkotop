import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  bio: { type: String, trim: true },
  image: { type: String, default: '' }
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

export default mongoose.model('Author', authorSchema);
