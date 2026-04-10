# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server at http://localhost:5173/
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Project Overview

An interactive Ubuntu GNOME desktop environment simulation running in the browser — a portfolio piece demonstrating advanced frontend capabilities.

## Architecture

The app renders a virtual desktop OS with draggable/resizable windows, a dock, top bar, lock screen, and several simulated apps.

**Boot flow:** `main.jsx` → `App.jsx` (shows `LockScreen` until unlocked with password "ubuntu") → `Desktop.jsx` (renders `TopBar`, `Dock`, `WindowManager`).

**Window lifecycle:**
1. User clicks a Dock icon → `openWindow(appId)` in `windowStore`
2. `WindowManager` maps the windows array → renders `Window` components
3. Each `Window` wraps its app in `react-rnd` for drag/resize; z-index uses `Date.now()` for focus ordering

**State management (Zustand):**
- `src/store/windowStore.js` — window open/close/minimize/maximize/focus state
- `src/store/settingsStore.js` — theme (dark/light), wallpaper, Wi-Fi/Bluetooth toggles

**Apps** live in `src/components/Apps/`:
- `Terminal/` — Xterm.js emulator with simulated commands (`ls`, `ping`, `whoami`, `clear`, etc.); not a real shell
- `Firefox/` — iframe browser, defaults to Wikipedia
- `Files/` — purely visual file manager, no real filesystem access
- `Settings/` — tabbed panel that writes to `settingsStore`

## Key Conventions

- **React 18 + Vite**, no TypeScript — all source files are `.jsx`
- **Tailwind CSS** with a custom Ubuntu color palette defined in `tailwind.config.js` (`ubuntu-orange`, `ubuntu-dark`, `ubuntu-panel`, `ubuntu-window`, etc.)
- **Framer Motion** for animations; **react-rnd** for window drag/resize
- Maximized windows set `disableDragging` and snap to screen edges via inline styles
- `chess.js` and `react-chessboard` are installed but unused
