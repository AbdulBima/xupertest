const express = require('express');
const router = express.Router();
const { getTopSellingBooksByGenre, getUserPurchasePatterns, getSalesTrendsOverTime } = require('../services/analytics');

/**
 * @swagger
 * /api/analytics/topbooks:
 *   get:
 *     summary: Retrieve top-selling books by genre
 *     responses:
 *       200:
 *         description: A list of top-selling books by genre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   genre:
 *                     type: string
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   price:
 *                     type: number
 *                   totalQuantity:
 *                     type: string
 */
router.get('/topbooks', async (req, res) => {
  try {
    const topBooks = await getTopSellingBooksByGenre();
    res.json(topBooks);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/analytics/userpatterns:
 *   get:
 *     summary: Retrieve user purchase patterns
 *     responses:
 *       200:
 *         description: A list of user purchase patterns
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   totalPurchases:
 *                     type: integer
 *                   User:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 */
router.get('/userpatterns', async (req, res) => {
  try {
    const userPatterns = await getUserPurchasePatterns();
    res.json(userPatterns);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/analytics/salestrends:
 *   get:
 *     summary: Retrieve sales trends over time
 *     responses:
 *       200:
 *         description: A list of sales trends over time
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                   totalSales:
 *                     type: number
 */
router.get('/salestrends', async (req, res) => {
  try {
    const salesTrends = await getSalesTrendsOverTime();
    res.json(salesTrends);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

module.exports = router;
