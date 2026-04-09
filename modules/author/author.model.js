import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Author = sequelize.define('Author', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  }
}, {
  timestamps: true
});

export default Author;
