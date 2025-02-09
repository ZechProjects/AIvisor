const Trade = require('../models/Trade');
const { v4: uuidv4 } = require('uuid');
const tradeService = require('../services/tradeService');

const tradeController = {
    // Create new trade
    createTrade: async (req, res) => {
        try {
            const { userId, crypto, type, amount, price } = req.body;
            
            // Validate trade
            await tradeService.validateTrade(userId, crypto, type, amount, price);
            
            const trade = new Trade({
                tradeId: uuidv4(),
                userId,
                crypto,
                type,
                amount,
                price,
                timestamp: new Date()
            });

            // Update portfolio
            await tradeService.updatePortfolio(userId, crypto, type, amount, price);
            
            await trade.save();
            res.status(201).json({ success: true, data: trade });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Trade with this tradeId already exists' 
                });
            }
            res.status(400).json({ success: false, message: error.message });
        }
    },

    // Update avsVerified field
    updateAvsVerified: async (req, res) => {
        try {
            const { tradeId } = req.params;
            const { avsVerified } = req.body;

            const trade = await Trade.findOneAndUpdate(
                { tradeId },
                { avsVerified },
                { new: true }
            );

            if (!trade) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Trade not found' 
                });
            }

            res.json({ success: true, data: trade });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get all trades of a user
    getUserTrades: async (req, res) => {
        try {
            const { userId } = req.params;
            const trades = await Trade.find({ userId }).sort({ timestamp: -1 });
            
            res.json({ success: true, data: trades });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get trades between timestamps
    getTradesByTimeRange: async (req, res) => {
        try {
            const { startTime, endTime } = req.query;
            
            const trades = await Trade.find({
                timestamp: {
                    $gte: new Date(startTime),
                    $lte: new Date(endTime)
                }
            }).sort({ timestamp: -1 });

            res.json({ success: true, data: trades });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get trade by tradeId
    getTradeById: async (req, res) => {
        try {
            const { tradeId } = req.params;
            const trade = await Trade.findOne({ tradeId });

            if (!trade) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Trade not found' 
                });
            }

            res.json({ success: true, data: trade });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = tradeController; 