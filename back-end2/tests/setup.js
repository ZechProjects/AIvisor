require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');

process.env.JWT_SECRET = 'test-jwt-secret';
// todo: I have to read from .env file and save it to .env.test file
process.env.MONGODB_TEST_URI = process.env.MONGODB_TEST_URI;
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