'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { conversations, loggedInUser, channels, aiAgents } from '@/lib/data';
import type { Conversation, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Bot,
  Check,
  CheckCheck,
  Hand,
  MoreVertical,
  Paperclip,
  Send,
  Sparkles,
  ThumbsUp,
  UserCheck,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { summarizeConversation } from '@/ai/flows/summarize-conversation';
import { autoReplyUserMessage } from '@/ai/flows/auto-reply-user-message';

function MessageStatus({ status }: { status: Message['status'] }) {
  if (status === 'read') {
    return <CheckCheck className="h-4 w-4 text-primary" />;
  }
  if (status === 'delivered') {
    return <CheckCheck className="h-4 w-4" />;
  }
  return <Check className="h-4 w-4" />;
}

export default function ChatDisplay({
  conversation,
}: {
  conversation: Conversation;
}) {
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [inputValue, setInputValue] = useState('');
  const [suggestedReply, setSuggestedReply] = useState('');
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isAiDisabled, setIsAiDisabled] = useState(false);

  useEffect(() => {
    setMessages(conversation.messages);
    setIsAiDisabled(false); // Reset on new conversation
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const channel = channels.find(ch => ch.type === conversation.channel);

    const handleAutoReply = async () => {
      if (channel && channel.autoReply && !isAiDisabled && lastMessage && lastMessage.sender === 'user') {
        const agent = aiAgents.find(a => a.id === channel.agentId);
        
        try {
            const result = await autoReplyUserMessage({ 
                userMessage: lastMessage.content, 
                channel: conversation.channel,
                agentPrompt: agent?.prompt,
            });

            const aiMessage: Message = {
                id: `msg-${Date.now()}`,
                conversationId: conversation.id,
                sender: 'ai',
                content: result.autoReply,
                timestamp: new Date().toISOString(),
                status: 'sent',
            };
            
            // Use a timeout to simulate a more realistic chat experience
            setTimeout(() => {
                setMessages(prevMessages => [...prevMessages, aiMessage]);
            }, 1000);

        } catch (error) {
            console.error("Failed to auto-reply:", error);
            // Optionally, you could add an error message to the chat
        }
      }
    };

    handleAutoReply();
  }, [conversation, isAiDisabled]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId: conversation.id,
        sender: 'agent',
        senderId: loggedInUser.id,
        content: inputValue.trim(),
        timestamp: new Date().toISOString(),
        status: 'sent',
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
      setSuggestedReply('');
      // When agent sends a message, disable AI for this conversation
      setIsAiDisabled(true);
    }
  };
  
  const handleGenerateReply = async () => {
    setIsLoadingSuggestion(true);
    setSuggestedReply('');
    try {
        const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
        if(lastUserMessage) {
            const result = await autoReplyUserMessage({ userMessage: lastUserMessage.content, channel: conversation.channel });
            setSuggestedReply(result.autoReply);
        }
    } catch (error) {
        console.error("Failed to generate reply:", error);
        setSuggestedReply("Sorry, I couldn't generate a reply.");
    } finally {
        setIsLoadingSuggestion(false);
    }
  };
  
  const useSuggestion = () => {
    setInputValue(suggestedReply);
    setSuggestedReply('');
  }

  const handleTakeOver = () => {
    setIsAiDisabled(true);
  };


  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarImage
              src={conversation.contact.avatar}
              alt={conversation.contact.name}
            />
            <AvatarFallback>
              {conversation.contact.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{conversation.contact.name}</p>
            <p className="text-xs text-muted-foreground">
              via {conversation.channel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            {isAiDisabled ? (
                 <Badge variant="outline" className="gap-2 border-primary/50 text-primary">
                    <UserCheck className="h-4 w-4" />
                    Manually Handled
                </Badge>
            ) : (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleTakeOver} className="gap-2">
                            <Hand className="h-4 w-4" />
                            Take Over
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>Disable AI and handle this conversation manually.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}

            <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
            </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 bg-background/70">
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-end gap-2',
                message.sender !== 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={conversation.contact.avatar}
                    alt={conversation.contact.name}
                  />
                  <AvatarFallback>
                    {conversation.contact.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs rounded-lg p-3 text-sm md:max-w-md',
                  message.sender !== 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card'
                )}
              >
                <p>{message.content}</p>
                <div className="mt-1 flex items-center justify-end gap-1 text-xs text-primary-foreground/70">
                  {message.sender !== 'user' && (
                    <MessageStatus status={message.status} />
                  )}
                </div>
              </div>

              {message.sender === 'agent' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={loggedInUser.avatar}
                    alt={loggedInUser.name}
                  />
                  <AvatarFallback>
                    {loggedInUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}

              {message.sender === 'ai' && (
                 <Avatar className="h-8 w-8 bg-accent p-1.5 text-accent-foreground">
                    <Bot className="h-full w-full" />
                </Avatar>
              )}

            </div>
          ))}
        </div>
      </ScrollArea>
        {suggestedReply && (
           <div className="border-t bg-card p-4">
                <Card className="bg-background/50">
                    <CardHeader className="flex-row items-center justify-between space-y-0 p-4">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Suggested Reply
                        </CardTitle>
                        <Button size="sm" variant="ghost" onClick={useSuggestion}>Use Suggestion</Button>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">{suggestedReply}</p>
                    </CardContent>
                </Card>
           </div>
        )}
      <div className="border-t bg-card p-4">
        <form onSubmit={handleSendMessage} className="relative">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="pr-28"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSendMessage(e);
              }
            }}
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleGenerateReply}
                    disabled={isLoadingSuggestion}
                  >
                    <Sparkles className={cn("h-5 w-5", isLoadingSuggestion && "animate-spin")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate AI Reply</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attach file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button type="submit" size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
