const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const cryptoPriceService = require('../services/cryptoPriceService');

const portfolioController = {
    // Create new portfolio entry
    createPortfolio: async (req, res) => {
        try {
            const { userId, crypto, amount } = req.body;
            
            const portfolio = new Portfolio({
                userId,
                crypto,
                amount
            });

            await portfolio.save();
            res.status(201).json({ success: true, data: portfolio });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Portfolio entry already exists for this crypto' 
                });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Update portfolio
    updatePortfolio: async (req, res) => {
        try {
            const { userId, crypto } = req.params;
            const { amount } = req.body;

            const portfolio = await Portfolio.findOneAndUpdate(
                { userId, crypto },
                { amount },
                { new: true }
            );

            if (!portfolio) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Portfolio entry not found' 
                });
            }

            res.json({ success: true, data: portfolio });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Delete portfolio
    deletePortfolio: async (req, res) => {
        try {
            const { userId, crypto } = req.params;

            const portfolio = await Portfolio.findOneAndDelete({ userId, crypto });

            if (!portfolio) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Portfolio entry not found' 
                });
            }

            res.json({ success: true, message: 'Portfolio entry deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getUserPortfolio: async (req, res) => {
        try {
            const { userId } = req.params;

            // Get user's USDT balance
            const user = await User.findOne({ userId });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Get user's portfolio
            const portfolio = await Portfolio.find({ userId });

            // Calculate total value in USDT
            let totalValue = user.usdtBalance;
            
            // Get current prices and calculate total value
            for (const holding of portfolio) {
                try {
                    const price = await cryptoPriceService.getPriceInUSDT(holding.crypto);
                    totalValue += holding.amount * price;
                } catch (error) {
                    console.error(`Error getting price for ${holding.crypto}:`, error);
                    // Continue with next holding if price fetch fails
                }
            }

            res.json({
                success: true,
                data: {
                    portfolio,
                    usdtBalance: user.usdtBalance,
                    totalValue: parseFloat(totalValue.toFixed(2))
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = portfolioController; 