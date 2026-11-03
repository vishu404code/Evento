const puppeteer = require('puppeteer');

async function testMarquee() {
  console.log('🧪 Starting Marquee No-Pause Hover Test...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Scroll to marquee
  const marquee = await page.$('.animate-marquee');
  if (!marquee) throw new Error('Marquee element not found!');

  await marquee.scrollIntoView();
  await new Promise((r) => setTimeout(r, 500));

  const getPosition = async () => {
    return page.evaluate(() => {
      const el = document.querySelector('.animate-marquee');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const matrix = new DOMMatrixReadOnly(style.transform);
      return {
        left: rect.left,
        translateX: matrix.m41,
        playState: style.animationPlayState,
      };
    });
  };

  const initial = await getPosition();
  console.log('📍 Initial marquee position:', initial);

  // 1. Move cursor slowly across the bar
  console.log('👉 Moving cursor slowly across the marquee bar...');
  const box = await marquee.boundingBox();
  for (let x = box.x; x < box.x + 300; x += 30) {
    await page.mouse.move(x, box.y + box.height / 2);
    await new Promise((r) => setTimeout(r, 60));
  }
  const posAfterSlowMove = await getPosition();
  console.log('📍 Position after slow move:', posAfterSlowMove);
  if (posAfterSlowMove.translateX === initial.translateX) {
    throw new Error('FAILED: Marquee stopped during slow mouse move!');
  }
  console.log('✅ Passed: Marquee continued moving during slow mouse move.');

  // 2. Move cursor quickly across the bar
  console.log('👉 Moving cursor quickly across the marquee bar...');
  for (let x = box.x + 300; x < box.x + 600; x += 100) {
    await page.mouse.move(x, box.y + box.height / 2);
    await new Promise((r) => setTimeout(r, 20));
  }
  const posAfterFastMove = await getPosition();
  console.log('📍 Position after fast move:', posAfterFastMove);
  if (posAfterFastMove.translateX === posAfterSlowMove.translateX) {
    throw new Error('FAILED: Marquee stopped during fast mouse move!');
  }
  console.log('✅ Passed: Marquee continued moving during fast mouse move.');

  // 3. Hold cursor still on the bar for 10 seconds, checking every second
  console.log('⏱️ Holding cursor still directly on the marquee bar for 10 seconds...');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

  const samples = [];
  for (let i = 1; i <= 10; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const sample = await getPosition();
    samples.push(sample.translateX);
    console.log(`   Second ${i}: translateX = ${sample.translateX.toFixed(2)}px (playState: ${sample.playState})`);
  }

  // Verify that each second translateX decreased (moved leftwards continuously)
  for (let i = 1; i < samples.length; i++) {
    if (samples[i] >= samples[i - 1]) {
      throw new Error(`FAILED: Marquee stopped or did not advance at second ${i + 1}`);
    }
  }
  console.log('✅ Passed: Marquee moved continuously without stopping for all 10 seconds while hovered!');

  // 4. Click on the marquee chip
  console.log('🖱️ Clicking directly on the marquee chip...');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  const posBeforeClick = await getPosition();
  await new Promise((r) => setTimeout(r, 1500));
  const posAfterClick = await getPosition();
  console.log(`📍 Position before click: ${posBeforeClick.translateX.toFixed(2)}px, after 1.5s: ${posAfterClick.translateX.toFixed(2)}px`);

  if (posAfterClick.translateX >= posBeforeClick.translateX) {
    throw new Error('FAILED: Marquee stopped after click!');
  }
  console.log('✅ Passed: Marquee continued moving after click!');

  await browser.close();
  console.log('🎉 ALL MARQUEE TESTS PASSED 100%!');
}

testMarquee().catch((err) => {
  console.error(err);
  process.exit(1);
});

