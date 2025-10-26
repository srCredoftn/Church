Screenshots captured on request

Files captured:
- screenshot_home_desktop.png — desktop (1200x800)
- screenshot_home_mobile.png — mobile (375x812)

Note: The actual image files were captured and attached to the conversation. If you want these images added into the repository files as PNGs, run the provided capture script locally or tell me to prepare a CI job that will fetch the live site and store screenshots in this folder.

Commands to capture locally with Playwright (example):

1. npm i -D playwright
2. npx playwright install
3. Run a simple script:

const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.vaticannews.va/fr.html');
  await page.screenshot({ path: 'migration_plan/screenshots/screenshot_home_desktop.png', fullPage: false, width: 1200, height: 800 });
  const mobile = playwright.devices['iPhone 12'];
  const page2 = await browser.newPage({ viewport: mobile.viewport, userAgent: mobile.userAgent });
  await page2.goto('https://www.vaticannews.va/fr.html');
  await page2.screenshot({ path: 'migration_plan/screenshots/screenshot_home_mobile.png', fullPage: false });
  await browser.close();
})();

If you want, I can prepare a GitHub Action to run this and commit screenshots automatically. Tell me which option you prefer.
