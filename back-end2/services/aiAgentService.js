const axios = require('axios');
const AiAgent = require('../models/AiAgent');
const AgentResponse = require('../models/AgentResponse');
const { v4: uuidv4 } = require('uuid');

class AiAgentService {
    async processPrompt(agentName, userId, prompt, prevResponseId, context = {}) {
        try {
            // Get AI agent details
            const agent = await AiAgent.findOne({ name: agentName });
            if (!agent) {
                throw new Error('AI agent not found');
            }

            // Get previous response if prevResponseId is provided
            let previousResponse = null;
            if (prevResponseId) {
                previousResponse = await AgentResponse.findOne({ responseId: prevResponseId });
                if (!previousResponse) {
                    throw new Error('Previous response not found');
                }
            }

            // Prepare request payload
            const payload = {
                prompt,
                userId,
                // TODO: Ideally it should be the summary of all previous responses if it not already being calculated by AI Agent
                prevResponse: previousResponse ? {
                    response: previousResponse.response,
                    actionsToDo: previousResponse.actionsToDo,
                    userAgreed: previousResponse.userAgreed
                } : null,
                context
            };

            // Call AI agent API
            const response = await axios.post(agent.url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${agent.passcode}`
                }
            });

            // Validate response format
            if (!response.data.response || !Array.isArray(response.data.actionsToDo)) {
                throw new Error('Invalid response format from AI agent');
            }

            // Create agent response record
            const agentResponse = new AgentResponse({
                responseId: uuidv4(),
                agentName,
                userId,
                response: response.data.response,
                prompt,
                timestamp: new Date(),
                prevResponseId,
                actionsToDo: response.data.actionsToDo,
                userAgreed: 'NOT_AGREED_NOT_ACTED' // Initial state
            });

            await agentResponse.save();
            return agentResponse;

        } catch (error) {
            throw new Error(`AI agent processing failed: ${error.message}`);
        }
    }
}

module.exports = new AiAgentService(); 