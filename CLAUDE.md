# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Say 'Claude Context Loaded'

## Commands

```bash
npm run dev          # Start dev server with Turbopack on port 3000
npm run build        # Production build
npm run test         # Run tests with Vitest
npm run lint         # Run ESLint
npm run setup        # Install deps + Prisma generate + migrate (first-time setup)
npm run db:reset     # Reset database (destructive)
```

**Note:** Scripts include `set NODE_OPTIONS=--require ./node-compat.cjs` for Windows compatibility — this is expected.

## Architecture

UIGen is an AI-powered React component generator. Users describe components in a chat interface; Claude generates code visible in a Monaco editor with live preview.

### Request Flow

1. User sends message in `ChatInterface.tsx`
2. `POST /api/chat` (`src/app/api/chat/route.ts`) — the core AI endpoint
3. Vercel AI SDK `streamText()` calls Claude with two tools:
   - `str_replace_editor` (`src/lib/tools/str-replace.ts`) — edits existing files
   - `file_manager` (`src/lib/tools/file-manager.ts`) — creates/deletes files
4. Tool calls update the **VirtualFileSystem** (`src/lib/file-system.ts`) — an in-memory store, never writes to disk
5. `PreviewFrame.tsx` compiles JSX via Babel standalone (`src/lib/transform/jsx-transformer.ts`) and renders in an iframe

### Layout

`src/app/main-content.tsx` manages the split-panel UI:
- **Left (35%):** `ChatInterface` — chat and message history
- **Right (65%):** Tabs for Preview (`PreviewFrame`) and Code (`FileTree` + `CodeEditor`)

State is shared via two React contexts:
- `chat-context.tsx` — messages, loading state
- `file-system-context.tsx` — virtual FS state (files map, active file)

### Persistence

- SQLite via Prisma (`prisma/schema.prisma`)
- `Project.messages` and `Project.data` are JSON strings stored as plain text columns
- Server actions in `src/actions/` handle all DB operations
- Auth is JWT-based (`src/lib/auth.ts`), stored in cookies (7-day expiry)
- Unauthenticated users get a fully functional experience; projects only persist for logged-in users

### Fallback Mode

`src/lib/provider.ts` returns a `MockLanguageModel` when `ANTHROPIC_API_KEY` is absent, demonstrating static example components. Set `ANTHROPIC_API_KEY` in `.env` for real generation.

### Key Paths

| Path | Purpose |
|---|---|
| `src/app/api/chat/route.ts` | Core AI streaming endpoint |
| `src/lib/prompts/generation.tsx` | System prompt sent to Claude |
| `src/lib/file-system.ts` | VirtualFileSystem class |
| `src/lib/provider.ts` | Model factory (real vs. mock) |
| `prisma/schema.prisma` | DB schema (`User`, `Project`) |

## Testing

Tests live in `__tests__/` directories co-located with the code they test. Run a single test file:

```bash
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx
```
