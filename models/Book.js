const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  genre: {
    type: DataTypes.STRING,
    allowNull: true, // Genre is optional
  },
  
  isbn: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isISBN: {
        args: 13, // Check for ISBN-13
        msg: 'Invalid ISBN number',
      },
      is: {
        args: [
          /^(?:\d{9}X|\d{10}|\d{13})$/ // Validate ISBN-10 and ISBN-13 formats
        ],
        msg: 'Invalid ISBN format',
      },
    },
  },
  publishedDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  sourceCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'NGN', // Default currency
  },

  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Book;
