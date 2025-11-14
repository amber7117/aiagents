'use client';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode.react';

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
import { getChannels, getAIAgents, updateChannel, addChannel } from '@/lib/api';
import type { Channel, AIAgent, ChannelType } from '@/lib/types';
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

const channelIcons: Record<ChannelType, React.ElementType> = {
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
  const [type, setType] = useState<ChannelType | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type) return;

    const newChannel = await addChannel({ name, type });
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

function WhatsAppQRDialog({ qr, open, onOpenChange }: { qr: string | null; open: boolean; onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Scan WhatsApp QR Code</DialogTitle>
                    <DialogDescription>
                        Open WhatsApp on your phone and scan the code to connect.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center p-4">
                    {qr ? <QRCode value={qr} size={256} /> : <p>Generating QR code...</p>}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [aiAgents, setAIAgents] = useState<AIAgent[]>([]);
  const { toast } = useToast();
  const [connecting, setConnecting] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [channelsData, agentsData] = await Promise.all([getChannels(), getAIAgents()]);
      setChannels(channelsData);
      setAIAgents(agentsData);
    };
    fetchData();
  }, []);

  const handleConnect = async (channelId: string, type: Channel['type']) => {
    setConnecting(prev => ({ ...prev, [channelId]: true }));
    toast({ description: `正在连接到 ${type}...` });

    if (type === 'WhatsApp') {
        setIsQrDialogOpen(true);
        setQrCode(null);
        try {
            const response = await fetch('/api/whatsapp/qr');
            const data = await response.json();
            if (response.ok) {
                setQrCode(data.qr);
                // The connection status will be updated via a separate mechanism later (e.g. webhook or polling)
                // For now, we simulate a successful connection after a delay
                setTimeout(async () => {
                    const updatedChannel = await updateChannel(channelId, { status: 'online', lastActivity: '刚刚' });
                    setChannels(prev => prev.map(ch => ch.id === channelId ? updatedChannel : ch));
                    toast({ description: `${type} 已连接。` });
                    setIsQrDialogOpen(false);
                }, 20000); // Assume user scans within 20 seconds
            } else {
                throw new Error(data.message || '获取二维码失败');
            }
        } catch (error) {
            console.error('获取 WhatsApp 二维码失败:', error);
            toast({ title: '错误', description: `获取二维码失败。`, variant: 'destructive' });
            setIsQrDialogOpen(false);
        }

    } else if (type === 'WeChat') {
        try {
          const response = await fetch('/api/wechat/connect', { method: 'POST' });
          if (response.ok) {
            const updatedChannel = await updateChannel(channelId, { status: 'online', lastActivity: '刚刚' });
            setChannels(prev => prev.map(ch => ch.id === channelId ? updatedChannel : ch));
            toast({ description: `${type} 已连接。` });
          } else {
            throw new Error('连接失败');
          }
        } catch (error) {
          console.error(`连接 ${type} 失败:`, error);
          await updateChannel(channelId, { status: 'error' });
          setChannels(prev => prev.map(ch => ch.id === channelId ? {...ch, status: 'error'} : ch));
          toast({ title: '错误', description: `${type} 连接失败。`, variant: 'destructive' });
        }
    }
    
    setConnecting(prev => ({ ...prev, [channelId]: false }));
  };

  const handleAddChannel = (newChannel: Channel) => {
    setChannels((prev) => [...prev, newChannel]);
    if (newChannel.type === 'WhatsApp' || newChannel.type === 'WeChat') {
      handleConnect(newChannel.id, newChannel.type);
    }
  };

  const handleAgentChange = async (channelId: string, agentId: string) => {
    const newAgentId = agentId === 'none' ? undefined : agentId;
    await updateChannel(channelId, { agentId: newAgentId });
    setChannels(prev => prev.map(ch => ch.id === channelId ? {...ch, agentId: newAgentId} : ch));
    toast({ description: "渠道代理已更新。" });
  };
  
  const handleAutoReplyToggle = async (channelId: string, enabled: boolean) => {
    await updateChannel(channelId, { autoReply: enabled });
    setChannels(prev => prev.map(ch => ch.id === channelId ? {...ch, autoReply: enabled} : ch));
    toast({ description: `自动回复已${enabled ? '启用' : '禁用'}。` });
  }
  
  return (
    <>
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
                    { (channel.type === 'WhatsApp' || channel.type === 'WeChat') && channel.status !== 'online' && (
                      <Button
                        size="sm"
                        onClick={() => handleConnect(channel.id, channel.type)}
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
                          <DropdownMenuItem onClick={() => router.push(`/channels/${channel.id}`)}>编辑</DropdownMenuItem>
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
      <WhatsAppQRDialog qr={qrCode} open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen} />
    </>
  );
}
