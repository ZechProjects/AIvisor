const express = require('express');
const router = express.Router();
const agentResponseController = require('../controllers/agentResponseController');
const agentResponseValidators = require('../validators/agentResponseValidators');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     ActionToDo:
 *       type: object
 *       required:
 *         - actionType
 *         - actionAmount
 *       properties:
 *         actionType:
 *           type: string
 *           enum: [BUY, SELL]
 *         actionAmount:
 *           type: number
 *     AgentResponse:
 *       type: object
 *       required:
 *         - responseId
 *         - agentName
 *         - userId
 *         - response
 *         - prompt
 *         - userAgreed
 *       properties:
 *         responseId:
 *           type: string
 *           description: Unique identifier for the response
 *         agentName:
 *           type: string
 *           description: Name of the AI agent
 *         userId:
 *           type: string
 *           description: User's identifier
 *         response:
 *           type: string
 *           description: AI agent's response
 *         prompt:
 *           type: string
 *           description: User's prompt
 *         timestamp:
 *           type: string
 *           format: date-time
 *         prevResponseId:
 *           type: string
 *           nullable: true
 *         actionsToDo:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ActionToDo'
 *         userAgreed:
 *           type: string
 *           enum: [AGREED_AND_ACTED, PARTIALLY_AGREED_SO_ACTED, PARTIALLY_AGREED_NOT_ACTED, NOT_AGREED_NOT_ACTED]
 */

/**
 * @swagger
 * /api/agent-responses/{agentName}/{passcode}:
 *   post:
 *     summary: Create new agent response
 *     tags: [Agent Responses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agentName
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
 *             $ref: '#/components/schemas/AgentResponse'
 *     responses:
 *       201:
 *         description: Agent response created successfully
 *       401:
 *         description: Invalid passcode
 */
router.post('/:agentName/:passcode', auth, agentResponseValidators.createAgentResponse, agentResponseController.createAgentResponse);

/**
 * @swagger
 * /api/agent-responses/{responseId}/agree:
 *   patch:
 *     summary: Update user agreement status
 *     tags: [Agent Responses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: responseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userAgreed
 *             properties:
 *               userAgreed:
 *                 type: string
 *                 enum: [AGREED_AND_ACTED, PARTIALLY_AGREED_SO_ACTED, PARTIALLY_AGREED_NOT_ACTED, NOT_AGREED_NOT_ACTED]
 *     responses:
 *       200:
 *         description: Agreement status updated successfully
 */
router.patch('/:responseId/agree', auth, agentResponseValidators.updateUserAgreed, agentResponseController.updateUserAgreed);

/**
 * @swagger
 * /api/agent-responses/{responseId}:
 *   get:
 *     summary: Get agent response by ID
 *     tags: [Agent Responses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: responseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agent response retrieved successfully
 *       404:
 *         description: Response not found
 */
router.get('/:responseId', auth, agentResponseValidators.getAgentResponseById, agentResponseController.getAgentResponseById);

/**
 * @swagger
 * /api/agent-responses/{responseId}/thread:
 *   get:
 *     summary: Get conversation thread
 *     tags: [Agent Responses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: responseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation thread retrieved successfully
 */
router.get('/:responseId/thread', auth, agentResponseValidators.getAgentResponseById, agentResponseController.getConversationThread);

module.exports = router; 