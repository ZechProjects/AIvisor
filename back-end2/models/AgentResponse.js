const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
    actionType: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    actionAmount: {
        type: Number,
        required: true
    }
});

const agentResponseSchema = new mongoose.Schema({
    responseId: {
        type: String,
        required: true,
        unique: true
    },
    agentName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    prevResponseId: {
        type: String,
        default: null
    },
    actionsToDo: [actionSchema],
    userAgreed: {
        type: String,
        enum: [
            'AGREED_AND_ACTED',
            'PARTIALLY_AGREED_SO_ACTED',
            'PARTIALLY_AGREED_NOT_ACTED',
            'NOT_AGREED_NOT_ACTED'
        ],
        required: true
    }
});

let AgentResponse;
try {
    AgentResponse = mongoose.model('AgentResponse');
} catch {
    AgentResponse = mongoose.model('AgentResponse', agentResponseSchema);
}

module.exports = AgentResponse; 