# FaciBox

Workshop and meeting facilitation toolkit as a Chrome Extension.

ワークショップやミーティングで使えるファシリテーションツールの Chrome 拡張機能です。

## Features / 機能

- **Dice** - Roll dice with configurable faces and count / サイコロ（面数・個数設定可）
- **Roulette** - Spin wheel to randomly select from items / ルーレットでランダム選出
- **Timer** - Countdown timer with overtime tracking and alarm / タイマー（超過カウント・アラーム付き）
- **Theme Picker** - Randomly pick a theme from registered items / テーマをランダムに決定

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

## License

MIT
