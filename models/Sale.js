const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Book = require('./Book'); // Import the Book model
const User = require('./User'); // Import the User model

const Sale = sequelize.define('Sale', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  bookId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Book,
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define the associations
Sale.belongsTo(Book, { foreignKey: 'bookId' });
Sale.belongsTo(User, { foreignKey: 'userId' });
Book.hasMany(Sale, { foreignKey: 'bookId' }); // Optional: if you want to include this relationship

module.exports = Sale;
