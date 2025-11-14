'use client';

import {
  Bot,
  MoreVertical,
  PlusCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createAgent, getAIAgents, getChannels, deleteAgent } from '@/lib/api';
import type { AIAgent, Channel } from '@/lib/types';
import { generateAgentPrompt } from '@/ai/flows/generate-agent-prompt';
import { useToast } from '@/hooks/use-toast';

function CreateAgentDialog({
  onAgentCreate,
}: {
  onAgentCreate: (agent: AIAgent) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [provider, setProvider] = useState<'OpenAI' | 'DeepSeek' | 'Gemini'>('Gemini');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const modelOptions = {
    'OpenAI': [
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4', label: 'GPT-4' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    ],
    'Gemini': [
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
      { value: 'gemini-pro', label: 'Gemini Pro' },
    ],
    'DeepSeek': [
      { value: 'deepseek-chat', label: 'DeepSeek Chat' },
      { value: 'deepseek-coder', label: 'DeepSeek Coder' },
    ],
  };

  const handleProviderChange = (newProvider: 'OpenAI' | 'DeepSeek' | 'Gemini') => {
    setProvider(newProvider);
    // Reset model to first available option for new provider
    setModel(modelOptions[newProvider][0].value);
  };

  const handleGeneratePrompt = async () => {
    if (!description) return;
    setIsGenerating(true);
    try {
      // Simulate AI prompt generation (since we don't have the actual Genkit flow)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const samplePrompts = {
        'customer_service': `You are a helpful customer service agent for our company. Your primary goals are to:
1. Provide accurate and helpful information to customers
2. Resolve issues quickly and efficiently  
3. Maintain a friendly and professional tone
4. Escalate complex issues when necessary

Always greet customers warmly and ask how you can help them today.`,
        'sales': `You are a knowledgeable sales assistant. Your role is to:
1. Understand customer needs and recommend suitable products
2. Provide detailed product information and pricing
3. Guide customers through the purchase process
4. Build trust and rapport with potential buyers

Be enthusiastic about our products while being honest about their capabilities.`,
        'support': `You are a technical support specialist. Your responsibilities include:
1. Diagnosing technical issues accurately
2. Providing step-by-step troubleshooting guidance
3. Documenting common problems and solutions
4. Ensuring customer satisfaction with resolutions

Ask clarifying questions to understand the technical problem fully before providing solutions.`,
      };

      // Simple keyword matching for demo
      let prompt = `You are an AI assistant designed to help with: ${description}\n\nKey behaviors:
- Be helpful, accurate, and professional
- Provide clear and concise responses
- Ask clarifying questions when needed
- Maintain a friendly tone throughout conversations`;

      if (description.toLowerCase().includes('customer service') || description.toLowerCase().includes('support')) {
        prompt = samplePrompts.support;
      } else if (description.toLowerCase().includes('sales') || description.toLowerCase().includes('selling')) {
        prompt = samplePrompts.sales;
      } else if (description.toLowerCase().includes('service')) {
        prompt = samplePrompts.customer_service;
      }

      setGeneratedPrompt(prompt);
      toast({ description: "Agent prompt generated successfully." });
    } catch (error) {
      console.error('Failed to generate prompt:', error);
      setGeneratedPrompt('Error: Could not generate prompt.');
      toast({ variant: "destructive", description: "Failed to generate prompt." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !generatedPrompt || !model) return;

    try {
      const newAgent = await createAgent({
        name,
        description,
        prompt: generatedPrompt,
        provider,
        model,
        channelIds: [],
      });
      onAgentCreate(newAgent);

      setName('');
      setDescription('');
      setGeneratedPrompt('');
      setProvider('Gemini');
      setModel('gemini-1.5-flash');
      setOpen(false);
      toast({ description: `Agent "${name}" created successfully.` });
    } catch (error) {
      toast({ variant: "destructive", description: "Failed to create agent." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          Create Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <form onSubmit={handleSubmit}>
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
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New Sales Agent"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider" className="text-right">
                Provider
              </Label>
              <Select value={provider} onValueChange={handleProviderChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select AI provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gemini">Google Gemini</SelectItem>
                  <SelectItem value="OpenAI">OpenAI</SelectItem>
                  <SelectItem value="DeepSeek">DeepSeek</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Model
              </Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions[provider].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Button
                  type="button"
                  onClick={handleGeneratePrompt}
                  disabled={isGenerating || !description}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
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
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Agent</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<AIAgent | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const [agentsData, channelsData] = await Promise.all([getAIAgents(), getChannels()]);

      // Remove any potential duplicates by ID
      const uniqueAgents = agentsData.filter((agent, index, self) =>
        index === self.findIndex(a => a.id === agent.id)
      );

      setAgents(uniqueAgents);
      setChannels(channelsData);
    };
    fetchData();
  }, []);

  const handleCreateAgent = (newAgent: AIAgent) => {
    setAgents((prevAgents) => {
      // Ensure no duplicates when adding new agent
      const filtered = prevAgents.filter(a => a.id !== newAgent.id);
      return [...filtered, newAgent];
    });
  };

  const handleDeleteRequest = (agent: AIAgent) => {
    setAgentToDelete(agent);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (agentToDelete) {
      await deleteAgent(agentToDelete.id);
      setAgents(agents.filter((a) => a.id !== agentToDelete.id));
      setDeleteDialogOpen(false);
      setAgentToDelete(null);
      toast({ description: `Agent "${agentToDelete.name}" deleted.` });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground">
            Create and manage AI agents to automate responses.
          </p>
        </div>
        <CreateAgentDialog onAgentCreate={handleCreateAgent} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent: AIAgent, index) => (
          <Card key={`${agent.id}-${index}`}>
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
                  <DropdownMenuItem onClick={() => toast({ description: "Edit not implemented." })}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ description: "Duplicate not implemented." })}>
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDeleteRequest(agent)}
                  >
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
                  {(agent.channelIds || []).length > 0 ? (
                    (agent.channelIds || []).map((id) => {
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
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the agent ' '
              <span className="font-semibold text-foreground">{agentToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
