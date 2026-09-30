// Builds the website as a static export in apps/web/out, ready for `firebase deploy`.
import { spawnSync } from 'node:child_process';

const result = spawnSync('pnpm', ['--filter', 'web', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    STATIC_EXPORT: '1',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mazaq-coffee.web.app',
  },
});
process.exit(result.status ?? 1);
