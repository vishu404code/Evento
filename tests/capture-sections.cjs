const puppeteer = require('puppeteer');

async function captureSections() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  const sections = [
    { id: '#problem', name: 'chaos-to-order' },
    { id: '#story', name: 'scroll-story' },
    { id: '#showcase', name: 'event-showcase' },
    { id: '#calendar', name: 'calendar' },
    { id: '#notify', name: 'notify-share' },
    { id: '#organizers', name: 'organizers' },
    { id: '#faq', name: 'faq' },
  ];

  for (const s of sections) {
    const el = await page.$(s.id);
    if (el) {
      await el.scrollIntoView();
      await new Promise((r) => setTimeout(r, 600));
      await el.screenshot({ path: `/tmp/section-${s.name}.png` });
      console.log(`Saved /tmp/section-${s.name}.png`);
    }
  }

  await browser.close();
}

captureSections().catch(console.error);

