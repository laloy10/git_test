# Home AI Studio

A cross-platform **desktop** recreation of the "Home AI" interior/exterior design
concept: snap or upload a photo of a space, pick a style, and get a tailored
**AI design plan from Claude** — for rooms, gardens, home exteriors, and paint
colours.

Built with **Electron + React + TypeScript + Vite**, following Electron security
best practices (context isolation, a typed preload bridge, no Node in the
renderer).

## How AI is used

Claude (the Anthropic API) is a **vision + text** model — it does not generate or
edit images. So this app uses Claude for what it's genuinely great at: it looks
at your photo and the style you chose and writes a **specific, actionable design
plan** for that exact space — a colour palette, key changes, materials,
furnishings/planting, and a budget tip (the "smart AI decorating suggestions" the
original app advertises). The visual before/after preview is rendered locally.

## Features

- **Four space types** — Interior, Garden, Exterior, and Paint, each with a set
  of curated style presets (24 in total).
- **Guided one-tap flow** — upload a photo → choose a style → generate → compare.
- **AI design plan by Claude** — palette, key changes, materials, furnishings,
  and a budget tip, grounded in your actual photo.
- **Before / after slider** for the local style preview.
- **Local gallery** — save designs; everything is stored on your device.
- **Two generation engines**
  - **Demo (offline)** — restyles the photo locally with colour grading. Works
    with zero setup, no account, no internet. This is the default.
  - **Claude** — sends the photo to Claude's vision model for a full design
    plan. Requires your own Anthropic API key (stored locally only). Choose
    between Claude Opus 5, Sonnet 5, or Haiku 4.5.
- **Light / dark / system** themes.

## Getting started

```bash
npm install     # install dependencies
npm run dev     # launch the app with hot reload
```

The app opens in Demo mode, so you can try the full flow immediately. For AI
design plans, open **Settings → Generation engine → Claude** and paste an
Anthropic API key from <https://console.anthropic.com/settings/keys>.

## Scripts

| Command             | Description                                |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Run in development with hot reload         |
| `npm run build`     | Type-check and build the production bundle  |
| `npm run typecheck` | Type-check main, preload and renderer      |
| `npm run lint`      | Lint the codebase                          |
| `npm run format`    | Format with Prettier                       |
| `npm run pack:dir`  | Build an unpacked app into `release/`      |
| `npm run dist`      | Build installers for the current platform  |

## Architecture

```
src/
├─ shared/            Types + IPC channel names shared across processes
├─ main/              Electron main process
│  ├─ index.ts        Window creation, theme, lifecycle
│  ├─ ipc.ts          Typed IPC handlers (settings, gallery, file dialogs)
│  ├─ store.ts        Persistent settings + gallery (electron-store)
│  └─ ai/             Generation providers
│     ├─ index.ts     Dispatcher
│     └─ claude.ts    Claude vision → structured design plan (@anthropic-ai/sdk)
├─ preload/           contextBridge — the only surface the renderer can call
└─ renderer/          React UI
   ├─ data/           Category + style-preset library
   ├─ store/          Zustand app store
   ├─ lib/            Front-end generation (demo canvas + IPC dispatch)
   ├─ components/     Sidebar, BeforeAfter slider, UploadZone, DesignPlan, …
   └─ screens/        Home, Studio, Gallery, Settings
```

### Security model

- `contextIsolation: true`, `nodeIntegration: false`.
- The renderer can only reach a small, typed API exposed via `contextBridge`.
- The Anthropic API key lives in the main process and `electron-store`; it is
  never exposed to renderer JavaScript, and the Claude call is made from the
  main process.
- A strict Content-Security-Policy is set on the renderer HTML.

## Notes

Your photos never leave your machine in Demo mode. In Claude mode, a photo is
sent to the Anthropic API only to produce the design plan, per Anthropic's API
terms. Claude returns text, not images — the visual preview is always local.

## License

MIT
