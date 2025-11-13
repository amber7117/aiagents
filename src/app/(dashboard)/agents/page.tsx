'use client';

import {
  Bot,
  MoreVertical,
  PlusCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { aiAgents, channels } from '@/lib/data';
import type { AIAgent } from '@/lib/types';
import { generateAgentPrompt } from '@/ai/flows/generate-agent-prompt';

function CreateAgentDialog() {
  const [description, setDescription] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePrompt = async () => {
    if (!description) return;
    setIsGenerating(true);
    try {
      const result = await generateAgentPrompt({ agentDescription: description });
      setGeneratedPrompt(result.agentPrompt);
    } catch (error) {
      console.error("Failed to generate prompt:", error);
      setGeneratedPrompt("Error: Could not generate prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          Create Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New AI Agent</DialogTitle>
          <DialogDescription>
            Configure a new agent to automate conversations.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="New Sales Agent" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <div className="col-span-3 space-y-2">
                <Textarea
                    id="description"
                    placeholder="Describe the agent's purpose, e.g., 'A friendly bot that helps users with pricing questions.'"
                    className="min-h-[100px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button onClick={handleGeneratePrompt} disabled={isGenerating || !description} size="sm" variant="outline" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    {isGenerating ? 'Generating...' : 'Generate Prompt from Description'}
                </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="prompt" className="text-right pt-2">
              Agent Prompt
            </Label>
            <Textarea
              id="prompt"
              placeholder="System prompt for the AI..."
              className="col-span-3 min-h-[150px]"
              value={generatedPrompt}
              onChange={(e) => setGeneratedPrompt(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Agent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function AgentsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground">
            Create and manage AI agents to automate responses.
          </p>
        </div>
        <CreateAgentDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {aiAgents.map((agent: AIAgent) => (
          <Card key={agent.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground h-10">{agent.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <Badge variant="outline">{agent.provider}</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col gap-2 text-sm w-full">
                <h4 className="font-medium">Active on:</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.channelIds.length > 0 ? (
                    agent.channelIds.map((id) => {
                      const channel = channels.find((c) => c.id === id);
                      return (
                        <Badge key={id} variant="secondary" className="gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {channel?.name || 'Unknown Channel'}
                        </Badge>
                      );
                    })
                  ) : (
                    <p className="text-xs text-muted-foreground">No channels assigned</p>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
