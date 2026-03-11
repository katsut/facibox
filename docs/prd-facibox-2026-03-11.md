# Product Requirements Document: FaciBox

**Date:** 2026-03-11
**Author:** katsut
**Version:** 1.0
**Project Type:** Chrome Extension
**Project Level:** 2
**Status:** Draft

---

## Document Overview

This Product Requirements Document (PRD) defines the functional and non-functional requirements for FaciBox. It serves as the source of truth for what will be built and provides traceability from requirements through implementation.

**Related Documents:**
- Product Brief: N/A (skipped)

---

## Executive Summary

FaciBox は、ワークショップやグループワークのファシリテーションを支援する Chrome Extension。ダイス、ルーレット、タイマー、テーマ決定の 4 つのツールを提供し、順番決め・チーム分け・タイムキープ・議題選出といったファシリテーション業務をブラウザ上で手軽に行える。Content Script によるページ内モーダルとして動作し、画面共有にも対応する。

---

## Product Goals

### Business Objectives

1. ワークショップ・グループワークのファシリテーションを効率化する
2. ランダム選択をスムーズにして参加者のエンゲージメントを高める
3. Chrome 上で完結する軽量ツールとして、導入の手間なく使えるようにする

### Success Metrics

- Chrome Web Store 公開
- ユーザーが迷わず各機能を使える（初見で操作完了できる）

---

## Functional Requirements

Functional Requirements (FRs) define **what** the system does - specific features and behaviors.

Each requirement includes:
- **ID**: Unique identifier (FR-001, FR-002, etc.)
- **Priority**: Must Have / Should Have / Could Have / Won't Have (MoSCoW)
- **Description**: What the system should do
- **Acceptance Criteria**: How to verify it's complete

---

### FR-001: モーダル表示/非表示

**Priority:** Must Have

**Description:**
拡張アイコンをクリックすると、現在のページ上にモーダルが表示される。再度クリックまたはモーダル外クリックで非表示になる。

**Acceptance Criteria:**
- [ ] 拡張アイコンクリックでモーダルが表示される
- [ ] 再度クリックまたはモーダル外クリックで非表示になる
- [ ] Shadow DOM で実装され、ページの CSS と干渉しない
- [ ] モーダルは他の要素より前面に表示される

---

### FR-002: 機能切り替え

**Priority:** Must Have

**Description:**
モーダル内でダイス・ルーレット・タイマー・テーマ決定の 4 機能をタブまたはアイコンで切り替えられる。

**Acceptance Criteria:**
- [ ] 4 つの機能が切り替え可能
- [ ] 現在選択中の機能が視覚的にわかる
- [ ] 切り替え時に入力状態が失われない

---

### FR-003: ダイス

**Priority:** Must Have

**Description:**
指定した面数のダイスを振り、ランダムな結果を表示する。

**Acceptance Criteria:**
- [ ] 面数を指定できる（デフォルト: 6）
- [ ] 振るボタンで結果が表示される
- [ ] 結果が視覚的にわかりやすい

---

### FR-004: ルーレット

**Priority:** Must Have

**Description:**
ユーザーが登録した項目からランダムに 1 つを選出するルーレット機能。

**Acceptance Criteria:**
- [ ] 項目をテキストで登録できる
- [ ] 回すボタンでランダムに 1 項目が選出される
- [ ] 選出結果が視覚的にわかりやすい
- [ ] 登録済み項目の編集・削除ができる

---

### FR-005: タイマー

**Priority:** Must Have

**Description:**
指定した時間のカウントダウンタイマー。

**Acceptance Criteria:**
- [ ] 時間を分・秒で設定できる
- [ ] スタート・ストップ・リセット操作ができる
- [ ] 残り時間が視覚的にわかりやすい
- [ ] タイムアップ時に通知（視覚的な変化）がある

---

### FR-006: テーマ決定

**Priority:** Must Have

**Description:**
ユーザーが登録したテーマリストからランダムに 1 つを選出する。

**Acceptance Criteria:**
- [ ] テーマをテキストで登録できる
- [ ] ランダム選出ボタンで 1 テーマが選ばれる
- [ ] 選出結果が視覚的にわかりやすい
- [ ] 登録済みテーマの編集・削除ができる

---

### FR-007: データ保存

**Priority:** Must Have

**Description:**
ルーレットの項目、テーマリスト、ダイスの面数設定、タイマーの時間設定を Chrome Storage に保存し、次回起動時に復元する。

**Acceptance Criteria:**
- [ ] 登録データがブラウザを閉じても保持される
- [ ] 次回モーダル表示時に前回のデータが復元される

---

### FR-008: リセット

**Priority:** Must Have

**Description:**
各機能の保存データをリセットできるボタンを提供する。

**Acceptance Criteria:**
- [ ] リセットボタンで保存データが初期化される
- [ ] リセット前に確認ダイアログが表示される

---

## Non-Functional Requirements

Non-Functional Requirements (NFRs) define **how** the system performs - quality attributes and constraints.

---

### NFR-001: パフォーマンス

**Priority:** Must Have

**Description:**
モーダルの表示・操作がスムーズに動作する。

**Acceptance Criteria:**
- [ ] モーダル表示まで 200ms 以内
- [ ] ホストページのパフォーマンスに影響を与えない

---

### NFR-002: CSS 隔離

**Priority:** Must Have

**Description:**
Shadow DOM を使用し、ホストページの CSS と FaciBox の CSS が互いに干渉しない。

**Acceptance Criteria:**
- [ ] 任意のウェブサイト上で見た目が崩れない
- [ ] FaciBox の CSS がホストページに漏れない

---

### NFR-003: ブラウザ互換性

**Priority:** Must Have

**Description:**
Chrome の最新安定版で動作する（Manifest V3）。

**Acceptance Criteria:**
- [ ] Manifest V3 で実装されている
- [ ] Chrome 最新安定版で動作確認済み

---

### NFR-004: デザイン

**Priority:** Should Have

**Description:**
シンプルでクリーンなデザイン。ビジネスシーンでも違和感なく使える。

**Acceptance Criteria:**
- [ ] 画面共有時に視認性が良い
- [ ] 操作に迷わない直感的な UI

---

### NFR-005: データプライバシー

**Priority:** Must Have

**Description:**
ユーザーデータはローカル（Chrome Storage）のみに保存し、外部に送信しない。

**Acceptance Criteria:**
- [ ] 外部 API 通信がない
- [ ] Chrome Storage Local のみ使用

---

## Epics

Epics are logical groupings of related functionality that will be broken down into user stories during sprint planning (Phase 4).

Each epic maps to multiple functional requirements and will generate 2-10 stories.

---

### EPIC-001: Extension 基盤

**Description:**
Chrome Extension の基盤構築。モーダルの表示/非表示、Shadow DOM による CSS 隔離、機能切り替え UI を実装する。

**Functional Requirements:**
- FR-001 (モーダル表示/非表示)
- FR-002 (機能切り替え)

**Story Count Estimate:** 3-5

**Priority:** Must Have

**Business Value:**
全機能の土台。これがないと何も動かない。

---

### EPIC-002: ファシリテーションツール

**Description:**
ダイス・ルーレット・タイマー・テーマ決定の 4 つのコア機能を実装する。

**Functional Requirements:**
- FR-003 (ダイス)
- FR-004 (ルーレット)
- FR-005 (タイマー)
- FR-006 (テーマ決定)

**Story Count Estimate:** 4-6

**Priority:** Must Have

**Business Value:**
プロダクトの核。ファシリテーターが実際に使うツール群。

---

### EPIC-003: データ永続化

**Description:**
Chrome Storage を使ったデータの保存・復元・リセット機能。

**Functional Requirements:**
- FR-007 (データ保存)
- FR-008 (リセット)

**Story Count Estimate:** 2-3

**Priority:** Must Have

**Business Value:**
毎回入力し直す手間を省き、実用性を高める。

---

## User Stories (High-Level)

Detailed user stories will be created during sprint planning (Phase 4).

**EPIC-001:**
- As a ファシリテーター, I want to 拡張アイコンクリックでツールを表示 so that ワークショップ中にすぐ使える
- As a ファシリテーター, I want to 機能をタブで切り替える so that 必要なツールにすぐアクセスできる

**EPIC-002:**
- As a ファシリテーター, I want to ダイスを振って順番を決める so that 公平にランダム選択できる
- As a ファシリテーター, I want to ルーレットで参加者やチームを選ぶ so that 楽しくランダム選出できる
- As a ファシリテーター, I want to タイマーで時間管理する so that セッションの時間を守れる
- As a ファシリテーター, I want to テーマをランダムに決める so that 議題選びに悩まない

**EPIC-003:**
- As a ファシリテーター, I want to 前回の設定が残っている so that 毎回入力し直さなくていい
- As a ファシリテーター, I want to データをリセットできる so that 新しいワークショップ用に初期化できる

---

## User Personas

### ファシリテーター（主要ユーザー）
- ビジネスワークショップや教育グループワークを運営する人
- Chrome ブラウザで Google Meet / Zoom / Miro などを使いながらファシリテーションする
- 画面共有しながらツールを使いたい
- IT リテラシーは中程度以上

---

## User Flows

### メインフロー: ツール使用
1. 拡張アイコンをクリック
2. ページ上にモーダルが表示される
3. 使いたい機能のタブを選択
4. 操作（ダイスを振る / ルーレットを回す / タイマー開始 / テーマ選出）
5. 結果が表示される
6. モーダルを閉じるまたは別の機能に切り替え

### サブフロー: 項目登録
1. ルーレットまたはテーマ決定タブを選択
2. テキストで項目を入力・追加
3. 項目が Chrome Storage に自動保存される
4. 次回起動時に復元される

---

## Dependencies

### Internal Dependencies

なし（スタンドアロンの Chrome Extension）

### External Dependencies

- Chrome Extensions API (Manifest V3)
- Chrome Storage API

---

## Assumptions

- ユーザーは Chrome ブラウザを使用している
- `chrome://` や Chrome Web Store ページでは動作しない（Chrome の制約）
- インターネット接続は不要（完全オフライン動作）

---

## Out of Scope

- 複数デバイス間のデータ同期
- ユーザーアカウント / ログイン機能
- 外部サービス連携（Slack, Google Sheets 等）
- ルーレットやダイスのリッチなアニメーション（MVP では最低限）
- 多言語対応（MVP は日本語 UI）
- Firefox / Edge 等の他ブラウザ対応

---

## Open Questions

- ダイスの面数は自由入力か、プリセット（6, 10, 20 など）から選ぶか？
- タイマーのアラーム音は必要か？（画面共有中のノイズになる可能性）
- ルーレットとテーマ決定は機能的に似ているが、統合するか分けるか？

---

## Approval & Sign-off

### Stakeholders

| Role | Name |
|------|------|
| Product Owner | katsut |

### Approval Status

- [ ] Product Owner

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-11 | katsut | Initial PRD |

---

## Next Steps

### Phase 3: Architecture

Run `/architecture` to create system architecture based on these requirements.

The architecture will address:
- All functional requirements (FRs)
- All non-functional requirements (NFRs)
- Technical stack decisions
- Data models and APIs
- System components

### Phase 4: Sprint Planning

After architecture is complete, run `/sprint-planning` to:
- Break epics into detailed user stories
- Estimate story complexity
- Plan sprint iterations
- Begin implementation

---

**This document was created using BMAD Method v6 - Phase 2 (Planning)**

*To continue: Run `/workflow-status` to see your progress and next recommended workflow.*

---

## Appendix A: Requirements Traceability Matrix

| Epic ID | Epic Name | Functional Requirements | Story Count (Est.) |
|---------|-----------|-------------------------|-------------------|
| EPIC-001 | Extension 基盤 | FR-001, FR-002 | 3-5 |
| EPIC-002 | ファシリテーションツール | FR-003, FR-004, FR-005, FR-006 | 4-6 |
| EPIC-003 | データ永続化 | FR-007, FR-008 | 2-3 |

---

## Appendix B: Prioritization Details

### Functional Requirements
- **Must Have:** 8 (FR-001 〜 FR-008)
- **Should Have:** 0
- **Could Have:** 0

### Non-Functional Requirements
- **Must Have:** 4 (NFR-001, NFR-002, NFR-003, NFR-005)
- **Should Have:** 1 (NFR-004)

### Total Estimated Stories: 9-14
