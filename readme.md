# et-stack

```bash
bun create et-app
```

An opinionated boilerplate project to jumpstart new React applications with
modern tooling and best practices.

## Features

- 🤖 Cursor-ready with predefined `.cursor/rules` for AI-assisted development
- 🔒 Type-safe full-stack development with [TanStack](https://tanstack.com)
- 🔑 Modern authentication with [better-auth](https://better-auth.com)
- 💾 Database integration with [Drizzle ORM](https://orm.drizzle.team)
- 🎨 Beautiful UI with [shadcn/ui](https://ui.shadcn.com)
- 🧪 Comprehensive testing setup
- Built-in management UI via `bun run db:studio`

## Tech Stack

- **Tech Stack**

  - [Bun](https://bun.sh) - All-in-one JavaScript runtime & package manager
  - [React 19](https://react.dev)
  - [TanStack](https://tanstack.com) ([Router](https://tanstack.com/router),
    [Query](https://tanstack.com/query), [Start](https://tanstack.com/start))
  - [TailwindCSS](https://tailwindcss.com) with
    [shadcn/ui](https://ui.shadcn.com)
  - [Better-auth](https://better-auth.com) with [GitHub](https://github.com)
  - [Zod](https://zod.dev) for schema validation

- **Backend & Data**

  - [SQLite](https://sqlite.org) (local) / [Turso](https://turso.tech)
    (production) with [Drizzle ORM](https://orm.drizzle.team)

  - [trigger.dev](https://trigger.dev) for background jobs (optional,
    self-hosted or cloud)
  - [Fly.io](https://fly.io) for deployment and hosting

- **Testing & Quality**

  - [vitest](https://vitest.dev) for testing
  - [ESLint](https://eslint.org) + [Prettier](https://prettier.io)
  - [Playwright](https://playwright.dev) for E2E testing

## Prerequisites

- [Bun](https://bun.sh) >= 1.0.0

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun dev
```

## Key Commands

```bash
# Development
bun dev           # Start development server
bun run build         # Build for production
bun start         # Start production server

# Database
bun run db:migrate    # Run database migrations
bun run db:studio     # Open database UI
bun run db:reset      # Reset database (clear + migrate + seed)

# Background Jobs
bunx trigger.dev@latest dev   # Start Trigger.dev development server

# Testing
bun test          # Run tests
bun run typecheck     # Run typecheck
bun run lint          # Run lint
bun run verify        # Run all checks (lint, typecheck, test)
```

## Documentation

- [Check our cursor rules](.cursor/rules)

## License

[License](license.md)
