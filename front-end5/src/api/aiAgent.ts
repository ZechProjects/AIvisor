import axios from './axiosConfig';
import { AIAgent, AgentResponse } from './types';

interface ProcessPromptRequest {
    agentName: string;
    prompt: string;
    prevResponseId?: string;
    context?: Record<string, unknown>;
}

export const aiAgentService = {
    getAllAgents: () => {
        return axios.get<AIAgent[]>('/ai-agents');
    },

    getAgentByName: (name: string) => {
        return axios.get<AIAgent>(`/ai-agents/${name}`);
    },

    processPrompt: (data: ProcessPromptRequest) => {
        return axios.post<AgentResponse>('/prompt', data);
    },

    updateUserAgreed: (responseId: string, userAgreed: AgentResponse['userAgreed']) => {
        return axios.patch(`/agent-responses/${responseId}/agree`, { userAgreed });
    },

    getAgentResponseById: (responseId: string) => {
        return axios.get<AgentResponse>(`/agent-responses/${responseId}`);
    },

    getConversationThread: (responseId: string) => {
        return axios.get<AgentResponse[]>(`/agent-responses/${responseId}/thread`);
    }
}; 