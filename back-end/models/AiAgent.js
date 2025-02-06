const mongoose = require('mongoose');

const aiAgentSchema = new mongoose.Schema({
  name: String,
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
  strategy: String, // E.g., Scalping, Swing Trading
});

module.exports = mongoose.model('AiAgent', aiAgentSchema);