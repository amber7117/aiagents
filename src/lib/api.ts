
import { users, aiAgents, channels, files, aiSettings, analyticsStats, conversationVolumeData, responseTimeData, satisfactionData } from './data';
import conversationsData from './conversations.json';
import type { User, AIAgent, Channel, Conversation, FileItem, AISettings, Message, ChannelType } from './types';

// Simulate a network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique ID with timestamp and random component
const generateUniqueId = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const conversations: Conversation[] = conversationsData as Conversation[];

// API functions
export async function getLoggedInUser(): Promise<User> {
    await delay(100);

    // Check if user is stored in localStorage (for demo purposes)
    if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                localStorage.removeItem('user');
            }
        }
    }

    // Fallback to default user
    return users[0];
}
export async function getUsers(): Promise<User[]> {
    await delay(500);
    return users;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
    await delay(500);
    const user = users.find(u => u.id === userId);
    if (!user) {
        throw new Error('User not found');
    }
    Object.assign(user, updates);
    console.log(`Updated user ${userId}:`, user);
    return user;
}

export async function getAIAgents(): Promise<AIAgent[]> {
    await delay(500);
    return aiAgents;
}

export async function getChannels(): Promise<Channel[]> {
    await delay(500);
    return channels;
}

export async function addChannel({ name, type }: { name: string, type: ChannelType }): Promise<Channel> {
    await delay(500);
    const newChannel: Channel = {
        id: generateUniqueId('ch'),
        name,
        type,
        status: 'offline',
        lastActivity: 'Never',
        autoReply: true,
    };
    channels.push(newChannel);
    return newChannel;
}

export async function getConversations(): Promise<Conversation[]> {
    await delay(500);
    return conversations;
}

export async function getConversation(id: string): Promise<Conversation | undefined> {
    await delay(500);
    return conversations.find(conv => conv.id === id);
}

export async function getMessages(conversationId: string): Promise<Message[]> {
    await delay(200);
    const conversation = conversations.find(conv => conv.id === conversationId);
    return conversation ? conversation.messages : [];
}

export async function sendMessage(conversationId: string, text: string): Promise<Message> {
    await delay(300);
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) {
        throw new Error('Conversation not found');
    }
    const newMessage: Message = {
        id: generateUniqueId('msg'),
        from: 'agent',
        text,
        timestamp: new Date().toISOString(),
        read: true,
    };
    conversation.messages.push(newMessage);
    return newMessage;
}

export async function getFiles(): Promise<FileItem[]> {
    await delay(500);
    return files;
}

export async function getAISettings(): Promise<AISettings> {
    await delay(500);
    return aiSettings;
}

export async function saveAISettings(settings: AISettings): Promise<void> {
    await delay(500);
    Object.assign(aiSettings, settings);
    console.log('Saved AI settings:', aiSettings);
}

export async function updateChannel(channelId: string, updates: Partial<Channel>): Promise<Channel> {
    await delay(500);
    const channel = channels.find(ch => ch.id === channelId);
    if (!channel) {
        throw new Error('Channel not found');
    }
    Object.assign(channel, updates);
    console.log(`Updated channel ${channelId}:`, channel);
    return channel;
}

// Analytics API
export async function getAnalyticsStats() {
    await delay(700);
    return analyticsStats;
}

export async function getConversationVolume() {
    await delay(700);
    return conversationVolumeData;
}

export async function getResponseTime() {
    await delay(700);
    return responseTimeData;
}

export async function getSatisfactionRatings() {
    await delay(700);
    return satisfactionData;
}


export async function createAgent(agent: Omit<AIAgent, 'id'>): Promise<AIAgent> {
    await delay(500);
    const newAgent: AIAgent = {
        id: generateUniqueId('agent'),
        ...agent,
        channelIds: [],
    };
    aiAgents.push(newAgent);
    return newAgent;
}

export async function deleteAgent(agentId: string): Promise<{ success: boolean }> {
    await delay(500);
    const index = aiAgents.findIndex(a => a.id === agentId);
    if (index > -1) {
        aiAgents.splice(index, 1);
        channels.forEach(c => {
            if (c.agentId === agentId) {
                c.agentId = undefined;
            }
        });
        return { success: true };
    }
    return { success: false };
}

export async function deleteFile(fileId: string): Promise<{ success: boolean }> {
    await delay(300);
    const index = files.findIndex((f) => f.id === fileId);
    if (index > -1) {
        files.splice(index, 1);
        return { success: true };
    }
    return { success: false };
}
