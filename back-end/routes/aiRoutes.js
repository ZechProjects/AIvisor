const express = require('express');
const AiAgent = require('../models/AiAgent');
const router = express.Router();
var request = require('request');
const rp = require('request-promise');

/**
 * @swagger
 * /api/ai/agents:
 *   get:
 *     summary: Retrieve all AI agents
 *     description: Returns a list of all AI agents from the database
 *     tags: [AI Agents]
 *     responses:
 *       200:
 *         description: A list of AI agents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The agent's unique identifier
 *                   name:
 *                     type: string
 *                     description: The name of the AI agent
 *                   description:
 *                     type: string
 *                     description: Description of the AI agent
 *       500:
 *         description: Server error
 */
router.get('/agents', async (req, res) => {
    const agents = await AiAgent.find();
    res.json(agents);
});

/**
 * @swagger
 * /api/ai/suggest:
 *   post:
 *     summary: Get AI suggestion
 *     description: Returns a suggestion from the AI based on provided input
 *     tags: [AI Agents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The input prompt for the AI
 *               agentId:
 *                 type: string
 *                 description: The ID of the AI agent to use
 *     responses:
 *       200:
 *         description: AI suggestion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suggestion:
 *                   type: string
 *                   description: The AI's suggestion
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: AI agent not found
 *       500:
 *         description: Server error
 */
router.post('/suggest', async (req, res) => {
    try {
        const {prompt, agentId} = req.body;

        if (!prompt || !agentId) {
            return res.status(400).json({error: 'Prompt and agentId are required'});
        }

//    const agent = await AiAgent.findById(11);
//    if (!agent) {
//      return res.status(404).json({ error: 'AI agent not found' });
//    }

        // TODO: Implement actual AI suggestion logic here
        var suggestion = `Sample suggestion for prompt: ${prompt}, Suggestion: `;
        rp({
            method: 'POST',
            uri: 'http://localhost:3000/b850bc30-45f8-0041-a00a-83df46d8555d/message',
            body: {
                "text": prompt,
                "userId": "user",
                "userName": "User"
            },
            json: true
        })
            .then(function (body) {
                console.log(body);
                suggestion += JSON.stringify(body);
                res.json({suggestion});

            })
            .catch(function (error) {
                console.error(error);
            });
    } catch (error) {
        console.error('Error getting AI suggestion:', error);
        res.status(500).json({error: 'Failed to get AI suggestion'});
    }
});

module.exports = router;
