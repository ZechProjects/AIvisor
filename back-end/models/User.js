const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  usdtBalance: { type: Number, default: 10000 }, // Start with dummy USDT
  portfolio: [{ crypto: String, amount: Number }],
});

module.exports = mongoose.model('User', userSchema);
