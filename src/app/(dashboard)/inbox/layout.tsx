import ConversationList from "@/components/dashboard/conversation-list";

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[380px_1fr]">
      <div className="border-r bg-card">
        <ConversationList />
      </div>
      <div className="hidden flex-col lg:flex">
        {children}
      </div>
    </div>
  );
}
