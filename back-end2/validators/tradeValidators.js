const { body, param, query } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const tradeValidators = {
    createTrade: [
        body('tradeId').notEmpty().isString(),
        body('userId').notEmpty().isString(),
        body('crypto').notEmpty().isString(),
        body('type').isIn(['BUY', 'SELL']),
        body('amount').isNumeric().isFloat({ min: 0 }),
        body('price').isNumeric().isFloat({ min: 0 }),
        validateRequest
    ],

    updateAvsVerified: [
        param('tradeId').notEmpty().isString(),
        body('avsVerified').notEmpty().isString(),
        validateRequest
    ],

    getTradesByTimeRange: [
        query('startTime').notEmpty().isISO8601(),
        query('endTime').notEmpty().isISO8601(),
        validateRequest
    ],

    getTradeById: [
        param('tradeId').notEmpty().isString(),
        validateRequest
    ]
};

module.exports = tradeValidators; 