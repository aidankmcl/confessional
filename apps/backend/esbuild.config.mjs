import { build } from 'esbuild';

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/index.js',
  format: 'cjs',
  sourcemap: true,
  minify: true,
  treeShaking: true,
  packages: 'bundle',
  logLevel: 'info',
}).catch(() => process.exit(1));
