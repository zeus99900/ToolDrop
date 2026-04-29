import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserNotifications } from '@/lib/data';
import NotificationsClient from '@/components/notifications/NotificationsClient';

export default async function NotificationsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/notifications');
  }

  const notifications = await getUserNotifications(session.user.id);

  return <NotificationsClient initialNotifications={notifications} />;
}
