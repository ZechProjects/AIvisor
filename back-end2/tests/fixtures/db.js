const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Portfolio = require('../../models/Portfolio');
const Trade = require('../../models/Trade');
const AiAgent = require('../../models/AiAgent');
const AgentResponse = require('../../models/AgentResponse');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    email: 'test@example.com',
    password: 'TestPass123!',
    walletId: 'testwallet123',
    userId: 'testuser123',
    tokens: [{
        token: jwt.sign({ userId: 'testuser123' }, process.env.JWT_SECRET)
    }]
};

const adminUser = {
    _id: new mongoose.Types.ObjectId(),
    email: 'admin@example.com',
    password: 'AdminPass123!',
    walletId: 'adminwallet123',
    userId: 'admin123',
    isAdmin: true,
    tokens: [{
        token: jwt.sign({ userId: 'admin123' }, process.env.JWT_SECRET)
    }]
};

const setupDatabase = async () => {
    await User.deleteMany();
    await Portfolio.deleteMany();
    await Trade.deleteMany();
    await AiAgent.deleteMany();
    await AgentResponse.deleteMany();

    await new User(userOne).save();
    await new User(adminUser).save();

    // Create test portfolio
    await new Portfolio({
        userId: userOne.userId,
        crypto: 'BTC',
        amount: 1.0
    }).save();

    // Create test trade
    await new Trade({
        tradeId: 'test-trade-id',
        userId: userOne.userId,
        crypto: 'BTC',
        type: 'BUY',
        amount: 1.0,
        price: 50000
    }).save();

    // Create test AI agent
    await new AiAgent({
        name: 'TestAgent',
        riskLevel: 'MEDIUM',
        url: 'http://test-agent.com',
        passcode: 'test-passcode'
    }).save();

    // Create test agent response
    await new AgentResponse({
        responseId: 'existing-response-id',
        agentName: 'TestAgent',
        userId: userOne.userId,
        response: 'Test response',
        prompt: 'Test prompt',
        actionsToDo: [{ actionType: 'BUY', actionAmount: 1.0 }],
        userAgreed: 'NOT_AGREED_NOT_ACTED'
    }).save();
};

module.exports = {
    userOneId,
    userOne,
    adminUser,
    setupDatabase
}; 