
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
import { getChannels, updateChannel } from '@/lib/api';
import type { Channel } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// This component handles the client-side logic for editing a channel.
function ChannelEditForm({ channel: initialChannel }: { channel: Channel }) {
  const [channel, setChannel] = useState<Channel>(initialChannel);
  const [name, setName] = useState(initialChannel.name);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Set mock credentials based on channel type for demonstration
    if (channel.type === 'WhatsApp') setPhoneNumber('123-456-7890');
    if (channel.type === 'Telegram') setApiKey('TG-abcdef123456');
  }, [channel.type]);

  const handleSave = async () => {
    try {
      await updateChannel(channel.id, { name });
      toast({
        title: 'Channel Updated',
        description: `Successfully updated "${name}".`,
      });
      router.push('/channels');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update channel.',
      });
    }
  };

  const renderCredentials = () => {
    switch (channel.type) {
      case 'WhatsApp':
        return (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="e.g., 15551234567" />
          </div>
        )
      case 'Telegram':
      case 'Facebook':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Enter API Key" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-secret">API Secret</Label>
              <Input id="api-secret" type="password" value={apiSecret} onChange={e => setApiSecret(e.target.value)} placeholder="Enter API Secret" />
            </div>
          </>
        )
      default:
        return <p className="text-sm text-muted-foreground">This channel type does not require special credentials.</p>;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild>
          <Link href="/channels" className="mb-4 inline-flex items-center gap-2 text-sm">
            <ChevronLeft className="h-4 w-4" />
            Back to Channels
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Channel</h1>
        <p className="text-muted-foreground">Manage settings for {channel.name}.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Update the basic information for this channel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Channel Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Channel Type</Label>
            <Input value={channel.type} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connection Details</CardTitle>
          <CardDescription>
            Configure the credentials required to connect to {channel.type}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderCredentials()}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.push('/channels')}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}

// Wrapper component to handle data fetching on the server.
// We must keep this separate from the client component to use generateStaticParams.
async function ChannelEditPageLoader({ params }: { params: { id: string } }) {
  const channels = await getChannels();
  const currentChannel = channels.find((c) => c.id === params.id);

  if (!currentChannel) {
    // This part requires 'next/navigation' which can be tricky in this setup.
    // A simple message is a safe fallback.
    return <div>Channel not found.</div>;
  }

  return <ChannelEditForm channel={currentChannel} />;
}

// The default export must handle server-side logic
export default ChannelEditPageLoader;

// generateStaticParams must be exported from the page file.
export async function generateStaticParams() {
  const channels = await getChannels();
  return channels.map((channel) => ({
    id: channel.id,
  }));
}
