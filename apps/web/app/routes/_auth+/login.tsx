import type { MetaFunction } from '@vercel/remix';
import { Button, Space } from 'antd';
import { siteConfig } from '~/const/site';
import { GithubFilled } from '@ant-design/icons';

export const meta: MetaFunction = () => [
  { title: `${siteConfig.title} - Login` },
  { name: 'description', content: siteConfig.description },
];

export default function Login() {
  return (
    <Space>
      <Button icon={<GithubFilled />}>使用GitHub登录</Button>
    </Space>
  );
}
