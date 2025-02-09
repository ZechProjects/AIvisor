// Common Types
export interface User {
    userId: string;
    walletId: string;
    usdtBalance: number;
    email: string;
}

export interface Portfolio {
    userId: string;
    crypto: string;
    amount: number;
}

export interface Trade {
    tradeId: string;
    userId: string;
    crypto: string;
    type: 'BUY' | 'SELL';
    amount: number;
    price: number;
    timestamp: string;
    avsVerified?: string;
}

export interface AIAgent {
    name: string;
    riskLevel: string;
    url: string;
}

export interface ActionToDo {
    actionType: 'BUY' | 'SELL';
    actionAmount: number;
}

export interface AgentResponse {
    responseId: string;
    agentName: string;
    userId: string;
    response: string;
    prompt: string;
    timestamp: string;
    prevResponseId?: string;
    actionsToDo: ActionToDo[];
    userAgreed: 'AGREED_AND_ACTED' | 'PARTIALLY_AGREED_SO_ACTED' | 'PARTIALLY_AGREED_NOT_ACTED' | 'NOT_AGREED_NOT_ACTED';
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
} 