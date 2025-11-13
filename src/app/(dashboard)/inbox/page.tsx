import { Inbox } from 'lucide-react';

export default function InboxPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-background">
      <div className="text-center">
        <Inbox className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-semibold">Select a conversation</h2>
        <p className="mt-2 text-muted-foreground">
          Choose a conversation from the list on the left to start chatting.
        </p>
      </div>
    </div>
  );
}
