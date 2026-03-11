import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const OUT_DIR = path.resolve(import.meta.dirname, "../store-assets");

const html = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 440px;
    height: 280px;
    background: linear-gradient(135deg, #4f6df5 0%, #818cf8 50%, #a78bfa 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    overflow: hidden;
    position: relative;
  }

  .content {
    text-align: center;
    color: #fff;
    z-index: 1;
  }

  .logo {
    font-size: 48px;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 8px;
    text-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }

  .tagline {
    font-size: 14px;
    font-weight: 500;
    opacity: 0.9;
    letter-spacing: 0.5px;
  }

  .tools {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    justify-content: center;
  }

  .tool {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .tool-icon {
    width: 44px;
    height: 44px;
    background: rgba(255,255,255,0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255,255,255,0.15);
  }

  .tool-label {
    font-size: 10px;
    opacity: 0.85;
    font-weight: 500;
  }

  /* Decorative circles */
  .bg-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }
  .c1 { width: 200px; height: 200px; top: -60px; right: -40px; }
  .c2 { width: 150px; height: 150px; bottom: -50px; left: -30px; }
  .c3 { width: 80px; height: 80px; top: 30px; left: 40px; }
</style>
</head>
<body>
  <div class="bg-circle c1"></div>
  <div class="bg-circle c2"></div>
  <div class="bg-circle c3"></div>

  <div class="content">
    <div class="logo">FaciBox</div>
    <div class="tagline">Facilitation Toolkit for Workshops & Meetings</div>
    <div class="tools">
      <div class="tool">
        <div class="tool-icon">🎲</div>
        <div class="tool-label">Dice</div>
      </div>
      <div class="tool">
        <div class="tool-icon">🎡</div>
        <div class="tool-label">Roulette</div>
      </div>
      <div class="tool">
        <div class="tool-icon">⏱</div>
        <div class="tool-label">Timer</div>
      </div>
      <div class="tool">
        <div class="tool-icon">🃏</div>
        <div class="tool-label">Theme</div>
      </div>
    </div>
  </div>
</body>
</html>`;

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 440, height: 280 },
    deviceScaleFactor: 2,
  });

  await page.setContent(html);
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(OUT_DIR, "promo-small-440x280.png"),
    clip: { x: 0, y: 0, width: 440, height: 280 },
  });
  console.log("promo-small-440x280.png");

  // Also generate large promo (1400x560) by scaling
  await page.setViewportSize({ width: 1400, height: 560 });
  await page.setContent(html.replace("440px", "1400px").replace("280px", "560px")
    .replace("48px", "96px")
    .replace("14px", "24px")
    .replace("20px", "40px")  // gap
    .replace("44px; height: 44px", "80px; height: 80px")
    .replace("22px", "40px")  // icon font size
    .replace("12px", "20px")  // border radius
    .replace("10px", "16px")  // label font size
    .replace("200px; height: 200px", "400px; height: 400px")
    .replace("150px; height: 150px", "300px; height: 300px")
    .replace("80px; height: 80px; top: 30px; left: 40px", "160px; height: 160px; top: 60px; left: 80px")
  );
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(OUT_DIR, "promo-large-1400x560.png"),
    clip: { x: 0, y: 0, width: 1400, height: 560 },
  });
  console.log("promo-large-1400x560.png");

  await browser.close();
  console.log(`\nPromo images saved to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
