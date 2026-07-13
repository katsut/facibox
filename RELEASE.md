# Release Guide

How to publish a new version of FaciBox to the [Chrome Web Store](https://chromewebstore.google.com/detail/facibox/plgjjiajhegekckmccfgnhddgidffhoh).

## When a release is needed

A new store submission is required only when files that ship inside the extension package change:

- `src/` (content script, background service worker, UI)
- `manifest.json` (permissions, metadata)
- `icons/` and other bundled assets
- Runtime dependencies that end up in the bundle (`react`, `react-dom`)

Repo-only changes (README, CI workflows, scripts, store listing assets) do **not** require a release.

## Procedure

### 1. Bump the version

Update `version` in `manifest.json` following semver (e.g. `0.1.0` → `0.2.0` for features, `0.1.1` for fixes). The Chrome Web Store rejects uploads whose version is not higher than the published one.

### 2. Merge to main

Open a PR with the version bump (and the changes being released), wait for CI to pass, and merge.

### 3. Get the package

CI packages the extension on every push to main. Open the latest [CI run](https://github.com/katsut/facibox/actions/workflows/ci.yml) for main and download the `facibox-<sha>` artifact — it contains `facibox.zip`.

Alternatively, build locally:

```bash
pnpm build
cd dist && zip -r ../facibox.zip . -x '.vite/*'
```

### 4. Submit to the Chrome Web Store

1. Open the [Developer Dashboard](https://chrome.google.com/webstore/devconsole/) and select **FaciBox**.
2. Go to **Package** → **Upload new package** and upload `facibox.zip`.
3. Review the draft, then **Submit for review**.

Review typically takes a few hours to a few days. The new version is published automatically once approved.

### 5. Tag the release

```bash
git tag v0.2.0
git push origin v0.2.0
```

Optionally create a GitHub Release from the tag with a changelog.

## Store listing assets

Screenshots and promotional images live on the store listing, not in the package. They are updated separately in the dashboard under **Store listing**.

To regenerate them:

```bash
pnpm exec tsx scripts/screenshots.ts    # screenshots (1280x800)
pnpm exec tsx scripts/promo-image.ts    # promo images (440x280 / 1400x560)
```

Output lands in `store-assets/`. The store requires exact dimensions — keep `deviceScaleFactor: 1`.
