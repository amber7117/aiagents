import type { LucideIcon } from 'lucide-react';

export type User = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'admin' | 'agent';
};

export type ChannelType = 'WhatsApp' | 'Telegram' | 'Facebook' | 'Widget';

export type Channel = {
  id: string;
  name: string;
  type: ChannelType;
  status: 'online' | 'offline' | 'error';
  lastActivity: string;
  agentId?: string;
};

export type Message = {
  id: string;
  conversationId: string;
  sender: 'user' | 'agent' | 'ai';
  senderId?: string; // For agent
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
};

export type Conversation = {
  id: string;
  channel: Channel['type'];
  contact: {
    id: string;
    name: string;
    avatar: string;
  };
  lastMessage: Message;
  unreadCount: number;
  messages: Message[];
};

export type AIAgent = {
  id: string;
  name: string;
  description: string;
  provider: 'OpenAI' | 'DeepSeek' | 'Gemini';
  prompt: string;
  channelIds: string[];
};

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
};
