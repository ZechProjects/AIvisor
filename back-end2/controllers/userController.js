const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const cryptoPriceService = require('../services/cryptoPriceService');

const userController = {
    // Get user details by userId
    getUserDetails: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findOne({ userId });
            
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get user's portfolio
    getUserPortfolio: async (req, res) => {
        try {
            const { userId } = req.params;
            const portfolio = await Portfolio.find({ userId });
            
            res.json({ success: true, data: portfolio });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Update user's walletId
    updateWalletId: async (req, res) => {
        try {
            const { userId } = req.params;
            const { walletId } = req.body;

            const user = await User.findOneAndUpdate(
                { userId },
                { walletId },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Update user's USDT balance
    updateUsdtBalance: async (req, res) => {
        try {
            const { userId } = req.params;
            const { usdtBalance } = req.body;

            const user = await User.findOneAndUpdate(
                { userId },
                { usdtBalance },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Reset game for user
    resetGame: async (req, res) => {
        try {
            const { userId } = req.params;

            // Delete all portfolios for the user
            await Portfolio.deleteMany({ userId });

            // Reset USDT balance to 10000
            const user = await User.findOneAndUpdate(
                { userId },
                { usdtBalance: 10000 },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }

            res.json({ 
                success: true, 
                message: 'Game reset successfully',
                data: user 
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getTopUsers: async (req, res) => {
        try {
            const limit = parseInt(req.params.limit) || 10;

            // Get all users and their portfolios
            const users = await User.find({});
            const portfolios = await Portfolio.find({
                userId: { $in: users.map(u => u.userId) }
            });

            // Calculate total value for each user
            const userValues = await Promise.all(users.map(async (user) => {
                let totalValue = user.usdtBalance;

                // Get user's portfolios
                const userPortfolios = portfolios.filter(p => p.userId === user.userId);

                // Calculate crypto values
                for (const portfolio of userPortfolios) {
                    try {
                        const price = await cryptoPriceService.getPriceInUSDT(portfolio.crypto);
                        totalValue += portfolio.amount * price;
                    } catch (error) {
                        console.error(`Error fetching price for ${portfolio.crypto}:`, error);
                        // Skip this crypto if price fetch fails
                        continue;
                    }
                }

                return {
                    userId: user.userId,
                    email: user.email,
                    totalValue,
                    usdtBalance: user.usdtBalance,
                    portfolios: userPortfolios
                };
            }));

            // Sort by total value and get top K users
            const topUsers = userValues
                .sort((a, b) => b.totalValue - a.totalValue)
                .slice(0, limit);

            res.json({
                success: true,
                data: topUsers
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }
};

module.exports = userController; 