const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    crypto: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});

// Compound index to ensure unique combination of userId and crypto
portfolioSchema.index({ userId: 1, crypto: 1 }, { unique: true });

module.exports = mongoose.model('Portfolio', portfolioSchema); 