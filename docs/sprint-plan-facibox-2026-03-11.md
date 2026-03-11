# Sprint Plan: FaciBox

**Date:** 2026-03-11
**Scrum Master:** katsut
**Project Level:** 2
**Total Stories:** 10
**Total Points:** 30
**Planned Sprints:** 3
**Sprint Length:** 1 week

---

## Executive Summary

FaciBox の実装を 3 スプリント（3 週間）で計画。Sprint 1 で Extension 基盤とダイス機能、Sprint 2 でルーレット・タイマー・テーマ決定、Sprint 3 でデータ永続化と仕上げを行う。

**Key Metrics:**
- Total Stories: 10
- Total Points: 30
- Sprints: 3
- Team Capacity: ~12 points/sprint（ソロ開発、1 週間）
- Target Completion: 2026-03-29

---

## Story Inventory

### STORY-001: プロジェクトセットアップ

**Epic:** EPIC-001 (Extension 基盤)
**Priority:** Must Have
**Points:** 3

**User Story:**
As a 開発者
I want to React + Vite + CRXJS の開発環境をセットアップ
So that Chrome Extension の開発を開始できる

**Acceptance Criteria:**
- [ ] pnpm + Vite + React + TypeScript のプロジェクトが作成されている
- [ ] CRXJS Vite Plugin が設定済み
- [ ] Manifest V3 の manifest.json が作成されている
- [ ] `pnpm dev` で Chrome にロードして動作確認できる
- [ ] ESLint + Prettier が設定済み

**Technical Notes:**
- CRXJS Vite Plugin で Manifest V3 をサポート
- TypeScript strict mode

---

### STORY-002: モーダル表示/非表示

**Epic:** EPIC-001 (Extension 基盤)
**Priority:** Must Have
**Points:** 5

**User Story:**
As a ファシリテーター
I want to 拡張アイコンクリックでモーダルを表示/非表示
So that ワークショップ中にすぐツールを使える

**Acceptance Criteria:**
- [ ] Background SW がアイコンクリックを検知し Content Script にメッセージ送信
- [ ] Content Script が Shadow DOM コンテナを生成
- [ ] React アプリが Shadow DOM 内にマウントされる
- [ ] 再度クリックでモーダルが非表示になる
- [ ] モーダル外クリックで非表示になる
- [ ] Shadow DOM (closed) でページ CSS と干渉しない
- [ ] z-index が十分高く、他要素の前面に表示される

**Technical Notes:**
- Background SW → `chrome.action.onClicked` → `chrome.tabs.sendMessage`
- Content Script → Shadow DOM 生成 → `createRoot` で React マウント
- CSS Modules でスタイル記述、Shadow DOM 内に注入

**Dependencies:** STORY-001

---

### STORY-003: タブナビゲーション

**Epic:** EPIC-001 (Extension 基盤)
**Priority:** Must Have
**Points:** 2

**User Story:**
As a ファシリテーター
I want to 4 つの機能をタブで切り替え
So that 必要なツールにすぐアクセスできる

**Acceptance Criteria:**
- [ ] ダイス・ルーレット・タイマー・テーマ決定の 4 タブが表示される
- [ ] アクティブタブが視覚的に区別できる
- [ ] タブ切り替え時に各機能の状態が保持される

**Technical Notes:**
- App.tsx で activeTab state 管理
- TabNav コンポーネント + 条件レンダリング

**Dependencies:** STORY-002

---

### STORY-004: ダイス機能

**Epic:** EPIC-002 (ファシリテーションツール)
**Priority:** Must Have
**Points:** 2

**User Story:**
As a ファシリテーター
I want to ダイスを振って数字を出す
So that 順番決めやランダム選択ができる

**Acceptance Criteria:**
- [ ] 面数を入力できる（デフォルト: 6）
- [ ] 振るボタンで 1〜面数のランダムな数字が表示される
- [ ] 結果が大きく表示され、画面共有時にも視認できる

**Technical Notes:**
- `Math.random()` ベース
- Dice.tsx コンポーネント

**Dependencies:** STORY-003

---

### STORY-005: ルーレット機能

**Epic:** EPIC-002 (ファシリテーションツール)
**Priority:** Must Have
**Points:** 3

**User Story:**
As a ファシリテーター
I want to 登録した項目からランダムに 1 つを選ぶ
So that 参加者やチームの選出を楽しくできる

**Acceptance Criteria:**
- [ ] テキストで項目を追加できる
- [ ] 登録済み項目の一覧が表示される
- [ ] 項目を個別に削除できる
- [ ] 回すボタンでランダムに 1 項目が選出される
- [ ] 結果が大きく表示される

**Technical Notes:**
- Roulette.tsx コンポーネント
- 項目リストは React state で管理（後で Storage と連携）

**Dependencies:** STORY-003

---

### STORY-006: タイマー機能

**Epic:** EPIC-002 (ファシリテーションツール)
**Priority:** Must Have
**Points:** 3

**User Story:**
As a ファシリテーター
I want to カウントダウンタイマーで時間管理
So that セッションの時間を守れる

**Acceptance Criteria:**
- [ ] 分・秒で時間を設定できる
- [ ] スタートボタンでカウントダウン開始
- [ ] ストップボタンで一時停止
- [ ] リセットボタンで設定時間に戻る
- [ ] 残り時間が大きく表示される
- [ ] タイムアップ時に視覚的な変化（色変え等）がある

**Technical Notes:**
- useTimer カスタムフック（setInterval ベース）
- Timer.tsx コンポーネント

**Dependencies:** STORY-003

---

### STORY-007: テーマ決定機能

**Epic:** EPIC-002 (ファシリテーションツール)
**Priority:** Must Have
**Points:** 3

**User Story:**
As a ファシリテーター
I want to テーマリストからランダムに 1 つを選出
So that 議題選びに悩まない

**Acceptance Criteria:**
- [ ] テキストでテーマを追加できる
- [ ] 登録済みテーマの一覧が表示される
- [ ] テーマを個別に削除できる
- [ ] 選出ボタンでランダムに 1 テーマが選ばれる
- [ ] 結果が大きく表示される

**Technical Notes:**
- ThemePicker.tsx コンポーネント
- ルーレットと UI が似るが、用途が異なるため分離

**Dependencies:** STORY-003

---

### STORY-008: データ保存・復元

**Epic:** EPIC-003 (データ永続化)
**Priority:** Must Have
**Points:** 3

**User Story:**
As a ファシリテーター
I want to 前回の設定が残っている
So that 毎回入力し直さなくていい

**Acceptance Criteria:**
- [ ] ダイスの面数が保存・復元される
- [ ] ルーレットの項目リストが保存・復元される
- [ ] タイマーの時間設定が保存・復元される
- [ ] テーマリストが保存・復元される
- [ ] ブラウザを閉じて再度開いてもデータが残る

**Technical Notes:**
- useStorage カスタムフック
- chrome.storage.local に FaciBoxData 型で保存
- 各コンポーネントで useStorage を使用

**Dependencies:** STORY-004, STORY-005, STORY-006, STORY-007

---

### STORY-009: リセット機能

**Epic:** EPIC-003 (データ永続化)
**Priority:** Must Have
**Points:** 2

**User Story:**
As a ファシリテーター
I want to データをリセットできる
So that 新しいワークショップ用に初期化できる

**Acceptance Criteria:**
- [ ] リセットボタンが各機能にある（または全体リセット）
- [ ] リセット前に確認ダイアログが表示される
- [ ] リセット後にデフォルト値に戻る

**Technical Notes:**
- storage.ts に reset 関数
- window.confirm で確認

**Dependencies:** STORY-008

---

### STORY-010: UI ブラッシュアップ

**Epic:** 横断
**Priority:** Should Have
**Points:** 4

**User Story:**
As a ファシリテーター
I want to 見やすくクリーンな UI
So that 画面共有時に参加者にも内容が伝わる

**Acceptance Criteria:**
- [ ] 統一されたカラースキーム
- [ ] 結果表示が十分に大きい（画面共有を考慮）
- [ ] 各機能の操作が直感的
- [ ] モーダルのドラッグ移動が可能

**Technical Notes:**
- CSS 変数でカラースキーム管理
- ドラッグは mousedown/mousemove/mouseup で実装

**Dependencies:** STORY-004 〜 STORY-009

---

## Sprint Allocation

### Sprint 1 (Week 1) — 基盤 + ダイス — 12/12 points

**Goal:** Extension の基盤を構築し、最初の機能（ダイス）を動作させる

| Story | Title | Points | Priority |
|-------|-------|--------|----------|
| STORY-001 | プロジェクトセットアップ | 3 | Must |
| STORY-002 | モーダル表示/非表示 | 5 | Must |
| STORY-003 | タブナビゲーション | 2 | Must |
| STORY-004 | ダイス機能 | 2 | Must |

**Sprint 1 完了時の成果:** Chrome にロードしてアイコンクリック → モーダル表示 → ダイスを振れる状態

---

### Sprint 2 (Week 2) — 残り 3 機能 — 9/12 points

**Goal:** ルーレット・タイマー・テーマ決定の 3 機能を実装し、全機能が使える状態にする

| Story | Title | Points | Priority |
|-------|-------|--------|----------|
| STORY-005 | ルーレット機能 | 3 | Must |
| STORY-006 | タイマー機能 | 3 | Must |
| STORY-007 | テーマ決定機能 | 3 | Must |

**Sprint 2 完了時の成果:** 4 機能すべてが動作する状態（データはまだ揮発性）

---

### Sprint 3 (Week 3) — 永続化 + 仕上げ — 9/12 points

**Goal:** データ永続化とリセット機能を実装し、UI を仕上げてリリース可能な状態にする

| Story | Title | Points | Priority |
|-------|-------|--------|----------|
| STORY-008 | データ保存・復元 | 3 | Must |
| STORY-009 | リセット機能 | 2 | Must |
| STORY-010 | UI ブラッシュアップ | 4 | Should |

**Sprint 3 完了時の成果:** リリース可能な FaciBox

---

## Epic Traceability

| Epic ID | Epic Name | Stories | Total Points | Sprint |
|---------|-----------|---------|--------------|--------|
| EPIC-001 | Extension 基盤 | STORY-001, 002, 003 | 10 | Sprint 1 |
| EPIC-002 | ファシリテーションツール | STORY-004, 005, 006, 007 | 11 | Sprint 1-2 |
| EPIC-003 | データ永続化 | STORY-008, 009 | 5 | Sprint 3 |
| — | 横断 | STORY-010 | 4 | Sprint 3 |

---

## Functional Requirements Coverage

| FR ID | FR Name | Story | Sprint |
|-------|---------|-------|--------|
| FR-001 | モーダル表示/非表示 | STORY-002 | 1 |
| FR-002 | 機能切り替え | STORY-003 | 1 |
| FR-003 | ダイス | STORY-004 | 1 |
| FR-004 | ルーレット | STORY-005 | 2 |
| FR-005 | タイマー | STORY-006 | 2 |
| FR-006 | テーマ決定 | STORY-007 | 2 |
| FR-007 | データ保存 | STORY-008 | 3 |
| FR-008 | リセット | STORY-009 | 3 |

**Coverage:** 8/8 FRs (100%)

---

## Risks and Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shadow DOM 内の React マウントでハマる | 高 | Sprint 1 で早期に検証。CRXJS ドキュメント確認 |
| CSS Modules の Shadow DOM 注入 | 中 | STORY-002 で仕組みを確立し、以降は同じパターン |
| ルーレットとテーマ決定の UI 重複 | 低 | 共通コンポーネント化は不要、シンプルに個別実装 |

---

## Definition of Done

For a story to be considered complete:
- [ ] コード実装済み、コミット済み
- [ ] TypeScript エラーなし
- [ ] ESLint / Prettier エラーなし
- [ ] Chrome にロードして動作確認済み
- [ ] Acceptance Criteria をすべて満たしている

---

## Next Steps

**Immediate:** Begin Sprint 1

Run `/dev-story STORY-001` to start with project setup, then proceed to STORY-002.

---

**This plan was created using BMAD Method v6 - Phase 4 (Implementation Planning)**
