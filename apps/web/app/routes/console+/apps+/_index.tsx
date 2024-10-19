import type { MetaFunction } from '@vercel/remix';
import { Button } from 'antd';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Login() {
  return (
    <div>
      <h1>Console</h1>
      <Button>Login</Button>
    </div>
  );
}
