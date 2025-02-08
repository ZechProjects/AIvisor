const AgentResponse = require('../models/AgentResponse');
const AiAgent = require('../models/AiAgent');

const agentResponseController = {
    // Create new agent response (requires agent passcode)
    createAgentResponse: async (req, res) => {
        try {
            const { agentName, passcode } = req.params;
            const { 
                responseId, 
                userId, 
                response, 
                prompt, 
                prevResponseId, 
                actionsToDo, 
                userAgreed 
            } = req.body;

            // Verify agent passcode
            const agent = await AiAgent.findOne({ name: agentName });
            // TODO: decrypt the passcode using bcrypt
            if (!agent || agent.passcode !== passcode) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid passcode or agent name' 
                });
            }

            const agentResponse = new AgentResponse({
                responseId,
                agentName,
                userId,
                response,
                prompt,
                timestamp: new Date(),
                prevResponseId,
                actionsToDo,
                userAgreed
            });

            await agentResponse.save();
            res.status(201).json({ success: true, data: agentResponse });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Response with this responseId already exists' 
                });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Update userAgreed field
    updateUserAgreed: async (req, res) => {
        try {
            const { responseId } = req.params;
            const { userAgreed } = req.body;

            const response = await AgentResponse.findOneAndUpdate(
                { responseId },
                { userAgreed },
                { new: true }
            );

            if (!response) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Agent response not found' 
                });
            }

            res.json({ success: true, data: response });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get agent response by responseId
    getAgentResponseById: async (req, res) => {
        try {
            const { responseId } = req.params;
            const response = await AgentResponse.findOne({ responseId });

            if (!response) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Agent response not found' 
                });
            }

            res.json({ success: true, data: response });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get conversation thread using prevResponseId
    getConversationThread: async (req, res) => {
        try {
            const { responseId } = req.params;
            let thread = [];
            let currentResponseId = responseId;

            // Traverse the conversation thread using prevResponseId
            while (currentResponseId) {
                const response = await AgentResponse.findOne({ responseId: currentResponseId });
                if (!response) break;

                thread.unshift(response); // Add to start of array to maintain chronological order
                currentResponseId = response.prevResponseId;
            }

            res.json({ success: true, data: thread });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = agentResponseController; 