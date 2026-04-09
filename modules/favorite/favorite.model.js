import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import User from '../user/user.model.js';
import Book from '../book/book.model.js';

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Book, key: 'id' }
  }
}, {
  timestamps: true,
  indexes: [{ unique: true, fields: ['userId', 'bookId'] }]
});

User.belongsToMany(Book, { through: Favorite, as: 'favorites', foreignKey: 'userId' });
Book.belongsToMany(User, { through: Favorite, as: 'favoritedBy', foreignKey: 'bookId' });

export default Favorite;
