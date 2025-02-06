const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  crypto: String,
  type: { type: String, enum: ['BUY', 'SELL'] },
  amount: Number,
  price: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Trade', tradeSchema);
