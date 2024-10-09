import type { CookieOptions } from '@remix-run/server-runtime';

export const cookieOptions: Omit<CookieOptions, 'sameSite'> & {
  sameSite: 'lax' | 'strict' | 'none';
} = {
  maxAge: 60 * 60 * 24 * 30,
  path: '/',
  sameSite: 'lax',
};

export const cookieName = 'lang';
