# PocketBase Portfolio

Turborepo workspace for a browser and terminal portfolio.

## Apps

- `apps/pocketbase`: PocketBase embedded as a Go application. It serves the Admin UI and exposes `/api/portfolio/health`.
- `apps/tui`: Wish SSH server with a Bubble Tea interface. Connect with `ssh localhost -p 2222`.
- `apps/web`: Next.js and Tailwind site that talks to PocketBase with the JS SDK.

## Packages

- `packages/ui`: shared React components.
- `packages/eslint-config`: shared ESLint config.
- `packages/typescript-config`: shared TypeScript config.

## Development

```sh
pnpm install
pnpm dev
```

Default ports:

- PocketBase: `http://127.0.0.1:8090`
- Web: `http://localhost:3000`
- SSH TUI: `ssh localhost -p 2222`

Useful environment variables:

- `NEXT_PUBLIC_POCKETBASE_URL`: PocketBase URL for the web app.
- `POCKETBASE_URL`: PocketBase URL for the TUI health check.
- `TUI_HOST`, `TUI_PORT`, `TUI_HOST_KEY_PATH`: SSH server settings.

## Build

```sh
pnpm build
```
