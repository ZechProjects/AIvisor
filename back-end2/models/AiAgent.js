const mongoose = require('mongoose');

const aiAgentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    riskLevel: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    passcode: {
        type: String,
        required: true
    }
});

let AiAgent;
try {
    AiAgent = mongoose.model('AiAgent');
} catch {
    AiAgent = mongoose.model('AiAgent', aiAgentSchema);
}

module.exports = AiAgent; 