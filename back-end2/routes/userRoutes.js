const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userValidators = require('../validators/userValidators');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - userId
 *         - walletId
 *         - email
 *       properties:
 *         userId:
 *           type: string
 *           description: Unique identifier for the user
 *         walletId:
 *           type: string
 *           description: User's wallet identifier
 *         usdtBalance:
 *           type: number
 *           description: User's USDT balance
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 */

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get user details
 *     tags: [Users]
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
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get('/:userId', auth, userValidators.getUserDetails, userController.getUserDetails);

/**
 * @swagger
 * /api/users/{userId}/portfolio:
 *   get:
 *     summary: Get user's portfolio
 *     tags: [Users]
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
 *         description: Portfolio retrieved successfully
 */
router.get('/:userId/portfolio', auth, userValidators.getUserDetails, userController.getUserPortfolio);

/**
 * @swagger
 * /api/users/{userId}/wallet:
 *   patch:
 *     summary: Update user's wallet ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               - walletId
 *             properties:
 *               walletId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Wallet ID updated successfully
 */
router.patch('/:userId/wallet', auth, userValidators.updateWalletId, userController.updateWalletId);

/**
 * @swagger
 * /api/users/{userId}/balance:
 *   patch:
 *     summary: Update user's USDT balance
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               - usdtBalance
 *             properties:
 *               usdtBalance:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: USDT balance updated successfully
 */
router.patch('/:userId/balance', auth, userValidators.updateUsdtBalance, userController.updateUsdtBalance);

/**
 * @swagger
 * /api/users/{userId}/reset:
 *   post:
 *     summary: Reset user's game state
 *     description: Deletes all portfolios and sets USDT balance to 10000
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User's unique identifier
 *     responses:
 *       200:
 *         description: Game reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Game reset successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/:userId/reset', auth, userValidators.getUserDetails, userController.resetGame);

/**
 * @swagger
 * /api/users/top/{limit}:
 *   get:
 *     summary: Get top users by portfolio value
 *     description: Returns users sorted by their total portfolio value (USDT + crypto converted to USDT)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of top users to return
 *     responses:
 *       200:
 *         description: Top users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       email:
 *                         type: string
 *                       totalValue:
 *                         type: number
 *                       usdtBalance:
 *                         type: number
 *                       portfolios:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Portfolio'
 *       500:
 *         description: Server error
 */
router.get('/top/:limit', auth, userValidators.getTopUsers, userController.getTopUsers);

module.exports = router; 