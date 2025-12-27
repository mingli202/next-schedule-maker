# Repository Guidelines

## Project Structure & Module Organization
This Next.js App Router codebase keeps routes in `src/app`, shared UI in `src/components`, and async helpers in `src/workers`. Clerk/Firebase wiring belongs in `src/hooks` or `src/integrations`. Convex serverless functions plus generated types live under `convex/`; bindings are automatically regenerated from another process running `bunx convex dev` whenever you edit backend tables. Static assets belong in `public/`, and root-level configs (`tsconfig.json`, `eslint.config.mjs`, Tailwind/PostCSS files) drive the toolchain.

## Build, Test, and Development Commands
Install dependencies with bun install. Use `bun --bun run dev` to start the Next.js dev server with Clerk auth and Convex hot reload. `bun --bun run build` emits the production bundle, while `bun --bun run start` serves that optimized output. Finish every iteration with `bun run lint`, which runs ESLint and TypeScript checks from `eslint.config.mjs`.

## Coding Style & Naming Conventions
Use TypeScript everywhere and prefer async/await. Components, hooks, and Zustand stores use PascalCase filenames (`ScheduleGrid.tsx`, `useScheduleStore.ts`); helper modules stay camelCase (`buildSchedule.ts`). Keep functions pure and colocate styling via Tailwind utilities, letting the Prettier Tailwind plugin order class tokens. Shared types belong in `src/types` or the central `src/types.ts`, and avoid committing debug `console.*` calls.

## Testing Guidelines
Automated tests are not yet wired up, but new work should include coverage alongside features. Place unit tests next to the code as `*.test.ts(x)` files or under a local `__tests__` folder so a future Vitest/Jest runner can discover them. Mock Convex and Clerk boundaries—for example, isolate `src/backend/sections` by stubbing network calls. Manual verification is still required: exercise schedule generation, Excel export, and sharing flows before opening a PR, and note gaps when automation is impractical.

## Commit & Pull Request Guidelines
Recent history favors short, imperative subjects (`convex + clerk`, `removed user route entirely`). Match that tone, keep subjects under ~50 characters, and add body context if the change is non-trivial. Every PR needs a summary, testing notes (commands + scenarios), linked issues, and screenshots or GIFs for UI adjustments. Ensure `bun --bun run build` and `bun run lint` pass and request reviewers who own the affected module.

## Environment & Security Notes
Secrets live in `.env.local`; never commit Clerk, Firebase, or Convex keys. Prefer environment-specific overrides via Docker Compose when collaborating, and target isolated Convex datasets so student schedule data never leaks into shared deployments.
