const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/User');
const { setupDatabase, userOne, userOneId } = require('../fixtures/db');

let server;

beforeAll(async () => {
    server = app.listen(0); // Use random port for testing
});

beforeEach(setupDatabase);

afterAll(async () => {
    await server.close();
});

describe('Auth Endpoints', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'newuser@example.com',
                    password: 'ValidPass123!',
                    walletId: 'newwallet123',
                    userId: 'newuser123'
                })
                .expect(201);

            // Assert the response
            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toHaveProperty('email', 'newuser@example.com');
            expect(response.body.data).toHaveProperty('token');

            // Verify database
            const user = await User.findOne({ email: 'newuser@example.com' });
            expect(user).not.toBeNull();
        });

        it('should not register user with existing email', async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    email: userOne.email,
                    password: 'ValidPass123!',
                    walletId: 'uniquewallet',
                    userId: 'uniqueuser'
                })
                .expect(400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login existing user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: userOne.email,
                    password: userOne.password
                })
                .expect(200);

            expect(response.body.data).toHaveProperty('token');
        });

        it('should not login with wrong password', async () => {
            await request(app)
                .post('/api/auth/login')
                .send({
                    email: userOne.email,
                    password: 'wrongpassword'
                })
                .expect(401);
        });
    });

    describe('POST /api/auth/change-password', () => {
        it('should change password with valid token and current password', async () => {
            await request(app)
                .post('/api/auth/change-password')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({
                    currentPassword: userOne.password,
                    newPassword: 'NewValidPass123!',
                    confirmPassword: 'NewValidPass123!'
                })
                .expect(200);
        });
    });

    // ... more integration tests for reset password endpoints ...
}); 