import axios from './axiosConfig';

interface AIAgent {
  _id: string;
  name: string;
  description: string;
}

interface AISuggestionRequest {
  prompt: string;
  agentId: string;
}

interface AISuggestionResponse {
  suggestion: string;
}

export const aiService = {
  getAgents: () => {
    return axios.get<AIAgent[]>('/ai/agents');
  },

  getSuggestion: (data: AISuggestionRequest) => {
    return axios.post<AISuggestionResponse>('/ai/suggest', data);
  },
};
