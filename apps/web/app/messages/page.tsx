import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserConversations } from '@/lib/data';
import MessagesClient from '@/components/messages/MessagesClient';

export default async function MessagesPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/messages');
  }

  const conversations = await getUserConversations(session.user.id);

  return <MessagesClient conversations={conversations} currentUserId={session.user.id} />;
}
