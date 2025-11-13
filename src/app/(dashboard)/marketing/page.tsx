'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FacebookLogo } from '@/components/icons/facebook-logo';
import { WhatsAppLogo } from '@/components/icons/whatsapp-logo';
import { WeChatLogo } from '@/components/icons/wechat-logo';
import { TelegramLogo } from '@/components/icons/telegram-logo';
import { MessagesSquare } from 'lucide-react';
import React from 'react';

const TikTokLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16.5 6.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"/>
        <path d="M12 11v8.5"/>
        <path d="M12 2v4.5"/>
        <path d="m15.5 4.5-3 3-3-3"/>
    </svg>
);


const MicrosoftLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.5 3H3v8.5h8.5V3zm-1 1h-6.5v6.5h6.5v-6.5zM21 3h-8.5v8.5H21V3zm-1 1h-6.5v6.5h6.5v-6.5zM11.5 12.5H3V21h8.5v-8.5zm-1 1h-6.5v6.5h6.5v-6.5zM21 12.5h-8.5V21H21v-8.5zm-1 1h-6.5v6.5h6.5v-6.5z"/>
    </svg>
);


const marketingIntegrations = [
  {
    title: 'Facebook Ads',
    description: 'Manage and track your Facebook and Instagram ad campaigns.',
    icon: FacebookLogo,
  },
  {
    title: 'Microsoft Ads',
    description: 'Connect your Microsoft Advertising account to import campaign data.',
    icon: MicrosoftLogo,
  },
  {
    title: 'TikTok Ads',
    description: 'Integrate with TikTok Ads Manager for campaign insights.',
    icon: TikTokLogo,
  },
  {
    title: 'WhatsApp Broadcast',
    description: 'Send bulk messages and campaigns to your WhatsApp contacts.',
    icon: WhatsAppLogo,
  },
  {
    title: 'WeChat Moments',
    description: 'Publish promotional content to your official account\'s Moments.',
    icon: WeChatLogo,
  },
  {
    title: 'Telegram Publisher',
    description: 'Post updates and announcements to your groups and channels.',
    icon: TelegramLogo,
  },
  {
    title: 'Forum Publisher',
    description: 'Automate posting to various online forums and communities.',
    icon: MessagesSquare,
  },
];

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Marketing Platform</h1>
        <p className="text-muted-foreground">
          Integrate and manage your marketing campaigns across all channels.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {marketingIntegrations.map((integration) => {
            const Icon = integration.icon;
            return (
                <Card key={integration.title}>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                            <Icon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <CardTitle>{integration.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {integration.description}
                        </p>
                    </CardContent>
                    <CardContent>
                        <Button variant="outline" className="w-full">
                        Configure
                        </Button>
                    </CardContent>
                </Card>
            );
        })}
      </div>
    </div>
  );
}
