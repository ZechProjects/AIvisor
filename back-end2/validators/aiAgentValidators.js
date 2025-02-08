const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const aiAgentValidators = {
    createAiAgent: [
        body('name').notEmpty().isString(),
        body('riskLevel').notEmpty().isString(),
        body('url').notEmpty().isURL(),
        body('passcode').notEmpty().isString().isLength({ min: 6 }),
        validateRequest
    ],

    updateAiAgent: [
        param('name').notEmpty().isString(),
        param('passcode').notEmpty().isString(),
        body('riskLevel').optional().isString(),
        body('url').optional().isURL(),
        validateRequest
    ],

    getAiAgentByName: [
        param('name').notEmpty().isString(),
        validateRequest
    ]
};

module.exports = aiAgentValidators; 