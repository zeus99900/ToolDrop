import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Log in to your ToolDrop account to rent tools or manage your listings.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
