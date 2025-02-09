const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const cryptoPriceService = require('./cryptoPriceService');

const tradeService = {
    validateTrade: async (userId, crypto, type, amount, price) => {
        const user = await User.findOne({ userId });
        if (!user) {
            throw new Error('User not found');
        }

        if (amount <= 0) {
            throw new Error('Trade amount must be positive');
        }

        const totalValue = amount * price;

        if (type.toLowerCase() === 'buy') {
            if (user.usdtBalance < totalValue) {
                throw new Error('Insufficient USDT balance');
            }
        } else if (type.toLowerCase() === 'sell') {
            const portfolio = await Portfolio.findOne({ userId, crypto });
            if (!portfolio || portfolio.amount < amount) {
                throw new Error('Insufficient crypto balance');
            }
        } else {
            throw new Error('Invalid trade type');
        }

        return true;
    },

    updatePortfolio: async (userId, crypto, type, amount, price) => {
        const totalValue = amount * price;

        // Update USDT balance
        const usdtUpdate = type.toLowerCase() === 'buy' ? -totalValue : totalValue;
        await User.findOneAndUpdate(
            { userId },
            { $inc: { usdtBalance: usdtUpdate } }
        );

        // Update crypto balance
        const cryptoUpdate = type.toLowerCase() === 'buy' ? amount : -amount;
        const portfolio = await Portfolio.findOne({ userId, crypto });

        if (portfolio) {
            const newAmount = portfolio.amount + cryptoUpdate;
            if (newAmount === 0) {
                await Portfolio.findOneAndDelete({ userId, crypto });
            } else {
                await Portfolio.findOneAndUpdate(
                    { userId, crypto },
                    { amount: newAmount }
                );
            }
        } else if (type.toLowerCase() === 'buy') {
            await new Portfolio({
                userId,
                crypto,
                amount: cryptoUpdate
            }).save();
        }
    }
};

module.exports = tradeService; 