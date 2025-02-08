require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');

process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MONGODB_TEST_URI = 'mongodb+srv://ssachin919:u0TnAB1sC75CHcYz@cluster0.ukpta.mongodb.net/aivisorTest';
process.env.NODE_ENV = 'test';

// Global setup
global.beforeAll(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_TEST_URI);
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
});

// Global teardown
global.afterAll(async () => {
    try {
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
}); 