import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const packages = [
  { name: 'core', path: 'packages/core/dist/index.js' },
  { name: 'eip155-core', path: 'packages/namespaces/eip155/dist/index.js' },
  { name: 'solana-core', path: 'packages/namespaces/solana/dist/index.js' },
  { name: 'bip122-core', path: 'packages/namespaces/bip122/dist/index.js' },
  { name: 'walletconnect', path: 'packages/services/walletConnect/dist/index.js' },
  { name: 'headless', path: 'packages/react/headless/dist/index.js' },
  { name: 'ui-logic', path: 'packages/react/ui-logic/dist/index.js' },
  { name: 'ui', path: 'packages/react/ui/dist/index.js' },
  { name: 'react-eip155', path: 'packages/react/namespaces/eip155/dist/index.js' },
  { name: 'react-solana', path: 'packages/react/namespaces/solana/dist/index.js' },
  { name: 'react-bip122', path: 'packages/react/namespaces/bip122/dist/index.js' },
];

// Plugin to ignore CSS imports during bundle analysis
const ignoreCssPlugin = {
  name: 'ignore-css',
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, args => ({
      path: args.path,
      namespace: 'ignore-css',
    }));
    build.onLoad({ filter: /.*/, namespace: 'ignore-css' }, () => ({
      contents: '',
      loader: 'js',
    }));
  },
};

async function analyzeBundle(name, entryPoint) {
  try {
    const result = await build({
      entryPoints: [entryPoint],
      bundle: true,
      minify: true,
      write: false,
      format: 'esm',
      external: [
        'react',
        'react-dom',
        '@tanstack/react-query',
        'viem',
        'viem/*',
        '@walletconnect/sign-client',
        '@walletconnect/*',
        '@trustwallet/*',
      ],
      plugins: [ignoreCssPlugin],
      treeShaking: true,
      metafile: true,
      logLevel: 'error',
    });

    const output = result.outputFiles[0];
    const sizeKB = (output.contents.length / 1024).toFixed(2);
    const sizeGzip = (output.contents.length / 1024 * 0.3).toFixed(2);

    console.log(`📦 ${name.padEnd(20)} ${sizeKB.padStart(8)} KB  (${sizeGzip.padStart(6)} KB gzipped)`);

    return {
      size: output.contents.length,
      success: true
    };
  } catch (error) {
    console.log(`❌ ${name.padEnd(20)} Failed: ${error.message}`);
    return {
      size: 0,
      success: false
    };
  }
}

console.log('\n🔍 Bundle Size Analysis (minified + tree-shaken)\n');
console.log('Package              Size (KB)  Gzipped (est.)');
console.log('─'.repeat(60));

let totalSize = 0;
let successCount = 0;

for (const pkg of packages) {
  const result = await analyzeBundle(pkg.name, join(rootDir, pkg.path));
  if (result.success) {
    totalSize += result.size;
    successCount++;
  }
}

console.log('─'.repeat(60));
const totalKB = (totalSize / 1024).toFixed(2);
const totalGzip = (totalSize / 1024 * 0.3).toFixed(2);
console.log(`   ${'Total'.padEnd(20)} ${totalKB.padStart(8)} KB  (${totalGzip.padStart(6)} KB gzipped)`);
console.log('─'.repeat(60));
console.log(`\n✅ Successfully analyzed ${successCount}/${packages.length} packages`);
console.log('Note: Excludes internal react, viem, @tanstack/react-query, @walletconnect/*\n');
