import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db.ts',
  out: './migrations',
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath: './wrangler.toml',
    dbName: 'mahjong-db',
  },
} satisfies Config;