const express = require('express');
const router = express.Router();
const aiAgentController = require('../controllers/aiAgentController');
const aiAgentValidators = require('../validators/aiAgentValidators');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     AiAgent:
 *       type: object
 *       required:
 *         - name
 *         - riskLevel
 *         - url
 *         - passcode
 *       properties:
 *         name:
 *           type: string
 *           description: Unique name of the AI agent
 *         riskLevel:
 *           type: string
 *           description: Risk level of the AI agent
 *         url:
 *           type: string
 *           description: URL endpoint of the AI agent
 *         passcode:
 *           type: string
 *           description: Passcode for agent authentication
 */

/**
 * @swagger
 * /api/ai-agents:
 *   post:
 *     summary: Create a new AI agent
 *     tags: [AI Agents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AiAgent'
 *     responses:
 *       201:
 *         description: AI agent created successfully
 *       400:
 *         description: Invalid input or duplicate name
 */
router.post('/', 
    auth, 
    aiAgentValidators.createAiAgent, 
    aiAgentController.createAiAgent
);

/**
 * @swagger
 * /api/ai-agents/{name}/{passcode}:
 *   patch:
 *     summary: Update AI agent
 *     tags: [AI Agents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: passcode
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               riskLevel:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI agent updated successfully
 *       401:
 *         description: Invalid passcode
 */
router.patch('/:name/:passcode', 
    auth, 
    aiAgentValidators.updateAiAgent, 
    aiAgentController.updateAiAgent
);

/**
 * @swagger
 * /api/ai-agents/{name}:
 *   get:
 *     summary: Get AI agent by name
 *     tags: [AI Agents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: AI agent retrieved successfully
 *       404:
 *         description: AI agent not found
 */
router.get('/:name', 
    auth, 
    aiAgentValidators.getAiAgentByName, 
    aiAgentController.getAiAgentByName
);

/**
 * @swagger
 * /api/ai-agents:
 *   get:
 *     summary: Get all AI agents
 *     tags: [AI Agents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of AI agents retrieved successfully
 */
router.get('/', 
    auth, 
    aiAgentController.getAllAiAgents
);

module.exports = router; 