const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const portfolioValidators = require('../validators/portfolioValidators');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Portfolio:
 *       type: object
 *       required:
 *         - userId
 *         - crypto
 *         - amount
 *       properties:
 *         userId:
 *           type: string
 *           description: User's unique identifier
 *         crypto:
 *           type: string
 *           description: Cryptocurrency identifier
 *         amount:
 *           type: number
 *           description: Amount of cryptocurrency held
 */

/**
 * @swagger
 * /api/portfolio:
 *   post:
 *     summary: Create a new portfolio entry
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Portfolio'
 *     responses:
 *       201:
 *         description: Portfolio entry created successfully
 *       400:
 *         description: Invalid input or duplicate entry
 */
router.post('/', 
    auth, 
    portfolioValidators.createPortfolio, 
    portfolioController.createPortfolio
);

/**
 * @swagger
 * /api/portfolio/{userId}/{crypto}:
 *   patch:
 *     summary: Update portfolio entry
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: crypto
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
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Portfolio updated successfully
 *       404:
 *         description: Portfolio entry not found
 */
router.patch('/:userId/:crypto', 
    auth, 
    portfolioValidators.updatePortfolio, 
    portfolioController.updatePortfolio
);

/**
 * @swagger
 * /api/portfolio/{userId}/{crypto}:
 *   delete:
 *     summary: Delete portfolio entry
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: crypto
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Portfolio entry deleted successfully
 *       404:
 *         description: Portfolio entry not found
 */
router.delete('/:userId/:crypto', 
    auth, 
    portfolioValidators.deletePortfolio, 
    portfolioController.deletePortfolio
);

module.exports = router; 