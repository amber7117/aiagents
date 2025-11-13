'use client';

import { MoreHorizontal, PlusCircle } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { channels as initialChannels, aiAgents } from '@/lib/data';
import type { Channel } from '@/lib/types';
import { cn } from '@/lib/utils';

import { WhatsAppLogo } from '@/components/icons/whatsapp-logo';
import { TelegramLogo } from '@/components/icons/telegram-logo';
import { FacebookLogo } from '@/components/icons/facebook-logo';
import { MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const channelIcons: Record<string, React.ElementType> = {
  WhatsApp: WhatsAppLogo,
  Telegram: TelegramLogo,
  Facebook: FacebookLogo,
  Widget: MessageSquare,
};

function AddChannelDialog({ onAddChannel }: { onAddChannel: (newChannel: Channel) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<Channel['type'] | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type) return;

    const newChannel: Channel = {
      id: `ch-${Date.now()}`,
      name,
      type,
      status: 'online',
      lastActivity: 'Just now',
      autoReply: true,
    };
    onAddChannel(newChannel);
    setOpen(false);
    setName('');
    setType('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          Add Channel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Channel</DialogTitle>
            <DialogDescription>
              Connect a new communication channel to your workspace.
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
                placeholder="My new channel"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select onValueChange={(value) => setType(value as Channel['type'])} value={type}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a channel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Telegram">Telegram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Widget">Website Widget</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Channel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);

  const handleAddChannel = (newChannel: Channel) => {
    setChannels((prev) => [...prev, newChannel]);
  };

  const handleAgentChange = (channelId: string, agentId: string) => {
    setChannels(prev => prev.map(ch => ch.id === channelId ? {...ch, agentId: agentId === 'none' ? undefined : agentId} : ch));
  };
  
  const handleAutoReplyToggle = (channelId: string, enabled: boolean) => {
    setChannels(prev => prev.map(ch => ch.id === channelId ? {...ch, autoReply: enabled} : ch));
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Channels</CardTitle>
          <CardDescription>
            Manage your connected communication channels.
          </CardDescription>
        </div>
        <div>
          <AddChannelDialog onAddChannel={handleAddChannel} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Assigned Agent</TableHead>
              <TableHead>Auto Reply</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels.map((channel) => {
              const Icon = channelIcons[channel.type];
              return (
                <TableRow key={channel.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                      <span>{channel.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{channel.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        channel.status === 'online' &&
                          'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border-green-300 dark:border-green-800',
                        channel.status === 'offline' &&
                          'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-400 border-gray-300 dark:border-gray-700',
                        channel.status === 'error' &&
                          'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 border-red-300 dark:border-red-800'
                      )}
                    >
                      <span
                        className={cn(
                          'mr-1.5 h-2 w-2 rounded-full',
                          channel.status === 'online' && 'bg-green-600',
                          channel.status === 'offline' && 'bg-gray-500',
                          channel.status === 'error' && 'bg-red-600'
                        )}
                      />
                      {channel.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{channel.lastActivity}</TableCell>
                  <TableCell>
                    <Select
                      value={channel.agentId || 'none'}
                      onValueChange={(agentId) => handleAgentChange(channel.id, agentId)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select an agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {aiAgents.map(agent => (
                            <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Switch
                        checked={channel.autoReply}
                        onCheckedChange={(enabled) => handleAutoReplyToggle(channel.id, enabled)}
                        aria-label="Toggle auto-reply"
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Refresh</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
