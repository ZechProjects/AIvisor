const express = require('express');
const router = express.Router();
const promptController = require('../controllers/promptController');
const promptValidators = require('../validators/promptValidators');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/prompt:
 *   post:
 *     summary: Process a prompt with an AI agent
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agentName
 *               - prompt
 *             properties:
 *               agentName:
 *                 type: string
 *                 description: Name of the AI agent to process the prompt
 *               prompt:
 *                 type: string
 *                 description: The prompt to be processed
 *               prevResponseId:
 *                 type: string
 *                 description: ID of the previous response for conversation context
 *               context:
 *                 type: object
 *                 description: Additional context for the prompt
 *     responses:
 *       200:
 *         description: Prompt processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/AgentResponse'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Agent or previous response not found
 *       500:
 *         description: Server error
 */
router.post('/', auth, promptValidators.processPrompt, promptController.processPrompt);

module.exports = router; 