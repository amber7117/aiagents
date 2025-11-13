'use client';

import { MessageSquare, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { conversations } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WhatsAppLogo } from '../icons/whatsapp-logo';
import { TelegramLogo } from '../icons/telegram-logo';
import { FacebookLogo } from '../icons/facebook-logo';
import { WeChatLogo } from '../icons/wechat-logo';
import { MiChatLogo } from '../icons/michat-logo';

const channelIcons: Record<string, React.ElementType> = {
  WhatsApp: WhatsAppLogo,
  Telegram: TelegramLogo,
  Facebook: FacebookLogo,
  WeChat: WeChatLogo,
  Widget: MessageSquare,
  MiChat: MiChatLogo,
};

export default function ConversationList() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-2 p-4">
        <h2 className="text-2xl font-bold tracking-tight">Inbox</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-8" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter conversations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conversations</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="me">Assigned to me</SelectItem>
            <SelectItem value="ai">AI Handled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-4 pt-0">
          {conversations.map((conv) => {
            const Icon = channelIcons[conv.channel];
            return (
            <Link
              key={conv.id}
              href={`/inbox/${conv.id}`}
              className={cn(
                'flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted',
                pathname === `/inbox/${conv.id}` && 'bg-muted'
              )}
            >
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={conv.contact.avatar} alt={conv.contact.name} />
                <AvatarFallback>
                  {conv.contact.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="truncate font-semibold">{conv.contact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conv.lastMessage.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {conv.lastMessage.sender === 'agent' && 'You: '}
                  {conv.lastMessage.content}
                </p>
                <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1 font-normal">
                      <Icon className="h-3 w-3" />
                      {conv.channel}
                    </Badge>
                  </div>
              </div>
              {conv.unreadCount > 0 && (
                <Badge className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {conv.unreadCount}
                </Badge>
              )}
            </Link>
          )})}
        </div>
      </ScrollArea>
    </div>
  );
}
