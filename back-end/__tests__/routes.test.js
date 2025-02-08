const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); // Assuming your Express app is exported from app.js
const User = require('../models/User');
const Trade = require('../models/Trade');
const AiAgent = require('../models/AiAgent');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Trade.deleteMany({});
  await AiAgent.deleteMany({});
});

describe('Authentication Routes', () => {
  describe('POST /api/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('userId');
    });

    it('should not allow duplicate usernames', async () => {
      // First registration
      await request(app)
        .post('/api/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      // Duplicate registration attempt
      const res = await request(app)
        .post('/api/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Username already exists');
    });
  });

  describe('POST /api/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('userId');
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });
  });
});

describe('Trading Routes', () => {
  let userId;
  let authToken;

  beforeEach(async () => {
    // Register and login a user
    const registerRes = await request(app)
      .post('/api/register')
      .send({
        username: 'trader',
        password: 'password123'
      });

    userId = registerRes.body.userId;
    authToken = registerRes.body.token;

    // Set initial USDT balance
    await User.findByIdAndUpdate(userId, { usdtBalance: 10000 });
  });

  describe('POST /api/trade', () => {
    it('should execute a buy trade successfully', async () => {
      const res = await request(app)
        .post('/api/trade')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId,
          crypto: 'BTC',
          type: 'BUY',
          amount: 1,
          price: 5000
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Trade executed');
      
      // Check updated user balance
      const user = await User.findById(userId);
      expect(user.usdtBalance).toBe(5000); // 10000 - (1 * 5000)
    });

    it('should prevent buying with insufficient balance', async () => {
      const res = await request(app)
        .post('/api/trade')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId,
          crypto: 'BTC',
          type: 'BUY',
          amount: 3,
          price: 5000
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Insufficient balance');
    });
  });
});

describe('AI Agent Routes', () => {
  let authToken;

  beforeEach(async () => {
    // Create a test AI agent
    const agent = new AiAgent({
      name: 'Test Agent',
      description: 'Test AI Agent'
    });
    await agent.save();

    // Get auth token
    const registerRes = await request(app)
      .post('/api/register')
      .send({
        username: 'aiuser',
        password: 'password123'
      });
    authToken = registerRes.body.token;
  });

  describe('GET /api/ai/agents', () => {
    it('should retrieve all AI agents', async () => {
      const res = await request(app)
        .get('/api/ai/agents')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty('name', 'Test Agent');
    });
  });
});

describe('Integration Tests', () => {
  let userId;
  let authToken;
  let agentId;

  beforeEach(async () => {
    // Setup user
    const registerRes = await request(app)
      .post('/api/register')
      .send({
        username: 'integrationuser',
        password: 'password123'
      });

    userId = registerRes.body.userId;
    authToken = registerRes.body.token;

    // Setup AI agent
    const agent = new AiAgent({
      name: 'Trading Assistant',
      description: 'AI Trading Assistant'
    });
    const savedAgent = await agent.save();
    agentId = savedAgent._id;

    // Set initial balance
    await User.findByIdAndUpdate(userId, { usdtBalance: 10000 });
  });

  it('should execute a complete trading workflow with AI suggestion', async () => {
    // 1. Get AI suggestion
    const suggestionRes = await request(app)
      .post('/api/ai/suggest')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        prompt: 'Should I buy BTC?',
        agentId
      });

    expect(suggestionRes.status).toBe(200);
    expect(suggestionRes.body).toHaveProperty('suggestion');

    // 2. Execute trade based on suggestion
    const tradeRes = await request(app)
      .post('/api/trade')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        userId,
        crypto: 'BTC',
        type: 'BUY',
        amount: 0.5,
        price: 5000
      });

    expect(tradeRes.status).toBe(200);

    // 3. Check portfolio
    const portfolioRes = await request(app)
      .get(`/api/users/${userId}/portfolio`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(portfolioRes.status).toBe(200);
    expect(portfolioRes.body).toHaveProperty('portfolio');
    expect(portfolioRes.body).toHaveProperty('usdtBalance');
    expect(portfolioRes.body.usdtBalance).toBe(7500); // 10000 - (0.5 * 5000)
  });
}); 