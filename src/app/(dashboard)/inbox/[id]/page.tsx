import ChatDisplay from '@/components/dashboard/chat-display';
import conversations from '@/lib/conversations.json';
import { notFound } from 'next/navigation';
import { Conversation } from '@/lib/types';

export default function ConversationPage({ params }: { params: { id: string } }) {
  const conversation = (conversations as Conversation[]).find((c) => c.id === params.id);

  if (!conversation) {
    notFound();
  }

  return <ChatDisplay conversation={conversation} />;
}

export function generateStaticParams() {
  return conversations.map((conv) => ({
    id: conv.id,
  }));
}
