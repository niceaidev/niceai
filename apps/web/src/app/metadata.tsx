import type { Metadata } from 'next';

import { env } from '~/env';

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === 'production'
      ? 'https://niceai.io'
      : 'http://localhost:3000',
  ),
  title: 'Nice AI',
  description: 'Nice AI App',
};
