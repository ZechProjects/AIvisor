const request = require('supertest');
const app = require('../../server');
const Trade = require('../../models/Trade');
const { setupDatabase, userOne } = require('../fixtures/db');

let server;

beforeAll(async () => {
    server = app.listen(0);
});

beforeEach(setupDatabase);

afterAll(async () => {
    await server.close();
});

describe('Trade Endpoints', () => {
    describe('POST /api/trades', () => {
        it('should create new trade', async () => {
            const tradeData = {
                userId: userOne.userId,
                crypto: 'ETH',
                type: 'BUY',
                amount: 5,
                price: 2000
            };

            const response = await request(app)
                .post('/api/trades')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send(tradeData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.type).toBe('BUY');
            
            // Verify database
            const trade = await Trade.findOne({ tradeId: response.body.data.tradeId });
            expect(trade).not.toBeNull();
        });
    });

    describe('GET /api/trades/timerange', () => {
        it('should get trades within time range', async () => {
            const startTime = new Date(Date.now() - 86400000); // 24 hours ago
            const endTime = new Date();

            const response = await request(app)
                .get('/api/trades/timerange')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .query({
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString()
                })
                .expect(200);

            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });
}); 