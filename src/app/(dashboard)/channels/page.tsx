import { MoreHorizontal, PlusCircle } from 'lucide-react';
import React from 'react';

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
import { channels } from '@/lib/data';
import { cn } from '@/lib/utils';

import { WhatsAppLogo } from '@/components/icons/whatsapp-logo';
import { TelegramLogo } from '@/components/icons/telegram-logo';
import { FacebookLogo } from '@/components/icons/facebook-logo';
import { MessageSquare } from 'lucide-react';

const channelIcons: Record<string, React.ElementType> = {
  WhatsApp: WhatsAppLogo,
  Telegram: TelegramLogo,
  Facebook: FacebookLogo,
  Widget: MessageSquare,
};

export default function ChannelsPage() {
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
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            Add Channel
          </Button>
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
                      <Icon className="h-5 w-5 text-muted-foreground" />
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
