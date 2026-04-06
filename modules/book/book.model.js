import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import Category from '../category/category.model.js';
import Author from '../author/author.model.js';

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pdfFile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  releaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Category, key: 'id' }
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: Author, key: 'id' }
  }
}, {
  timestamps: true
});

// Associations
Book.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Book, { foreignKey: 'categoryId', as: 'books' });

Book.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });
Author.hasMany(Book, { foreignKey: 'authorId', as: 'books' });

export default Book;
