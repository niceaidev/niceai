export type Environment = {
  NODE_ENV: 'development' | 'production';
  API_PORT: string;
  MONGO_URL: string;
  DATABASE_URL: string;
};

export const getEnv = <K extends keyof Environment>(
  key: K,
  fallback?: Environment[K],
): Environment[K] => {
  const value = process.env[key] as Environment[K] | undefined;

  if (!value) {
    if (fallback) {
      return fallback;
    }
    throw new Error(`Missing environment variable: ${key}.`);
  }

  return value;
};

export type AppConfig = {
  env: {
    type: 'production' | 'development';
  };
  api: {
    port: number;
  };
  db: {
    uri: string;
  };
  mongo: {
    uri: string;
    dbName: string;
    auth?: {
      username: string;
      password: string;
    };
  };
};

const loadConfig = (): AppConfig => {
  const mongoUrl = new URL(getEnv('MONGO_URL', 'mongodb://localhost:27017'));
  return {
    env: {
      type: getEnv('NODE_ENV', 'development'),
    },
    api: {
      port: Number(getEnv('API_PORT', '3001')),
    },
    db: {
      uri: getEnv('DATABASE_URL'),
    },
    mongo: {
      uri: `${mongoUrl.protocol}//${mongoUrl.host}`,
      auth: {
        username: mongoUrl.username,
        password: mongoUrl.password,
      },
      dbName: mongoUrl.pathname.slice(1),
    },
  };
};

export default loadConfig;
