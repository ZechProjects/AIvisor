const AiAgent = require('../models/AiAgent');

const aiAgentController = {
    // Create new AI agent
    createAiAgent: async (req, res) => {
        try {
            const { name, riskLevel, url, passcode } = req.body;
            
            // TODO: save the passcode in encrypted form using bcrypt
            const aiAgent = new AiAgent({
                name,
                riskLevel,
                url,
                passcode
            });

            await aiAgent.save();
            res.status(201).json({ success: true, data: aiAgent });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'AI Agent with this name already exists' 
                });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Update AI agent by passcode
    updateAiAgent: async (req, res) => {
        try {
            const { name, passcode } = req.params;
            const updates = req.body;

            // Verify passcode first
            const agent = await AiAgent.findOne({ name });
            if (!agent || agent.passcode !== passcode) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid passcode or agent name' 
                });
            }

            const updatedAgent = await AiAgent.findOneAndUpdate(
                { name },
                updates,
                { new: true }
            );

            res.json({ success: true, data: updatedAgent });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get AI agent by name
    getAiAgentByName: async (req, res) => {
        try {
            const { name } = req.params;
            const agent = await AiAgent.findOne({ name });

            if (!agent) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'AI Agent not found' 
                });
            }

            // Don't send passcode in response
            const agentWithoutPasscode = agent.toObject();
            delete agentWithoutPasscode.passcode;

            res.json({ success: true, data: agentWithoutPasscode });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get all AI agents
    getAllAiAgents: async (req, res) => {
        try {
            const agents = await AiAgent.find({}, { passcode: 0 }); // Exclude passcode
            res.json({ success: true, data: agents });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = aiAgentController; 