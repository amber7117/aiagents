import ConversationList from "@/components/dashboard/conversation-list";

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[380px_1fr]">
      <div className="hidden border-r bg-card lg:block">
        <ConversationList />
      </div>
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}
