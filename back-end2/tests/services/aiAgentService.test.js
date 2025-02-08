const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const aiAgentService = require('../../services/aiAgentService');
const AiAgent = require('../../models/AiAgent');
const AgentResponse = require('../../models/AgentResponse');

// Mock dependencies
jest.mock('axios');
jest.mock('uuid');
jest.mock('../../models/AiAgent');
jest.mock('../../models/AgentResponse');

describe('AiAgentService', () => {
    const mockAgent = {
        name: 'testAgent',
        url: 'http://test-agent.com',
        passcode: 'test-passcode'
    };

    const mockPrevResponse = {
        responseId: 'prev-response-id',
        response: 'Previous response',
        actionsToDo: [{ actionType: 'BUY', actionAmount: 100 }],
        userAgreed: 'AGREED_AND_ACTED'
    };

    const mockAiResponse = {
        data: {
            response: 'AI response',
            actionsToDo: [{ actionType: 'SELL', actionAmount: 50 }]
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        AiAgent.findOne.mockResolvedValue(mockAgent);
        AgentResponse.findOne.mockResolvedValue(mockPrevResponse);
        axios.post.mockResolvedValue(mockAiResponse);
        uuidv4.mockReturnValue('new-response-id');
    });

    describe('processPrompt', () => {
        it('should process prompt successfully with all parameters', async () => {
            const result = await aiAgentService.processPrompt(
                'testAgent',
                'user123',
                'Test prompt',
                'prev-response-id',
                { someContext: true }
            );

            // Verify AI agent lookup
            expect(AiAgent.findOne).toHaveBeenCalledWith({ name: 'testAgent' });

            // Verify previous response lookup
            expect(AgentResponse.findOne).toHaveBeenCalledWith({ 
                responseId: 'prev-response-id' 
            });

            // Verify AI API call
            expect(axios.post).toHaveBeenCalledWith(
                mockAgent.url,
                {
                    prompt: 'Test prompt',
                    userId: 'user123',
                    prevResponse: {
                        response: mockPrevResponse.response,
                        actionsToDo: mockPrevResponse.actionsToDo,
                        userAgreed: mockPrevResponse.userAgreed
                    },
                    context: { someContext: true }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${mockAgent.passcode}`
                    }
                }
            );

            // Verify response saving
            expect(result).toMatchObject({
                responseId: 'new-response-id',
                agentName: 'testAgent',
                userId: 'user123',
                response: mockAiResponse.data.response,
                prompt: 'Test prompt',
                prevResponseId: 'prev-response-id',
                actionsToDo: mockAiResponse.data.actionsToDo,
                userAgreed: 'NOT_AGREED_NOT_ACTED'
            });
        });

        it('should throw error if AI agent not found', async () => {
            AiAgent.findOne.mockResolvedValue(null);

            await expect(aiAgentService.processPrompt(
                'nonexistentAgent',
                'user123',
                'Test prompt'
            )).rejects.toThrow('AI agent not found');
        });

        it('should throw error if previous response not found', async () => {
            AgentResponse.findOne.mockResolvedValue(null);

            await expect(aiAgentService.processPrompt(
                'testAgent',
                'user123',
                'Test prompt',
                'invalid-response-id'
            )).rejects.toThrow('Previous response not found');
        });

        it('should throw error if AI response format is invalid', async () => {
            axios.post.mockResolvedValue({
                data: {
                    response: 'AI response'
                    // Missing actionsToDo
                }
            });

            await expect(aiAgentService.processPrompt(
                'testAgent',
                'user123',
                'Test prompt'
            )).rejects.toThrow('Invalid response format from AI agent');
        });

        it('should process prompt without previous response', async () => {
            const result = await aiAgentService.processPrompt(
                'testAgent',
                'user123',
                'Test prompt'
            );

            expect(AgentResponse.findOne).not.toHaveBeenCalled();
            expect(result.prevResponseId).toBeUndefined();
        });

        it('should handle AI API errors', async () => {
            axios.post.mockRejectedValue(new Error('API error'));

            await expect(aiAgentService.processPrompt(
                'testAgent',
                'user123',
                'Test prompt'
            )).rejects.toThrow('AI agent processing failed: API error');
        });
    });
}); 