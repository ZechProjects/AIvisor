const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const portfolioValidators = {
    createPortfolio: [
        body('userId').notEmpty().isString(),
        body('crypto').notEmpty().isString(),
        body('amount').isNumeric().isFloat({ min: 0 }),
        validateRequest
    ],

    updatePortfolio: [
        param('userId').notEmpty().isString(),
        param('crypto').notEmpty().isString(),
        body('amount').isNumeric().isFloat({ min: 0 }),
        validateRequest
    ],

    deletePortfolio: [
        param('userId').notEmpty().isString(),
        param('crypto').notEmpty().isString(),
        validateRequest
    ],

    getUserPortfolio: [
        param('userId')
            .notEmpty()
            .withMessage('User ID is required')
            .isString()
            .withMessage('User ID must be a string'),
        validateRequest
    ]
};

module.exports = portfolioValidators; 