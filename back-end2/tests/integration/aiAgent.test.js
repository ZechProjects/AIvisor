const request = require('supertest');
const app = require('../../server');
const AiAgent = require('../../models/AiAgent');
const { setupDatabase, userOne, adminUser } = require('../fixtures/db');

let server;

beforeAll(async () => {
    server = app.listen(0);
});

beforeEach(setupDatabase);

afterAll(async () => {
    await server.close();
});

describe('AI Agent Endpoints', () => {
    describe('POST /api/ai-agents', () => {
        it('should create new AI agent', async () => {
            const agentData = {
                name: 'TestAgent',
                riskLevel: 'MEDIUM',
                url: 'http://test-agent.com',
                passcode: 'test-passcode'
            };

            const response = await request(app)
                .post('/api/ai-agents')
                .set('Authorization', `Bearer ${adminUser.tokens[0].token}`)
                .send(agentData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe('TestAgent');

            // Verify database
            const agent = await AiAgent.findOne({ name: 'TestAgent' });
            expect(agent).not.toBeNull();
        });
    });

    describe('GET /api/ai-agents', () => {
        it('should get all AI agents', async () => {
            const response = await request(app)
                .get('/api/ai-agents')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .expect(200);

            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });
}); 