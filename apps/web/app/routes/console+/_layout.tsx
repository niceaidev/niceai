import { Outlet } from '@remix-run/react';

export const ROUTE_PATH = '/console' as const;

export default function AuthLayout() {
  return <Outlet />;
}
