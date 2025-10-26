const fs = require('fs')
const path = require('path')
const { chromium, devices } = require('playwright')

(async () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
  const PAGE_PATH = process.env.PAGE_PATH || '/www.vaticannews.va/fr.html'
  const desktopPath = path.join('migration_plan', 'screenshots')
  if (!fs.existsSync(desktopPath)) fs.mkdirSync(desktopPath, { recursive: true })

  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } })
    await page.goto(new URL(PAGE_PATH, BASE_URL).toString(), { waitUntil: 'networkidle' })
    const desktopFile = path.join(desktopPath, 'screenshot_home_desktop.png')
    await page.screenshot({ path: desktopFile, fullPage: false })
    console.log('Saved', desktopFile)

    const iPhone = devices['iPhone 12']
    const mobilePage = await browser.newPage({ ...iPhone })
    await mobilePage.goto(new URL(PAGE_PATH, BASE_URL).toString(), { waitUntil: 'networkidle' })
    const mobileFile = path.join(desktopPath, 'screenshot_home_mobile.png')
    await mobilePage.screenshot({ path: mobileFile, fullPage: false })
    console.log('Saved', mobileFile)
  } catch (err) {
    console.error('Error capturing screenshots', err)
    process.exit(1)
  } finally {
    await browser.close()
  }
})()
