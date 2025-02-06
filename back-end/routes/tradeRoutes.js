const express = require('express');
const Trade = require('../models/Trade');
const User = require('../models/User');
const router = express.Router();

/**
 * @swagger
 * /api/trade:
 *   post:
 *     summary: Execute a cryptocurrency trade
 *     tags: [Trades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - crypto
 *               - type
 *               - amount
 *               - price
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user executing the trade
 *               crypto:
 *                 type: string
 *                 description: The cryptocurrency being traded (e.g., 'BTC', 'ETH')
 *               type:
 *                 type: string
 *                 enum: [BUY, SELL]
 *                 description: The type of trade
 *               amount:
 *                 type: number
 *                 description: The amount of cryptocurrency to trade
 *               price:
 *                 type: number
 *                 description: The price per unit of the cryptocurrency
 *     responses:
 *       200:
 *         description: Trade executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Trade executed
 *                 trade:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     crypto:
 *                       type: string
 *                     type:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     price:
 *                       type: number
 *       400:
 *         description: Invalid request or insufficient balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/trade', async (req, res) => {
  const { userId, crypto, type, amount, price } = req.body;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (type === 'BUY' && user.usdtBalance < amount * price) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Save trade
    const trade = new Trade({ userId, crypto, type, amount, price });
    await trade.save();

    // Update user balance
    if (type === 'BUY') {
      user.usdtBalance -= amount * price;
      user.portfolio.push({ crypto, amount });
    } else {
      user.usdtBalance += amount * price;
      user.portfolio = user.portfolio.filter(p => p.crypto !== crypto);
    }

    await user.save();
    res.json({ message: 'Trade executed', trade });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
