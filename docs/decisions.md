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

## 2025-02-19: Replace arktype with Zod

### Context

Despite arktype's great DX, I found AI agents consistently struggle with it,
even with explicit cursor rules. They work much better with Zod.

### Decision

Switch to Zod for all validation (forms, APIs, env vars, config) to work better
with AI.
