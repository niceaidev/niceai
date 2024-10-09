import type { MetaFunction } from '@vercel/remix';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from '../components/i18n/switch';
import { useLoaderData } from '@remix-run/react';
import i18next from '../i18n/i18next.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18next.getFixedT(request);

  return json({
    title: t('title'),
  });
}

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  const { title } = useLoaderData<{ title: string }>();
  const { t } = useTranslation('common');

  return (
    <div>
      <h1>Welcome to Remix</h1>
      {title}
      {t('title')}
      <br />
      {t('description')}
      <br />
      <LanguageSwitch />
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
          <Button>Click me</Button>
        </li>
      </ul>
    </div>
  );
}
