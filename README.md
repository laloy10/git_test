# Home AI Studio

A cross-platform **desktop** recreation of the "Home AI" interior/exterior design
concept: snap or upload a photo of a space, pick a style, and preview an
AI-generated redesign — for rooms, gardens, home exteriors, and paint colours.

Built with **Electron + React + TypeScript + Vite**, following Electron security
best practices (context isolation, a typed preload bridge, no Node in the
renderer).

## Features

- **Four space types** — Interior, Garden, Exterior, and Paint, each with a set
  of curated style presets (24 in total).
- **Guided one-tap flow** — upload a photo → choose a style → generate → compare.
- **Before / after slider** to inspect the result against the original.
- **Local gallery** — save designs; everything is stored on your device.
- **Two generation engines**
  - **Demo (offline)** — restyles the photo locally with colour grading. Works
    with zero setup, no account, no internet. This is the default.
  - **OpenAI** — sends the photo to `gpt-image-1` for a full photorealistic
    redesign. Requires your own API key (stored locally only).
- **Light / dark / system** themes.

## Getting started

```bash
npm install     # install dependencies
npm run dev     # launch the app with hot reload
```

The app opens in Demo mode, so you can try the full flow immediately. To use
real AI generation, open **Settings → Generation engine → OpenAI** and paste an
API key from <https://platform.openai.com/api-keys>.

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
│     └─ openai.ts    gpt-image-1 image-edit provider
├─ preload/           contextBridge — the only surface the renderer can call
└─ renderer/          React UI
   ├─ data/           Category + style-preset library
   ├─ store/          Zustand app store
   ├─ lib/            Front-end generation (demo canvas + IPC dispatch)
   ├─ components/     Sidebar, BeforeAfter slider, UploadZone, …
   └─ screens/        Home, Studio, Gallery, Settings
```

### Security model

- `contextIsolation: true`, `nodeIntegration: false`.
- The renderer can only reach a small, typed API exposed via `contextBridge`.
- The OpenAI API key lives in the main process and `electron-store`; it is never
  exposed to renderer JavaScript.
- A strict Content-Security-Policy is set on the renderer HTML.

## Notes

The photos you generate never leave your machine in Demo mode. In OpenAI mode
they are sent to OpenAI only to produce the redesign, per their API.

## License

MIT
