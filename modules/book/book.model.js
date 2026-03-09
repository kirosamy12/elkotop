import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required']
  },
  pdfFile: {
    type: String,
    required: [true, 'PDF file is required']
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
bookSchema.index({ title: 'text', author: 'text' });

export default mongoose.model('Book', bookSchema);
