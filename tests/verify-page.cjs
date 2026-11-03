const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runVerification() {
  console.log('🚀 Starting browser verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Collect console messages and errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
  });

  // 1. Desktop 1440px viewport
  console.log('📱 Testing Desktop Viewport (1440x900)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Wait a moment for Framer Motion entrance animations
  await new Promise((r) => setTimeout(r, 1500));

  // Take screenshot of hero
  const heroScreenshotPath = '/tmp/evento-desktop-hero.png';
  await page.screenshot({ path: heroScreenshotPath });
  console.log('📸 Saved desktop hero to', heroScreenshotPath);

  // Test full page scroll
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  await new Promise((r) => setTimeout(r, 1000));
  const fullScreenshotPath = '/tmp/evento-desktop-full.png';
  await page.screenshot({ path: fullScreenshotPath, fullPage: true });
  console.log('📸 Saved full page desktop to', fullScreenshotPath);

  // 2. Test Mobile 360px viewport
  console.log('📱 Testing Mobile Viewport (360x780)...');
  await page.setViewport({ width: 360, height: 780, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  const mobileHeroScreenshotPath = '/tmp/evento-mobile-hero.png';
  await page.screenshot({ path: mobileHeroScreenshotPath });
  console.log('📸 Saved mobile hero to', mobileHeroScreenshotPath);

  // Test Mobile Hamburger Menu
  const hamburgerBtn = await page.$('button[aria-label="Open menu"]');
  if (hamburgerBtn) {
    console.log('🍔 Clicking mobile hamburger menu...');
    await hamburgerBtn.click();
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: '/tmp/evento-mobile-menu.png' });
    console.log('📸 Saved mobile menu open to /tmp/evento-mobile-menu.png');
    // Close it
    const closeBtn = await page.$('button[aria-label="Close menu"]');
    if (closeBtn) await closeBtn.click();
  }

  // Test Mobile Full Page
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 80);
    });
  });

  await new Promise((r) => setTimeout(r, 1000));
  const mobileFullScreenshotPath = '/tmp/evento-mobile-full.png';
  await page.screenshot({ path: mobileFullScreenshotPath, fullPage: true });
  console.log('📸 Saved mobile full page to', mobileFullScreenshotPath);

  // 3. Test Interactions on Desktop
  console.log('🧪 Testing Interactions...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500));

  // Interaction A: Hero Notify button
  const notifyBtn = await page.$('button[aria-label^="Toggle reminder"]');
  if (notifyBtn) {
    console.log('🔔 Clicking Notify button in Hero...');
    await notifyBtn.click();
    await new Promise((r) => setTimeout(r, 400));
    const btnText = await page.evaluate((el) => el.innerText, notifyBtn);
    console.log('✓ Notify button text after click:', btnText);
  }

  // Interaction B: Tidy Up button
  const tidyBtn = await page.$('button[aria-label="Tidy up chaos into clean cards"]');
  if (tidyBtn) {
    console.log('🧹 Clicking Tidy Up button...');
    await tidyBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    const tidyText = await page.evaluate((el) => el.innerText, tidyBtn);
    console.log('✓ Tidy button toggled to:', tidyText);
  }

  // Interaction C: Scroll Story Step 2
  const step2Btn = await page.$('[aria-label^="Step 2"]');
  if (step2Btn) {
    console.log('📖 Clicking Scroll Story Step 2...');
    await step2Btn.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  // Interaction D: Organizer Email Input
  const emailInput = await page.$('#ru-email-input');
  if (emailInput) {
    console.log('✉️ Testing invalid email in Organizer flow...');
    await emailInput.type('test@gmail.com');
    await new Promise((r) => setTimeout(r, 300));
    const errorText = await page.$eval('#organizers', (el) => el.innerText);
    console.log('✓ Includes error message:', errorText.includes('Only official RU emails'));

    console.log('✉️ Testing valid @rishihood.edu.in email...');
    await page.evaluate(() => {
      const input = document.querySelector('#ru-email-input');
      if (input) {
        input.value = '';
      }
    });
    await emailInput.type('council@rishihood.edu.in');
    await new Promise((r) => setTimeout(r, 300));
    const verifiedText = await page.$eval('#organizers', (el) => el.innerText);
    console.log('✓ Verified status unlocked:', verifiedText.includes('Verified Rishihood'));
  }

  await browser.close();

  console.log('📊 Verification Summary:');
  console.log('- Console Errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  } else {
    console.log('✨ Clean bill of health: 0 console errors!');
  }
}

runVerification().catch((err) => {
  console.error('Test script failed:', err);
  process.exit(1);
});

