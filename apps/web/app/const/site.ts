const defaultConfig = {
  title: 'Nice AI',
  description: 'A free, open-source, and powerful AI knowledge base platform.',
};

export const siteConfig = {
  title: process.env.SITE_TITLE || defaultConfig.title,
  description: process.env.SITE_DESCRIPTION || defaultConfig.description,
  keyword: 'remix, react, framework',
  favicon: '/favicon.ico',
};
