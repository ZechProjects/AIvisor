const request = require('supertest');
const app = require('../../server');
const Portfolio = require('../../models/Portfolio');
const { setupDatabase, userOne } = require('../fixtures/db');

let server;

beforeAll(async () => {
    server = app.listen(0);
});

beforeEach(setupDatabase);

afterAll(async () => {
    await server.close();
});

describe('Portfolio Endpoints', () => {
    describe('POST /api/portfolio', () => {
        it('should create new portfolio entry', async () => {
            const portfolioData = {
                userId: userOne.userId,
                crypto: 'BTC',
                amount: 1.5
            };

            const response = await request(app)
                .post('/api/portfolio')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send(portfolioData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.crypto).toBe('BTC');
            expect(response.body.data.amount).toBe(1.5);

            // Verify database
            const portfolio = await Portfolio.findOne({ 
                userId: userOne.userId,
                crypto: 'BTC'
            });
            expect(portfolio).not.toBeNull();
        });

        it('should not create portfolio with invalid data', async () => {
            await request(app)
                .post('/api/portfolio')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({
                    userId: userOne.userId,
                    crypto: 'BTC',
                    amount: -1 // Invalid amount
                })
                .expect(400);
        });
    });

    describe('GET /api/portfolio/:userId', () => {
        it('should get user portfolio', async () => {
            const response = await request(app)
                .get(`/api/portfolio/${userOne.userId}`)
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .expect(200);

            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('PATCH /api/portfolio/:userId/:crypto', () => {
        it('should update portfolio amount', async () => {
            const response = await request(app)
                .patch(`/api/portfolio/${userOne.userId}/BTC`)
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({ amount: 2.0 })
                .expect(200);

            expect(response.body.data.amount).toBe(2.0);
        });
    });
}); 