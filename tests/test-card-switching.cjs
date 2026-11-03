const puppeteer = require('puppeteer');

async function testCardSwitching() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  console.log('📸 Taking initial hero screenshot...');
  await page.screenshot({ path: '/tmp/cards-step-0.png' });

  // Find next arrow
  const nextBtn = await page.$('button[aria-label="Next event card"]');
  if (!nextBtn) throw new Error('Next button not found!');

  console.log('👉 Clicking Next arrow button...');
  await nextBtn.click();
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: '/tmp/cards-step-1.png' });

  console.log('👉 Clicking Next arrow button again...');
  await nextBtn.click();
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: '/tmp/cards-step-2.png' });

  // Test mobile 360px
  console.log('📱 Testing 360px mobile view...');
  await page.setViewport({ width: 360, height: 780, isMobile: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: '/tmp/cards-mobile-view.png' });

  console.log('👉 Clicking Next arrow on mobile...');
  const mobileNextBtn = await page.$('button[aria-label="Next event card"]');
  if (mobileNextBtn) {
    await mobileNextBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: '/tmp/cards-mobile-step-1.png' });
  }

  await browser.close();
  console.log('✨ Card switching test completed successfully!');
}

testCardSwitching().catch(console.error);

