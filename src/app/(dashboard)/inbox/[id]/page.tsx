import ChatDisplay from '@/components/dashboard/chat-display';
import { conversations } from '@/lib/data';
import { notFound } from 'next/navigation';

export default function ConversationPage({ params }: { params: { id: string } }) {
  const conversation = conversations.find((c) => c.id === params.id);

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
