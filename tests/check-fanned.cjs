const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: '/tmp/fanned-deck-preview.png' });
  
  // Click next to test animation
  const nextBtn = await page.$('button[aria-label="Next card"]');
  if (nextBtn) {
    await nextBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: '/tmp/fanned-deck-after-click.png' });
  }

  // Test mobile view 360px
  await page.setViewport({ width: 360, height: 780, isMobile: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollBy(0, 360));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: '/tmp/fanned-deck-mobile.png' });

  await browser.close();
  console.log('Screenshots captured successfully!');
})();

