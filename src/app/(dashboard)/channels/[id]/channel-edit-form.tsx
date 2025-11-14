'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateChannel } from '@/lib/api';
import type { Channel } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// 此组件处理编辑渠道的客户端逻辑。
export default function ChannelEditForm({ channel: initialChannel }: { channel: Channel }) {
  const [channel] = useState<Channel>(initialChannel);
  const [name, setName] = useState(initialChannel.name);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // 根据渠道类型设置模拟凭据以供演示
    if (channel.type === 'WhatsApp') setPhoneNumber('123-456-7890');
    if (channel.type === 'Telegram') setApiKey('TG-abcdef123456');
  }, [channel.type]);

  const handleSave = async () => {
    try {
      await updateChannel(channel.id, { name });
      toast({
        title: '渠道已更新',
        description: `成功更新 "${name}"。`,
      });
      router.push('/channels');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '错误',
        description: '更新渠道失败。',
      });
    }
  };

  const renderCredentials = () => {
    switch (channel.type) {
      case 'WhatsApp':
        return (
          <div className="space-y-2">
            <Label htmlFor="phone">电话号码</Label>
            <Input id="phone" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="例如, 15551234567" />
          </div>
        )
      case 'Telegram':
      case 'Facebook':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="api-key">API 密钥</Label>
              <Input id="api-key" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="输入 API 密钥" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-secret">API 秘密</Label>
              <Input id="api-secret" type="password" value={apiSecret} onChange={e => setApiSecret(e.target.value)} placeholder="输入 API 秘密" />
            </div>
          </>
        )
      default:
        return <p className="text-sm text-muted-foreground">此渠道类型不需要特殊凭据。</p>;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild>
          <Link href="/channels" className="mb-4 inline-flex items-center gap-2 text-sm">
            <ChevronLeft className="h-4 w-4" />
            返回渠道列表
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">编辑渠道</h1>
        <p className="text-muted-foreground">管理 {channel.name} 的设置。</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>通用设置</CardTitle>
          <CardDescription>更新此渠道的基本信息。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">渠道名称</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>渠道类型</Label>
            <Input value={channel.type} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>连接详情</CardTitle>
          <CardDescription>
            配置连接到 {channel.type} 所需的凭据。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderCredentials()}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.push('/channels')}>取消</Button>
        <Button onClick={handleSave}>保存更改</Button>
      </div>
    </div>
  );
}
