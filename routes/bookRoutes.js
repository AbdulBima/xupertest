const express = require('express');
const { createBook, getBooks, getBookById, updateBook, deleteBook } = require('../controllers/bookController');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');
const router = express.Router();
const Book = require('../models/Book');
const { notifyBookUpdate } = require('../server/websocket');
const { fetchBookDetails, fetchConversionRate } = require('../services/externalAPIs');

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API endpoints for managing books
 */

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               sourceCurrency:
 *                 type: string
 *     responses:
 *       201:
 *         description: The book was successfully created
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateJWT, authorizeRoles('Admin', 'Seller'), createBook);

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Retrieve a list of books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/', getBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Retrieve a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
router.get('/:id', getBookById);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The book was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
router.put('/:id', authenticateJWT, authorizeRoles('Admin', 'Seller'), updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The book was successfully deleted
 *       404:
 *         description: Book not found
 */
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), deleteBook);

/**
 * @swagger
 * /api/books/{id}/external:
 *   get:
 *     summary: Retrieve external details of a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: External details of the book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 author:
 *                   type: string
 *                 isbn:
 *                   type: string
 *                 price:
 *                   type: number
 *       404:
 *         description: Book not found
 */
router.get('/:id/external', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const bookDetails = await fetchBookDetails(book.isbn);
    res.json({ ...book.toJSON(), ...bookDetails });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/books/{id}/convert/{currency}:
 *   get:
 *     summary: Convert the price of a book to a different currency
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: currency
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Converted price of the book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 author:
 *                   type: string
 *                 price:
 *                   type: number
 *                 convertedPrice:
 *                   type: string
 *                 currency:
 *                   type: string
 *       404:
 *         description: Book not found
 *       400:
 *         description: Invalid currency
 */
router.get('/:id/convert/:currency', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const { sourceCurrency } = book;
    const conversionRate = await fetchConversionRate(sourceCurrency, req.params.currency);
    if (!conversionRate) {
      return res.status(400).json({ error: 'Invalid currency' });
    }
    const convertedPrice = book.price * conversionRate;
    res.json({ 
      ...book.toJSON(),
      convertedPrice: convertedPrice.toFixed(2),
      currency: req.params.currency 
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/books/sp/{id}:
 *   put:
 *     summary: Update the stock and price of a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The book was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
router.put('/sp/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { price, stock } = req.body;
    const [updated] = await Book.update({ price, stock }, { where: { id } });
    if (updated) {
      const updatedBook = await Book.findByPk(id);
      notifyBookUpdate({ type: 'UPDATE', book: updatedBook });
      res.status(200).json(updatedBook);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
