const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const tradeValidators = require('../validators/tradeValidators');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Trade:
 *       type: object
 *       required:
 *         - userId
 *         - crypto
 *         - type
 *         - amount
 *         - price
 *       properties:
 *         tradeId:
 *           type: string
 *           description: Unique identifier for the trade
 *         userId:
 *           type: string
 *           description: User's identifier
 *         crypto:
 *           type: string
 *           description: Cryptocurrency identifier
 *         type:
 *           type: string
 *           enum: [BUY, SELL]
 *           description: Type of trade
 *         amount:
 *           type: number
 *           description: Amount of cryptocurrency
 *         price:
 *           type: number
 *           description: Price per unit
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Trade timestamp
 *         avsVerified:
 *           type: string
 *           nullable: true
 *           description: Trade hash for verification
 */

/**
 * @swagger
 * /api/trades:
 *   post:
 *     summary: Create a new trade
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trade'
 *     responses:
 *       201:
 *         description: Trade created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', auth, tradeValidators.createTrade, tradeController.createTrade);

/**
 * @swagger
 * /api/trades/{tradeId}/verify:
 *   patch:
 *     summary: Update trade verification status
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tradeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - avsVerified
 *             properties:
 *               avsVerified:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trade verification updated successfully
 */
router.patch('/:tradeId/verify', auth, tradeValidators.updateAvsVerified, tradeController.updateAvsVerified);

/**
 * @swagger
 * /api/trades/user/{userId}:
 *   get:
 *     summary: Get all trades for a user
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of trades retrieved successfully
 */
router.get('/user/:userId', auth, tradeController.getUserTrades);

/**
 * @swagger
 * /api/trades/timerange:
 *   get:
 *     summary: Get trades within a time range
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: List of trades retrieved successfully
 */
router.get('/timerange', auth, tradeValidators.getTradesByTimeRange, tradeController.getTradesByTimeRange);

/**
 * @swagger
 * /api/trades/{tradeId}:
 *   get:
 *     summary: Get trade by ID
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trade retrieved successfully
 *       404:
 *         description: Trade not found
 */
router.get('/:tradeId', auth, tradeValidators.getTradeById, tradeController.getTradeById);

module.exports = router; 