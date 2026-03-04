# Publishing Guide

### 1. Create a Changeset

When you make changes to packages, create a changeset to describe what changed:

```bash
pnpm changeset
```

This will prompt you with:

1. **Which packages changed?** - Select packages with Space, confirm with Enter
2. **What type of bump?** - Choose:
   - `patch` - Bug fixes (0.0.0 → 0.0.1)
   - `minor` - New features (0.0.0 → 0.1.0)
   - `major` - Breaking changes (0.0.0 → 1.0.0)
3. **Summary** - Describe the changes

This creates a markdown file in `.changeset/` with your change information.

**Note:** You can create multiple changesets before releasing. They will all be combined when you version.

### 2. Version Packages

When you're ready to release, update package versions:

```bash
pnpm version
```

This command will:
- Read all pending changesets
- Update `package.json` versions for changed packages
- Update dependencies between packages
- Generate/update CHANGELOG.md files
- Delete processed changeset files

### 3. Commit Version Changes

Commit the version bump and changelogs:

```bash
git add .
git commit -m "chore: version packages"
git push
```

### 4. Publish to npm

Build and publish all updated packages:

```bash
pnpm release
```

This command will:
1. Build all packages (`pnpm build`)
2. Publish changed packages to npm (`changeset publish`)

The packages will be published with public access to npm.

## Example Workflow

Here's a complete example of releasing a bug fix:

```bash
# 1. Make your changes to code
# ... edit files ...

# 2. Run tests
pnpm test

# 3. Create changeset
pnpm changeset
# → Select packages: core, eip155
# → Select bump: patch
# → Summary: "fix: resolve connection timeout issue"

# 4. Commit changeset
git add .
git commit -m "fix: resolve connection timeout issue"
git push

# 5. Version packages
pnpm version

# 6. Review the changes
git diff

# 7. Commit version bump
git add .
git commit -m "chore: version packages"
git push

# 8. Publish
pnpm release
```

## Multiple Changes

You can accumulate multiple changesets before releasing:

```bash
# Make first change
pnpm changeset  # Creates .changeset/random-name-1.md
git add . && git commit -m "feat: add new feature"

# Make second change
pnpm changeset  # Creates .changeset/random-name-2.md
git add . && git commit -m "fix: fix bug"

# Later, release both together
pnpm version    # Processes both changesets
git add . && git commit -m "chore: version packages"
pnpm release
```

## Configuration

Changesets is configured in [.changeset/config.json](.changeset/config.json):

- `access: "public"` - Packages are published as public
- `baseBranch: "main"` - Base branch for version bumps
- `updateInternalDependencies: "patch"` - Workspace dependencies get patch bumps

## Scripts Reference

Available npm scripts for publishing:

- `pnpm changeset` - Create a new changeset
- `pnpm version` - Apply all changesets and bump versions
- `pnpm release` - Build and publish to npm
