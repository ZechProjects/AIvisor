const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const User = require('../models/User');

const authValidators = {
    register: [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail()
            .custom(async (email) => {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new Error('Email already registered');
                }
                return true;
            }),

        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

        body('walletId')
            .notEmpty()
            .withMessage('Wallet ID is required')
            .isString()
            .withMessage('Wallet ID must be a string')
            .custom(async (walletId) => {
                const existingUser = await User.findOne({ walletId });
                if (existingUser) {
                    throw new Error('Wallet ID already registered');
                }
                return true;
            }),

        body('userId')
            .notEmpty()
            .withMessage('User ID is required')
            .isString()
            .withMessage('User ID must be a string')
            .custom(async (userId) => {
                const existingUser = await User.findOne({ userId });
                if (existingUser) {
                    throw new Error('User ID already registered');
                }
                return true;
            }),

        validateRequest
    ],

    login: [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail(),

        body('password')
            .notEmpty()
            .withMessage('Password is required'),

        validateRequest
    ],

    changePassword: [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),

        body('newPassword')
            .notEmpty()
            .withMessage('New password is required')
            .isLength({ min: 8 })
            .withMessage('New password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
            .custom((value, { req }) => {
                if (value === req.body.currentPassword) {
                    throw new Error('New password must be different from current password');
                }
                return true;
            }),

        body('confirmPassword')
            .notEmpty()
            .withMessage('Password confirmation is required')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error('Password confirmation does not match new password');
                }
                return true;
            }),

        validateRequest
    ],

    resetPasswordRequest: [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail()
            .custom(async (email) => {
                const user = await User.findOne({ email });
                if (!user) {
                    throw new Error('No account found with this email');
                }
                return true;
            }),

        validateRequest
    ],

    resetPassword: [
        body('token')
            .notEmpty()
            .withMessage('Reset token is required'),

        body('newPassword')
            .notEmpty()
            .withMessage('New password is required')
            .isLength({ min: 8 })
            .withMessage('New password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

        body('confirmPassword')
            .notEmpty()
            .withMessage('Password confirmation is required')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error('Password confirmation does not match new password');
                }
                return true;
            }),

        validateRequest
    ]
};

module.exports = authValidators; 