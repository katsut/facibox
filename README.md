# FaciBox

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/plgjjiajhegekckmccfgnhddgidffhoh?label=Chrome%20Web%20Store)](https://chromewebstore.google.com/detail/facibox/plgjjiajhegekckmccfgnhddgidffhoh)

Workshop and meeting facilitation toolkit as a Chrome Extension.

## Install

Available on the [Chrome Web Store](https://chromewebstore.google.com/detail/facibox/plgjjiajhegekckmccfgnhddgidffhoh).

## Features

- **Dice** - Roll dice with configurable faces and count
- **Roulette** - Spin wheel to randomly select from items
- **Timer** - Countdown timer with overtime tracking and alarm
- **Theme Picker** - Randomly pick a theme from registered items

### Highlights

- Shadow DOM isolation - works on any page without style conflicts
- Draggable & resizable floating window
- Collapsible with header timer display
- Preset management for Theme Picker
- i18n support (Japanese / English)
- Data persisted via `chrome.storage.local`

## Tech Stack

- React 19 + TypeScript
- Vite + CRXJS Vite Plugin (Manifest V3)
- Content Script with Shadow DOM (closed mode)
- pnpm

## Development

```bash
pnpm install
pnpm dev
```

Load `dist/` as an unpacked extension in `chrome://extensions`.

## Build

```bash
pnpm build
```

## Release

See [RELEASE.md](RELEASE.md) for the Chrome Web Store release procedure.

## License

MIT
