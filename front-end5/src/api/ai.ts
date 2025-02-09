import axios from './axiosConfig';

interface AIAgent {
  _id: string;
  name: string;
  description: string;
}

interface AISuggestionRequest {
  prompt: string;
  agentName: string;
}

interface AISuggestionResponse {
  suggestion: string;
}

export const aiService = {
  getAgents: () => {
    return axios.get<AIAgent[]>('/ai-agents');
  },

  getSuggestion: (data: AISuggestionRequest) => {
    // NOTE: hardcoding the passcode
    return axios.post<AISuggestionResponse>(`/agent-responses/${data.agentName}/12345`, data);
  },
};
