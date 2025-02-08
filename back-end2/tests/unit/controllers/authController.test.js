const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const authController = require('../../../controllers/authController');
const sendEmail = require('../../../utils/sendEmail');

// Mocks
jest.mock('../../../models/User');
jest.mock('../../../utils/sendEmail');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockReq = {
            body: {},
            user: { userId: 'test-user-id' }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'Password123!',
                walletId: 'wallet123',
                userId: 'user123'
            };
            mockReq.body = userData;

            const mockUser = {
                ...userData,
                save: jest.fn().mockResolvedValue(true),
                generateAuthToken: jest.fn().mockResolvedValue('test-token')
            };

            User.mockImplementation(() => mockUser);

            await authController.register(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    user: mockUser,
                    token: 'test-token'
                }
            });
        });

        it('should handle registration errors', async () => {
            mockReq.body = {};
            User.mockImplementation(() => {
                throw new Error('Registration failed');
            });

            await authController.register(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Registration failed'
            });
        });
    });

    describe('login', () => {
        it('should login user successfully', async () => {
            mockReq.body = {
                email: 'test@example.com',
                password: 'Password123!'
            };

            const mockUser = {
                generateAuthToken: jest.fn().mockResolvedValue('test-token')
            };

            User.findByCredentials = jest.fn().mockResolvedValue(mockUser);

            await authController.login(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    user: mockUser,
                    token: 'test-token'
                }
            });
        });

        it('should handle invalid credentials', async () => {
            User.findByCredentials = jest.fn().mockRejectedValue(
                new Error('Invalid credentials')
            );

            await authController.login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid credentials'
            });
        });
    });

    describe('changePassword', () => {
        it('should change password successfully', async () => {
            mockReq.body = {
                currentPassword: 'OldPass123!',
                newPassword: 'NewPass123!'
            };

            const mockUser = {
                password: 'hashedOldPassword',
                save: jest.fn().mockResolvedValue(true),
                tokens: []
            };

            User.findOne = jest.fn().mockResolvedValue(mockUser);
            bcrypt.compare = jest.fn().mockResolvedValue(true);

            await authController.changePassword(mockReq, mockRes);

            expect(mockUser.save).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'Password changed successfully. Please login again.'
            });
        });
    });

    // ... more unit tests for resetPasswordRequest and resetPassword ...
}); 