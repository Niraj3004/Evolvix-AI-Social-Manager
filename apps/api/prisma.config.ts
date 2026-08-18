import { defineConfig } from '@prisma/config';
import { env } from '../src/config/env.config';

export default defineConfig({
  earlyAccess: true,
  migrations: {
    url: process.env.DATABASE_URL,
  },
});
