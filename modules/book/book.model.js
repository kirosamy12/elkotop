import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  coverImage: { type: String, required: true },
  pdfFile: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true }
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);
