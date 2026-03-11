import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const DIST_PATH = path.resolve(import.meta.dirname, "../dist");
const OUT_DIR = path.resolve(import.meta.dirname, "../store-assets");

const SAMPLE_DATA = {
  dice: { faces: 6, count: 2 },
  roulette: {
    items: ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank"],
  },
  timer: { minutes: 5, seconds: 0 },
  theme: {
    items: [
      "アイスブレイク",
      "振り返り",
      "ブレスト",
      "チーム目標",
      "業務改善",
    ],
    presets: [
      {
        name: "ワークショップ基本",
        items: ["アイスブレイク", "振り返り", "ブレスト"],
      },
    ],
  },
};

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const ctx = await chromium.launchPersistentContext("", {
    headless: false,
    args: [
      `--disable-extensions-except=${DIST_PATH}`,
      `--load-extension=${DIST_PATH}`,
      "--no-first-run",
      "--disable-popup-blocking",
      "--lang=ja",
    ],
    locale: "ja-JP",
    viewport: { width: 1280, height: 800 },
  });

  let sw = ctx.serviceWorkers()[0];
  if (!sw) {
    sw = await ctx.waitForEvent("serviceworker");
  }
  console.log("Extension ID:", sw.url().split("/")[2]);

  await sw.evaluate((data: typeof SAMPLE_DATA) => {
    return chrome.storage.local.set({ facibox_data: data });
  }, SAMPLE_DATA);
  await new Promise((r) => setTimeout(r, 500));

  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.goto("https://example.com");
  await page.waitForTimeout(1500);

  // Toggle modal
  await sw.evaluate(
    `chrome.tabs.query({active: true}).then(tabs => chrome.tabs.sendMessage(tabs[0].id, {type: "TOGGLE_MODAL"}))`,
  );
  await page.waitForTimeout(1500);

  const modalLeft = 840;
  const centerX = modalLeft + 200;
  const tabY = 82;
  const tabWidth = 95;
  const tabStartX = modalLeft + 15;
  const startBtnY = 148;

  // -- 01: Dice - roll --
  await page.mouse.click(centerX, 365);
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(OUT_DIR, "01-dice.png"),
    clip: { x: 0, y: 0, width: 1280, height: 800 },
  });
  console.log("01-dice.png");

  // -- 02: Roulette - switch to use mode and spin --
  await page.mouse.click(tabStartX + tabWidth * 1.5, tabY);
  await page.waitForTimeout(500);

  // Click "始める →"
  await page.mouse.click(centerX, startBtnY);
  await page.waitForTimeout(1000);

  // Click "回す" button - it's below the checkbox at approx y=508
  await page.mouse.click(centerX, 508);
  await page.waitForTimeout(5000);

  await page.screenshot({
    path: path.join(OUT_DIR, "02-roulette.png"),
    clip: { x: 0, y: 0, width: 1280, height: 800 },
  });
  console.log("02-roulette.png");

  // -- 03: Timer --
  await page.mouse.click(tabStartX + tabWidth * 2.5, tabY);
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(OUT_DIR, "03-timer.png"),
    clip: { x: 0, y: 0, width: 1280, height: 800 },
  });
  console.log("03-timer.png");

  // -- 04: Theme (edit mode with data is informative) --
  await page.mouse.click(tabStartX + tabWidth * 3.5, tabY);
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(OUT_DIR, "04-theme.png"),
    clip: { x: 0, y: 0, width: 1280, height: 800 },
  });
  console.log("04-theme.png");

  await ctx.close();

  // Clean up debug files
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (f.startsWith("debug-")) fs.unlinkSync(path.join(OUT_DIR, f));
  }

  console.log(`\nScreenshots saved to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
