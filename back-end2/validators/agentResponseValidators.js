const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const agentResponseValidators = {
    createAgentResponse: [
        param('agentName').notEmpty().isString(),
        param('passcode').notEmpty().isString(),
        body('responseId').notEmpty().isString(),
        body('userId').notEmpty().isString(),
        body('response').notEmpty().isString(),
        body('prompt').notEmpty().isString(),
        body('prevResponseId').optional().isString(),
        body('actionsToDo').isArray(),
        body('actionsToDo.*.actionType').isIn(['BUY', 'SELL']),
        body('actionsToDo.*.actionAmount').isNumeric().isFloat({ min: 0 }),
        body('userAgreed').isIn([
            'AGREED_AND_ACTED',
            'PARTIALLY_AGREED_SO_ACTED',
            'PARTIALLY_AGREED_NOT_ACTED',
            'NOT_AGREED_NOT_ACTED'
        ]),
        validateRequest
    ],

    updateUserAgreed: [
        param('responseId').notEmpty().isString(),
        body('userAgreed').isIn([
            'AGREED_AND_ACTED',
            'PARTIALLY_AGREED_SO_ACTED',
            'PARTIALLY_AGREED_NOT_ACTED',
            'NOT_AGREED_NOT_ACTED'
        ]),
        validateRequest
    ],

    getAgentResponseById: [
        param('responseId').notEmpty().isString(),
        validateRequest
    ]
};

module.exports = agentResponseValidators; 