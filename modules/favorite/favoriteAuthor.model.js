import mongoose from 'mongoose';

const favoriteAuthorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true }
}, { timestamps: true });

favoriteAuthorSchema.index({ user: 1, author: 1 }, { unique: true });

export default mongoose.model('FavoriteAuthor', favoriteAuthorSchema);
