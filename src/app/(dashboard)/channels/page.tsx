'use client';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
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
import { getChannels, getAIAgents, updateChannel } from '@/lib/api';
import type { Channel, AIAgent } from '@/lib/types';
import { cn } from '@/lib/utils';
import { WhatsAppLogo } from '@/components/icons/whatsapp-logo';
import { TelegramLogo } from '@/components/icons/telegram-logo';
import { FacebookLogo } from '@/components/icons/facebook-logo';
import { WeChatLogo } from '@/components/icons/wechat-logo';
import { MiChatLogo } from '@/components/icons/michat-logo';
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
import { useToast } from '@/hooks/use-toast';

const channelIcons: Record<string, React.ElementType> = {
  WhatsApp: WhatsAppLogo,
  Telegram: TelegramLogo,
  Facebook: FacebookLogo,
  Widget: MessageSquare,
  WeChat: WeChatLogo,
  MiChat: MiChatLogo,
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
      status: 'offline',
      lastActivity: '从未',
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
          添加渠道
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>添加新渠道</DialogTitle>
            <DialogDescription>
              将新的沟通渠道连接到您的工作区。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                名称
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="我的新渠道"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                类型
              </Label>
              <Select onValueChange={(value) => setType(value as Channel['type'])} value={type}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择渠道类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Telegram">Telegram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="WeChat">微信</SelectItem>
                  <SelectItem value="MiChat">MiChat</SelectItem>
                  <SelectItem value="Widget">网站小部件</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">添加渠道</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [aiAgents, setAIAgents] = useState<AIAgent[]>([]);
  const { toast } = useToast();
  const [connecting, setConnecting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      const [channelsData, agentsData] = await Promise.all([getChannels(), getAIAgents()]);
      setChannels(channelsData);
      setAIAgents(agentsData);
    };
    fetchData();
  }, []);

  const handleAddChannel = (newChannel: Channel) => {
    setChannels((prev) => [...prev, newChannel]);
  };

  const handleAgentChange = async (channelId: string, agentId: string) => {
    const newAgentId = agentId === 'none' ? undefined : agentId;
    setChannels(prev => prev.map(ch => ch.id === channelId ? {...ch, agentId: newAgentId} : ch));
    await updateChannel(channelId, { agentId: newAgentId });
    toast({ description: "渠道代理已更新。" });
  };
  
  const handleAutoReplyToggle = async (channelId: string, enabled: boolean) => {
    setChannels(prev => prev.map(ch => ch.id === channelId ? {...ch, autoReply: enabled} : ch));
    await updateChannel(channelId, { autoReply: enabled });
    toast({ description: `自动回复已${enabled ? '启用' : '禁用'}。` });
  }

  const handleConnect = async (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    if (!channel) return;
    
    setConnecting(prev => ({ ...prev, [channelId]: true }));
    toast({ description: `正在连接到 ${channel.type}...` });

    const endpoint = channel.type === 'WhatsApp' ? '/api/whatsapp/connect' : '/api/wechat/connect';

    try {
      const response = await fetch(endpoint, { method: 'POST' });
      if (response.ok) {
        setChannels(prev => prev.map(ch => ch.id === channelId ? {...ch, status: 'online', lastActivity: '刚刚'} : ch));
        toast({ description: `${channel.type} 已连接。` });
      } else {
        throw new Error('连接失败');
      }
    } catch (error) {
      console.error(`连接 ${channel.type} 失败:`, error);
      toast({
        title: '错误',
        description: `${channel.type} 连接失败。`,
        variant: 'destructive',
      });
      setChannels(prev => prev.map(ch => ch.id === channelId ? {...ch, status: 'error'} : ch));
    } finally {
      setConnecting(prev => ({ ...prev, [channelId]: false }));
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>渠道</CardTitle>
          <CardDescription>
            管理您连接的沟通渠道。
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
              <TableHead>渠道</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>最后活动</TableHead>
              <TableHead>分配的代理</TableHead>
              <TableHead>自动回复</TableHead>
              <TableHead>
                <span className="sr-only">操作</span>
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
                        <SelectValue placeholder="选择一个代理" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">无</SelectItem>
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
                        aria-label="切换自动回复"
                    />
                  </TableCell>
                  <TableCell>
                  { (channel.type === 'WhatsApp' || channel.type === 'WeChat') && channel.status === 'offline' && (
                    <Button
                      size="sm"
                      onClick={() => handleConnect(channel.id)}
                      disabled={connecting[channel.id]}
                    >
                      {connecting[channel.id] ? '连接中...' : '连接'}
                    </Button>
                  )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">切换菜单</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>操作</DropdownMenuLabel>
                        <DropdownMenuItem>编辑</DropdownMenuItem>
                        <DropdownMenuItem>刷新</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          删除
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