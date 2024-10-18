namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    SITE_TITLE?: string;
    SITE_DESCRIPTION?: string;
    PORT?: string | number;
  }
}
