# Architectural Decision Records

## 2025-02-18: Remove i18n from Base Boilerplate

### Context

I found that most of my projects don't need i18n initially, and the translation
keys were making the codebase harder to work with, especially with AI agents.

### Decision

Remove i18n. Projects that need it can follow my integration guide at
eugeneistrach.com/blog/paraglide-tanstack-start.

### Future Plans

May add i18n setup via CLI later.

## 2025-02-18: Replace arktype with Zod

### Context

Despite arktype's great DX, I found AI agents consistently struggle with it,
even with explicit cursor rules. They work much better with Zod.

### Decision

Switch to Zod for all validation (forms, APIs, env vars, config) to work better
with AI.

## 2025-02-18: Switch from pnpm to Bun

### Context

While pnpm is great, Bun offers significant performance improvements and a more
streamlined developer experience with its all-in-one toolkit approach.

### Decision

Switch to Bun as the primary package manager and runtime. Benefits include:

- Faster installation and builds
- Native TypeScript/JSX support without extra tooling
- Built-in test runner and bundler
- Simpler monorepo setup

### Future Plans

Evaluate migrating more tools to Bun's native alternatives:

- Replace Vitest with Bun's test runner
- Consider Bun's bundler for build optimization
- Monitor ecosystem compatibility and stability

## 2025-02-19: Switch from ESLint/Prettier to Biome

### Context

ESLint's performance was becoming an issue in development, especially with the
growing codebase. While ESLint provided comprehensive safety checks, the slow
performance was impacting developer experience.

### Decision

Move to Biome for linting and formatting, keeping Prettier only for non-Biome
supported files (HTML, MD, YAML). Benefits include:

- Significantly faster performance
- Single tool for both linting and formatting
- Better IDE integration
- Simpler configuration

### Future Plans

Monitor for any safety issues that ESLint previously caught. May reconsider
decision if critical safety checks are missed frequently.
