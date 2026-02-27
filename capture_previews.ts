import { chromium } from 'playwright';

async function capturePreviews() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1600 }
  });
  const page = await context.newPage();

  console.log('Navigating to Home Page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000); // Increased wait time

  console.log('Capturing Home Page...');
  await page.screenshot({ path: 'home_preview_fixed.png', fullPage: true });

  console.log('Navigating to All Products Page...');
  await page.goto('http://localhost:3000/all', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  console.log('Capturing All Products Page...');
  await page.screenshot({ path: 'all_products_preview_fixed.png', fullPage: true });

  await browser.close();
  console.log('Screenshots captured: home_preview_fixed.png, all_products_preview_fixed.png');
}

capturePreviews().catch(err => {
  console.error('Error capturing previews:', err);
  process.exit(1);
});
