import { Outlet } from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function AuthLayout() {
  return <Outlet />;
}
