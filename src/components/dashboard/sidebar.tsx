'use client';

import {
  Bot,
  ChevronDown,
  Cpu,
  Image,
  Inbox,
  LifeBuoy,
  Megaphone,
  MessageSquare,
  PieChart,
  Settings,
  Users,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { NavItem, User } from '@/lib/types';
import { getLoggedInUser } from '@/lib/api';
import React, { useState, useEffect } from 'react';

const navItems: NavItem[] = [
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  { href: '/channels', label: 'Channels', icon: MessageSquare },
  { href: '/agents', label: 'AI Agents', icon: Bot },
  { href: '/analytics', label: 'Analytics', icon: PieChart },
  { href: '/media', label: 'Media', icon: Image },
  { href: '/marketing', label: 'Marketing', icon: Megaphone },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/settings/ai', label: 'AI Setting', icon: Cpu },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getLoggedInUser();
      setLoggedInUser(user);
    };
    fetchUser();
  }, []);

  if (!loggedInUser) {
    return (
      <div className="flex h-full flex-col p-4">
        <div className="h-16 flex items-center border-b px-2">
            <Bot className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 overflow-y-auto py-4">
            <div className="grid items-start gap-1 text-sm font-medium">
                {/* Skeleton for nav items */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground">
                        <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
                        <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                    </div>
                ))}
            </div>
        </div>
        <div className="mt-auto border-t p-4">
            <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                    <div className="text-left">
                        <div className="h-4 w-16 bg-muted rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
  }

  return (
    <aside className="flex h-screen w-full flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/inbox" className="flex items-center gap-2 font-semibold">
          <Bot className="h-6 w-6 text-primary" />
          <span className="">OmniChat</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start gap-1 px-4 py-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                (pathname.startsWith(item.href) && item.href !== '/') || pathname === item.href
                  ? 'bg-muted text-primary'
                  : ''
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-auto w-full items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={loggedInUser.avatar} alt={loggedInUser.name} />
                  <AvatarFallback>
                    {loggedInUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium">{loggedInUser.name}</p>
                  <p className="text-xs text-muted-foreground">{loggedInUser.email}</p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{loggedInUser.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {loggedInUser.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              <span>Team</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
