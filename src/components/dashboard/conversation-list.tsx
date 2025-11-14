'use client';
import {
  ChevronLeft,
  ChevronsLeftRight,
  PlusCircle,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { usePathname } from "next/navigation";
import conversations from "@/lib/conversations.json";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import type { Conversation } from "@/lib/types";

export default function ConversationList() {
  const isMobile = useMobile();
  const pathname = usePathname();
  const isConversationSelected = pathname.includes('/inbox/') && pathname !== '/inbox';
  const conversationList = conversations as Conversation[];

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isMobile && isConversationSelected && (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/inbox">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
            )}
            <h1 className="text-xl font-bold">收件箱</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ChevronsLeftRight className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="搜索..." className="pl-9" />
          </div>
          <Select defaultValue="unread">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unread">未读</SelectItem>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="archived">已存档</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversationList.map((conv) => (
          <Link
            href={`/inbox/${conv.id}`}
            key={conv.id}
            className={cn(
                "block border-b p-4 hover:bg-muted/50",
                pathname === `/inbox/${conv.id}` && "bg-muted"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={conv.customer.avatar}
                  alt={conv.customer.name}
                  className="h-12 w-12 rounded-full"
                />
                <span
                  className={cn(
                    "absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-card",
                    (conv as any).online ? "bg-green-500" : "bg-gray-400"
                  )}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">{conv.customer.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {conv.messages[conv.messages.length - 1].timestamp.split('T')[1].substring(0,5)}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {conv.messages[conv.messages.length - 1].text}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="secondary">{conv.channel.name}</Badge>
                  {/* <Badge variant="destructive">{conv.unreadCount}</Badge> */}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
