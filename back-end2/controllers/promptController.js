const aiAgentService = require('../services/aiAgentService');

const promptController = {
    processPrompt: async (req, res) => {
        try {
            const { agentName, prompt, prevResponseId, context } = req.body;
            const userId = req.user.userId; // From auth middleware

            const response = await aiAgentService.processPrompt(
                agentName,
                userId,
                prompt,
                prevResponseId,
                context
            );

            res.json({
                success: true,
                data: response
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = promptController; 