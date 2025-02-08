const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const User = require('../models/User');

const userValidators = {
    getUserDetails: [
        param('userId').notEmpty().isString(),
        validateRequest
    ],

    updateWalletId: [
        param('userId').notEmpty().isString(),
        body('walletId').notEmpty().isString(),
        validateRequest
    ],

    updateUsdtBalance: [
        param('userId').notEmpty().isString(),
        body('usdtBalance').isNumeric().isFloat({ min: 0 }),
        validateRequest
    ],

    resetGame: [
        param('userId')
            .notEmpty()
            .withMessage('userId is required')
            .isString()
            .withMessage('userId must be a string')
            .custom(async (userId) => {
                const user = await User.findOne({ userId });
                if (!user) {
                    throw new Error('User not found');
                }
                return true;
            }),
        validateRequest
    ],

    getTopUsers: [
        param('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
            .toInt(),
        validateRequest
    ]
};

module.exports = userValidators; 