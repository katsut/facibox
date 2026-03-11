# System Architecture: FaciBox

**Date:** 2026-03-11
**Architect:** katsut
**Version:** 1.0
**Project Type:** Chrome Extension
**Project Level:** 2
**Status:** Draft

---

## Document Overview

This document defines the system architecture for FaciBox. It provides the technical blueprint for implementation, addressing all functional and non-functional requirements from the PRD.

**Related Documents:**
- Product Requirements Document: docs/prd-facibox-2026-03-11.md

---

## Executive Summary

FaciBox は Content Script ベースの Chrome Extension。React + Vite で構築し、Shadow DOM 内にモーダル UI をレンダリングする。データは Chrome Storage Local に永続化し、外部通信は一切行わない。Manifest V3 準拠。

---

## Architectural Drivers

1. **NFR-002: CSS 隔離** → Shadow DOM 必須。React のレンダリング先を Shadow DOM 内に設定する必要がある
2. **NFR-001: パフォーマンス** → Content Script の注入がホストページに影響を与えないよう、バンドルサイズを最小化
3. **NFR-005: データプライバシー** → 外部通信なし、Chrome Storage Local のみ

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────┐
│                Chrome Browser               │
│                                             │
│  ┌──────────────┐    ┌───────────────────┐  │
│  │  Background   │    │   Host Page       │  │
│  │  Service      │    │                   │  │
│  │  Worker       │◄──►│  ┌─────────────┐  │  │
│  │              │    │  │Content Script│  │  │
│  │  - アイコン   │    │  │             │  │  │
│  │    クリック   │    │  │ ┌─────────┐ │  │  │
│  │    検知      │    │  │ │Shadow   │ │  │  │
│  │              │    │  │ │DOM      │ │  │  │
│  └──────────────┘    │  │ │         │ │  │  │
│                      │  │ │ React   │ │  │  │
│  ┌──────────────┐    │  │ │ App     │ │  │  │
│  │  Chrome       │    │  │ │         │ │  │  │
│  │  Storage      │◄──►│  │ └─────────┘ │  │  │
│  │  Local        │    │  └─────────────┘  │  │
│  └──────────────┘    └───────────────────┘  │
└─────────────────────────────────────────────┘
```

### Architectural Pattern

**Pattern:** Content Script + Shadow DOM SPA

**Rationale:** Chrome Extension のポップアップは画面共有に映らないため、Content Script でページ内に DOM を注入する方式を採用。Shadow DOM で CSS を隔離し、React SPA をその中でレンダリングすることで、任意のホストページ上で一貫した UI を提供する。

---

## Technology Stack

### Frontend (Content Script)

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI コンポーネント |
| TypeScript | 5.x | 型安全性 |
| Vite | 6.x | ビルドツール |
| CRXJS Vite Plugin | latest | Chrome Extension 向け Vite プラグイン |

**Rationale:** React は 4 機能のタブ切り替え + 状態管理に適している。CRXJS は Vite で Chrome Extension を開発するためのデファクトプラグインで、HMR やマニフェスト自動生成をサポートする。

**Trade-offs:**
- ✓ 開発体験（HMR、コンポーネント分割、TypeScript）
- ✗ バンドルサイズが Vanilla JS より大きい（ただし Content Script としては許容範囲）

### Styling

| Technology | Purpose |
|-----------|---------|
| CSS Modules | Shadow DOM 内のスコープドスタイル |

**Rationale:** Shadow DOM 内では CSS-in-JS ライブラリの多くが正常動作しない。CSS Modules はビルド時にスコープされ、Shadow DOM との相性が良い。Tailwind CSS は Shadow DOM 内でのスタイル注入に追加設定が必要なため避ける。

### Chrome APIs

| API | Purpose |
|-----|---------|
| chrome.action | 拡張アイコンクリック検知 |
| chrome.storage.local | データ永続化 |
| chrome.scripting | Content Script 注入（必要に応じて） |

### Development & Build

| Tool | Purpose |
|------|---------|
| pnpm | パッケージマネージャー |
| Vitest | ユニットテスト |
| ESLint | リンター |
| Prettier | フォーマッター |

---

## System Components

### Component 1: Background Service Worker

**Purpose:** 拡張アイコンのクリックイベントを検知し、Content Script にメッセージを送信する

**Responsibilities:**
- `chrome.action.onClicked` リスナー
- Content Script へのトグルメッセージ送信

**FRs Addressed:** FR-001

**実装:**
```
// background.ts
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_MODAL" })
})
```

---

### Component 2: Content Script (Bootstrap)

**Purpose:** ホストページに Shadow DOM コンテナを作成し、React アプリをマウントする

**Responsibilities:**
- Shadow DOM コンテナの生成
- React アプリのマウント
- Background Service Worker からのメッセージ受信
- モーダルの表示/非表示制御

**FRs Addressed:** FR-001, FR-002

**Dependencies:** React App コンポーネント

---

### Component 3: React App

**Purpose:** モーダル UI 全体を管理するルートコンポーネント

**Responsibilities:**
- タブ切り替え（ダイス / ルーレット / タイマー / テーマ決定）
- 各機能コンポーネントのレンダリング
- グローバル状態管理

**FRs Addressed:** FR-002

---

### Component 4: Dice Feature

**Purpose:** ダイス機能

**Responsibilities:**
- 面数の入力・選択
- ランダム結果の生成・表示

**FRs Addressed:** FR-003

---

### Component 5: Roulette Feature

**Purpose:** ルーレット機能

**Responsibilities:**
- 項目の登録・編集・削除
- ランダム選出・結果表示

**FRs Addressed:** FR-004

---

### Component 6: Timer Feature

**Purpose:** カウントダウンタイマー機能

**Responsibilities:**
- 時間設定（分・秒）
- スタート・ストップ・リセット
- タイムアップ通知

**FRs Addressed:** FR-005

---

### Component 7: Theme Picker Feature

**Purpose:** テーマ決定機能

**Responsibilities:**
- テーマの登録・編集・削除
- ランダム選出・結果表示

**FRs Addressed:** FR-006

---

### Component 8: Storage Service

**Purpose:** Chrome Storage Local とのデータ読み書きを抽象化

**Responsibilities:**
- データの保存・読み込み
- リセット機能
- 型安全な Storage アクセス

**FRs Addressed:** FR-007, FR-008

---

## Data Architecture

### Data Model

```typescript
interface FaciBoxData {
  dice: DiceData
  roulette: RouletteData
  timer: TimerData
  theme: ThemeData
}

interface DiceData {
  faces: number // デフォルト: 6
}

interface RouletteData {
  items: string[] // ユーザー登録項目
}

interface TimerData {
  minutes: number
  seconds: number
}

interface ThemeData {
  items: string[] // ユーザー登録テーマ
}
```

### Storage Design

- **Storage Key:** `facibox_data`
- **Storage Type:** `chrome.storage.local`
- **容量制限:** 5MB（chrome.storage.local のデフォルト上限。テキストデータのみなので十分）

### Data Flow

```
User Input → React State → Chrome Storage Local (自動保存)
                ↑
App Mount  → Chrome Storage Local → React State (復元)
```

- 項目の追加・編集・削除時に Chrome Storage へ自動保存
- モーダル表示時に Chrome Storage からデータを復元

---

## API Design

外部 API なし。Chrome Extension 内部のメッセージングのみ。

### Internal Messaging

| Message | From | To | Purpose |
|---------|------|----|---------|
| `TOGGLE_MODAL` | Background SW | Content Script | モーダル表示/非表示 |

---

## Non-Functional Requirements Coverage

### NFR-001: パフォーマンス

**Requirement:** モーダル表示まで 200ms 以内、ホストページに影響なし

**Architecture Solution:**
- Content Script は `document_idle` で注入（ページ読み込み完了後）
- React アプリは Shadow DOM 内に閉じているため、ホストページの DOM 操作に影響しない
- Vite のツリーシェイキングでバンドルサイズを最小化

**Validation:**
- Chrome DevTools の Performance タブで Content Script の注入時間を計測

---

### NFR-002: CSS 隔離

**Requirement:** ホストページと FaciBox の CSS が互いに干渉しない

**Architecture Solution:**
- Shadow DOM (`mode: "closed"`) でスタイルを完全隔離
- CSS Modules でスタイルを記述し、ビルド時に Shadow DOM 内のスタイルシートとして注入
- ホストページの CSS リセットやグローバルスタイルの影響を受けない

**Implementation Notes:**
- Vite の CSS 処理で `?inline` を使い、CSS を JS 内に埋め込んで Shadow DOM に注入
- `adoptedStyleSheets` API を使用してスタイルを効率的に適用

**Validation:**
- 複数の異なるサイト（Google, YouTube, Miro 等）で表示崩れがないことを確認

---

### NFR-003: ブラウザ互換性

**Requirement:** Manifest V3、Chrome 最新安定版

**Architecture Solution:**
- CRXJS Vite Plugin が Manifest V3 準拠のビルドを自動生成
- `manifest.json` でサポートバージョンを明示

---

### NFR-004: デザイン

**Requirement:** シンプルでクリーン、画面共有時に視認性が良い

**Architecture Solution:**
- モーダルサイズ: 400px × 500px 程度（画面の邪魔にならず、視認性を確保）
- ドラッグで移動可能にして画面共有時の配置を調整可能に
- 大きめのフォントサイズ（結果表示は特に大きく）

---

### NFR-005: データプライバシー

**Requirement:** 外部通信なし、Chrome Storage Local のみ

**Architecture Solution:**
- `manifest.json` の `permissions` に `storage` のみ（ネットワーク系パーミッションなし）
- `host_permissions` は Content Script 注入用の `<all_urls>` のみ
- CSP (Content Security Policy) で外部リソースの読み込みを禁止

---

## Development Architecture

### Code Organization

```
facibox/
├── public/
│   └── icons/              # 拡張アイコン (16, 48, 128px)
├── src/
│   ├── background/
│   │   └── index.ts        # Service Worker
│   ├── content/
│   │   ├── index.ts        # Content Script エントリポイント
│   │   ├── mount.ts        # Shadow DOM 生成 + React マウント
│   │   └── styles.css      # ベーススタイル
│   ├── components/
│   │   ├── App.tsx          # ルートコンポーネント
│   │   ├── Modal.tsx        # モーダルコンテナ
│   │   ├── TabNav.tsx       # タブナビゲーション
│   │   ├── Dice.tsx         # ダイス機能
│   │   ├── Roulette.tsx     # ルーレット機能
│   │   ├── Timer.tsx        # タイマー機能
│   │   └── ThemePicker.tsx  # テーマ決定機能
│   ├── hooks/
│   │   ├── useStorage.ts    # Chrome Storage カスタムフック
│   │   └── useTimer.ts      # タイマーロジック
│   ├── lib/
│   │   └── storage.ts       # Chrome Storage ラッパー
│   └── types/
│       └── index.ts         # 型定義
├── manifest.json            # Chrome Extension マニフェスト
├── vite.config.ts
├── tsconfig.json
├── package.json
└── docs/
```

### Module Structure

```
Background SW ──message──► Content Script
                                │
                            mount.ts (Shadow DOM + React)
                                │
                            App.tsx
                            ├── TabNav
                            ├── Dice
                            ├── Roulette
                            ├── Timer
                            └── ThemePicker
                                │
                            useStorage (hook)
                                │
                            storage.ts
                                │
                            chrome.storage.local
```

### Testing Strategy

| レベル | ツール | 対象 | カバレッジ目標 |
|-------|--------|------|-------------|
| Unit | Vitest | hooks, lib, ロジック | 80%+ |
| Component | Vitest + Testing Library | React コンポーネント | 主要コンポーネント |
| E2E | 手動テスト | 拡張全体の動作 | 全 FR |

**Notes:**
- Chrome Extension 固有の API（`chrome.storage`）はモックして Unit テスト
- E2E は手動テスト（Puppeteer 等の自動化は MVP では見送り）

### Build & Deployment

```
pnpm build → dist/ に Chrome Extension をビルド
           → dist/ を Chrome Web Store にアップロード
```

- 開発時: `pnpm dev` で HMR 付き開発サーバー
- 本番: `pnpm build` でプロダクションビルド

---

## Requirements Traceability

### Functional Requirements Coverage

| FR ID | FR Name | Components | Notes |
|-------|---------|------------|-------|
| FR-001 | モーダル表示/非表示 | Background SW, Content Script, Modal | action.onClicked → message → toggle |
| FR-002 | 機能切り替え | App, TabNav | タブ UI で切り替え |
| FR-003 | ダイス | Dice | Math.random ベース |
| FR-004 | ルーレット | Roulette, useStorage | 項目登録 + ランダム選出 |
| FR-005 | タイマー | Timer, useTimer | setInterval ベース |
| FR-006 | テーマ決定 | ThemePicker, useStorage | 項目登録 + ランダム選出 |
| FR-007 | データ保存 | useStorage, storage.ts | chrome.storage.local |
| FR-008 | リセット | useStorage, storage.ts | confirm → storage.clear |

### Non-Functional Requirements Coverage

| NFR ID | NFR Name | Solution | Validation |
|--------|----------|----------|------------|
| NFR-001 | パフォーマンス | document_idle 注入、ツリーシェイキング | DevTools Performance |
| NFR-002 | CSS 隔離 | Shadow DOM (closed) + CSS Modules | 複数サイトで目視確認 |
| NFR-003 | ブラウザ互換性 | Manifest V3 + CRXJS | Chrome 最新版で動作確認 |
| NFR-004 | デザイン | 適切なサイズ、大きめフォント | 画面共有でのテスト |
| NFR-005 | データプライバシー | storage パーミッションのみ、CSP | マニフェスト確認 |

---

## Trade-offs & Decision Log

### Decision 1: Content Script 方式 vs Popup 方式

**選択:** Content Script（ページ内モーダル）
- ✓ 画面共有に映る
- ✓ ページから離れず操作可能
- ✗ 一部ページ（chrome://, Web Store）で動作しない
- ✗ ホストページとの干渉リスク（Shadow DOM で軽減）

### Decision 2: React vs Vanilla JS

**選択:** React
- ✓ 4 機能のタブ切り替え + 状態管理が楽
- ✓ 開発効率（HMR、コンポーネント分割）
- ✗ バンドルサイズ増加（~40KB gzip）
- **判断:** UI の複雑さを考慮すると React のメリットが上回る

### Decision 3: CSS Modules vs Tailwind vs CSS-in-JS

**選択:** CSS Modules
- ✓ Shadow DOM との相性が良い
- ✓ ビルド時にスコープされる
- ✗ Tailwind ほどの開発速度はない
- **判断:** Shadow DOM 環境で確実に動作することを優先

### Decision 4: Shadow DOM mode: "closed" vs "open"

**選択:** closed
- ✓ ホストページからの DOM アクセスを完全遮断
- ✗ デバッグがやや面倒
- **判断:** CSS 隔離の確実性を優先。開発時は open に切り替え可能

---

## Open Issues & Risks

| Issue | Impact | Mitigation |
|-------|--------|------------|
| Shadow DOM 内の React レンダリングにハマりポイントあり | 中 | CRXJS の Shadow DOM サポートを確認、必要なら手動マウント |
| 一部サイトで z-index 競合の可能性 | 低 | 十分に高い z-index (2147483647) を設定 |
| Content Script が動作しないページがある | 低 | マニフェストの `matches` で対象ページを明示 |

---

## Assumptions & Constraints

- Chrome 最新安定版のみサポート
- ユーザーデータはテキストのみ（画像等は含まない）
- 同時に 1 つのモーダルのみ表示
- オフライン動作（ネットワーク不要）

---

## Future Considerations

- ルーレットのアニメーション追加
- ダイスの 3D アニメーション
- テーマのカテゴリ分け
- エクスポート/インポート機能
- 多言語対応
- Firefox / Edge 対応（WebExtensions API）

---

## Approval & Sign-off

**Review Status:**
- [ ] Product Owner

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-11 | katsut | Initial architecture |

---

## Next Steps

### Phase 4: Sprint Planning & Implementation

Run `/sprint-planning` to:
- Break epics into detailed user stories
- Estimate story complexity
- Plan sprint iterations
- Begin implementation following this architectural blueprint

---

**This document was created using BMAD Method v6 - Phase 3 (Solutioning)**

*To continue: Run `/workflow-status` to see your progress and next recommended workflow.*
