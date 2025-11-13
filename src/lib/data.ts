import type { User, Channel, AIAgent, Conversation } from './types';

export const loggedInUser: User = {
  id: 'user-0',
  name: 'Alex Shen',
  avatar: 'https://picsum.photos/seed/0/100/100',
  email: 'alex.shen@example.com',
  role: 'admin',
};

export const users: User[] = [
  loggedInUser,
  { id: 'user-1', name: 'Jane Doe', avatar: 'https://picsum.photos/seed/1/100/100', email: 'jane.d@example.com', role: 'agent' },
  { id: 'user-2', name: 'John Smith', avatar: 'https://picsum.photos/seed/2/100/100', email: 'john.s@example.com', role: 'agent' },
];

export const channels: Channel[] = [
  { id: 'ch-1', name: 'WhatsApp Business', type: 'WhatsApp', status: 'online', lastActivity: '2 minutes ago', agentId: 'agent-1', autoReply: true },
  { id: 'ch-2', name: 'Support Bot', type: 'Telegram', status: 'online', lastActivity: '5 minutes ago', agentId: 'agent-2', autoReply: true },
  { id: 'ch-3', name: 'Marketing Page', type: 'Facebook', status: 'offline', lastActivity: '1 day ago', agentId: 'agent-3', autoReply: false },
  { id: 'ch-5', name: 'WeChat Official', type: 'WeChat', status: 'online', lastActivity: '10 minutes ago', agentId: 'agent-1', autoReply: true },
  { id: 'ch-4', name: 'Website Chat', type: 'Widget', status: 'error', lastActivity: '3 hours ago', autoReply: true },
];

export const aiAgents: AIAgent[] = [
  {
    id: 'agent-1',
    name: 'Sales Support Agent',
    description: 'Handles initial sales inquiries and product questions.',
    provider: 'OpenAI',
    prompt: 'You are a helpful sales assistant. Your goal is to answer product questions and guide users towards making a purchase.',
    channelIds: ['ch-1', 'ch-4', 'ch-5'],
  },
  {
    id: 'agent-2',
    name: 'General Support Agent',
    description: 'A general-purpose agent for handling various customer support issues.',
    provider: 'Gemini',
    prompt: 'You are a friendly and patient support agent. Help users resolve their issues and provide clear instructions.',
    channelIds: ['ch-2'],
  },
  {
    id: 'agent-3',
    name: 'Lead Generation Bot',
    description: 'Engages with users on Facebook to qualify leads.',
    provider: 'DeepSeek',
    prompt: 'You are a lead generation bot. Your objective is to collect user information like name, email, and company.',
    channelIds: ['ch-3'],
  },
];

export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    channel: 'WhatsApp',
    contact: { id: 'contact-1', name: 'Emily Carter', avatar: 'https://picsum.photos/seed/10/100/100' },
    unreadCount: 2,
    lastMessage: {
      id: 'msg-1-3',
      conversationId: 'conv-1',
      sender: 'user',
      content: 'That sounds great, thank you!',
      timestamp: '2024-08-15T10:32:00Z',
      status: 'read',
    },
    messages: [
      { id: 'msg-1-1', conversationId: 'conv-1', sender: 'user', content: 'Hi, I have a question about my recent order.', timestamp: '2024-08-15T10:30:00Z', status: 'read' },
      { id: 'msg-1-2', conversationId: 'conv-1', sender: 'agent', senderId: 'user-1', content: 'Hello Emily! I can help with that. What is your order number?', timestamp: '2024-08-15T10:31:00Z', status: 'read' },
      { id: 'msg-1-3', conversationId: 'conv-1', sender: 'user', content: 'It is #12345. I was wondering about the shipping status.', timestamp: '2024-08-15T10:32:00Z', status: 'read' },
      { id: 'msg-1-4', conversationId: 'conv-1', sender: 'agent', senderId: 'user-1', content: 'Let me check... It seems your order has been shipped and is scheduled for delivery tomorrow.', timestamp: '2024-08-15T10:33:00Z', status: 'delivered' },
    ],
  },
  {
    id: 'conv-2',
    channel: 'Widget',
    contact: { id: 'contact-2', name: 'Ben Adams', avatar: 'https://picsum.photos/seed/11/100/100' },
    unreadCount: 0,
    lastMessage: {
      id: 'msg-2-2',
      conversationId: 'conv-2',
      sender: 'ai',
      content: 'I have created a support ticket for you. An agent will get back to you shortly.',
      timestamp: '2024-08-15T11:05:00Z',
      status: 'sent',
    },
    messages: [
      { id: 'msg-2-1', conversationId: 'conv-2', sender: 'user', content: 'My account is locked, can you help?', timestamp: '2024-08-15T11:04:00Z', status: 'read' },
      { id: 'msg-2-2', conversationId: 'conv-2', sender: 'ai', content: 'I have created a support ticket for you. An agent will get back to you shortly.', timestamp: '2024-08-15T11:05:00Z', status: 'sent' },
    ],
  },
  {
    id: 'conv-3',
    channel: 'Telegram',
    contact: { id: 'contact-3', name: 'Chloe Green', avatar: 'https://picsum.photos/seed/12/100/100' },
    unreadCount: 0,
    lastMessage: {
      id: 'msg-3-2',
      conversationId: 'conv-3',
      sender: 'agent',
      senderId: 'user-2',
      content: 'You are welcome!',
      timestamp: '2024-08-14T15:20:00Z',
      status: 'read',
    },
    messages: [
        { id: 'msg-3-1', conversationId: 'conv-3', sender: 'user', content: 'Thanks for the help!', timestamp: '2024-08-14T15:19:00Z', status: 'read' },
        { id: 'msg-3-2', conversationId: 'conv-3', sender: 'agent', senderId: 'user-2', content: 'You are welcome!', timestamp: '2024-08-14T15:20:00Z', status: 'read' },
    ]
  },
  {
    id: 'conv-4',
    channel: 'Facebook',
    contact: { id: 'contact-4', name: 'David Lee', avatar: 'https://picsum.photos/seed/13/100/100' },
    unreadCount: 1,
    lastMessage: {
      id: 'msg-4-1',
      conversationId: 'conv-4',
      sender: 'user',
      content: 'Do you have any discounts available?',
      timestamp: '2024-08-15T12:00:00Z',
      status: 'delivered',
    },
    messages: [
        { id: 'msg-4-1', conversationId: 'conv-4', sender: 'user', content: 'Do you have any discounts available?', timestamp: '2024-08-15T12:00:00Z', status: 'delivered' },
    ]
  },
  {
    id: 'conv-5',
    channel: 'WeChat',
    contact: { id: 'contact-5', name: 'Zhang Wei', avatar: 'https://picsum.photos/seed/14/100/100' },
    unreadCount: 3,
    lastMessage: {
      id: 'msg-5-1',
      conversationId: 'conv-5',
      sender: 'user',
      content: '你好，请问这个产品还有库存吗？',
      timestamp: '2024-08-15T14:00:00Z',
      status: 'delivered',
    },
    messages: [
        { id: 'msg-5-1', conversationId: 'conv-5', sender: 'user', content: '你好，请问这个产品还有库存吗？', timestamp: '2024-08-15T14:00:00Z', status: 'delivered' },
    ]
  },
];
