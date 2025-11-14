'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { sendMessage } from '@/lib/api';
import type { Conversation, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Mic,
  Paperclip,
  Send,
  Smile,
  MoreVertical,
  Phone,
  Video,
} from 'lucide-react';
import React, { useState } from 'react';

export default function ChatDisplay({
  conversation: initialConversation,
}: {
  conversation: Conversation;
}) {
  const [conversation, setConversation] = useState(initialConversation);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const sentMessage = await sendMessage(conversation.id, newMessage);
    setConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, sentMessage],
    }));
    setNewMessage('');
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={conversation.customer.avatar}
              alt={conversation.customer.name}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold">
                {conversation.customer.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {conversation.channel.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-end gap-3',
                message.from === 'agent' ? 'flex-row-reverse' : ''
              )}
            >
              <img
                src={
                  message.from === 'agent'
                    ? conversation.agent.avatar
                    : conversation.customer.avatar
                }
                alt="Avatar"
                className="h-8 w-8 rounded-full"
              />
              <div
                className={cn(
                  'max-w-xs rounded-2xl p-3',
                  message.from === 'agent'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <form onSubmit={handleSendMessage} className="relative w-full">
          <Input
            placeholder="Type a message..."
            className="pr-28"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button variant="ghost" size="icon" type="button">
              <Smile className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" type="button">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button type="submit">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
