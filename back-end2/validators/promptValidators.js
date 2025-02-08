const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const AiAgent = require('../models/AiAgent');
const AgentResponse = require('../models/AgentResponse');

const promptValidators = {
    processPrompt: [
        body('agentName')
            .notEmpty()
            .withMessage('Agent name is required')
            .custom(async (value) => {
                const agent = await AiAgent.findOne({ name: value });
                if (!agent) {
                    throw new Error('AI agent not found');
                }
                return true;
            }),
        body('prompt')
            .notEmpty()
            .withMessage('Prompt is required')
            .isString()
            .withMessage('Prompt must be a string'),
        body('prevResponseId')
            .optional()
            .custom(async (value) => {
                if (value) {
                    const response = await AgentResponse.findOne({ responseId: value });
                    if (!response) {
                        throw new Error('Previous response not found');
                    }
                }
                return true;
            }),
        body('context')
            .optional()
            .isObject()
            .withMessage('Context must be an object'),
        validateRequest
    ]
};

module.exports = promptValidators; 