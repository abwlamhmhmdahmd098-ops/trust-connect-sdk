# Scripts

Utility scripts for the TrustConnect SDK monorepo.

## Bundle Size Analyzer

Analyzes the bundle size of all packages with minification and tree-shaking.

NOTE: This script is for internal use to track the state of each package, we do not consider peerDeps or direct deps (WalletConnect)
as part of the equation.

### Usage

```bash
# Run from root
pnpm bundle:analyze
```

### What it does

- Builds all packages with TypeScript
- Bundles each package with esbuild (minified + tree-shaken)
- Excludes external dependencies (react, viem, @tanstack/react-query, @walletconnect/*)
- Reports both minified and estimated gzipped sizes

### Output

```
📦 Package Name          Size (KB)  Gzipped (est.)
────────────────────────────────────────────────
📦 core                   8.38 KB    2.51 KB
📦 eip155                 8.12 KB    2.44 KB
📦 eip155/react           2.07 KB    0.62 KB
📦 walletconnect          6.59 KB    1.98 KB
📦 headless               5.00 KB    1.50 KB
```

### Modifying

Edit `scripts/analyze-bundle.mjs` to:
- Add/remove packages to analyze
- Change external dependencies
- Adjust minification settings
