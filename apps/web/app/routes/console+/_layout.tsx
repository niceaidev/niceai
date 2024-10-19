import { Outlet } from '@remix-run/react';
import { Avatar } from 'antd';

export const ROUTE_PATH = '/console' as const;

export default function AuthLayout() {
  return (
    <div>
      当前用户：<Avatar className="bg-blue-500">N</Avatar>
      <Outlet />
    </div>
  );
}
