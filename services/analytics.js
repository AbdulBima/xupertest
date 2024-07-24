const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Book = require('../models/Book');
const Sale = require('../models/Sale');
const User = require('../models/User'); 

const getTopSellingBooksByGenre = async () => {
  try {
    const topSellingBooks = await Book.findAll({
      attributes: [
        'genre',
        'title',
        'author',
        'price',
        [sequelize.fn('SUM', sequelize.col('Sales.quantity')), 'totalQuantity']
      ],
      include: [{
        model: Sale,
        attributes: [], 
      }],
      group: ['Book.id', 'Book.genre', 'Book.title', 'Book.author', 'Book.price'],
      order: [[sequelize.fn('SUM', sequelize.col('Sales.quantity')), 'DESC']],
    });

    return topSellingBooks;
  } catch (error) {
    console.error('Error fetching top-selling books by genre:', error);
    throw error;
  }
};

const getUserPurchasePatterns = async () => {
  try {
    const userPatterns = await Sale.findAll({
      attributes: [
        'userId',
        [sequelize.fn('COUNT', sequelize.col('Sale.id')), 'totalPurchases']
      ],
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ],
      group: ['Sale.userId'],
      order: [[sequelize.fn('COUNT', sequelize.col('Sale.id')), 'DESC']]
    });

    return userPatterns;
  } catch (error) {
    console.error('Error fetching user purchase patterns:', error);
    throw new Error('Failed to retrieve user purchase patterns');
  }
};


const getSalesTrendsOverTime = async () => {
  try {
    const salesTrends = await Sale.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalSales']
      ],
      group: ['month'],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']]
    });

    return salesTrends;
  } catch (error) {
    console.error('Error fetching sales trends over time:', error);
    throw error;
  }
};


module.exports = { getTopSellingBooksByGenre, getUserPurchasePatterns, getSalesTrendsOverTime };