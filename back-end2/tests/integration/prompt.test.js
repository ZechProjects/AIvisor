const request = require('supertest');
const app = require('../../server');
const AgentResponse = require('../../models/AgentResponse');
const { setupDatabase, userOne } = require('../fixtures/db');

let server;

beforeAll(async () => {
    server = app.listen(0);
});

beforeEach(setupDatabase);

afterAll(async () => {
    await server.close();
});

describe('Prompt Endpoints', () => {
    describe('POST /api/prompt', () => {
        it('should process prompt and return AI response', async () => {
            const promptData = {
                agentName: 'TestAgent',
                prompt: 'What should I do with BTC?',
                context: {
                    currentPrice: 50000
                }
            };

            const response = await request(app)
                .post('/api/prompt')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send(promptData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('response');
            expect(response.body.data).toHaveProperty('actionsToDo');

            // Verify database
            const savedResponse = await AgentResponse.findOne({ 
                responseId: response.body.data.responseId 
            });
            expect(savedResponse).not.toBeNull();
        });

        it('should handle conversation thread', async () => {
            const promptData = {
                agentName: 'TestAgent',
                prompt: 'Follow up question',
                prevResponseId: 'existing-response-id'
            };

            await request(app)
                .post('/api/prompt')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send(promptData)
                .expect(200);
        });
    });

    describe('PATCH /api/agent-responses/:responseId/agree', () => {
        it('should update user agreement status', async () => {
            const response = await request(app)
                .patch('/api/agent-responses/existing-response-id/agree')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({ userAgreed: 'AGREED_AND_ACTED' })
                .expect(200);

            expect(response.body.data.userAgreed).toBe('AGREED_AND_ACTED');
        });
    });
}); 