const { test, expect } = require('@playwright/test');
const path = require('path');

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_` +
         `${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

// 🔥 helper do screenshotów
async function takeScreenshot(page, testInfo, name) {
  const fileName = `${name}_${timestamp()}.png`;

  const screenshotPath = testInfo.outputPath(
    path.join('screenshots', fileName)
  );

  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });

  await testInfo.attach(name, {
    path: screenshotPath,
    contentType: 'image/png'
  });
}


// 1️⃣ Home
test('Open QualityMinds page and take screenshot', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  await takeScreenshot(page, testInfo, 'home');
});


// 2️⃣ Portfolio
test('Click on Portfolio tab', async ({ page }, testInfo) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Portfolio', exact: true }).click();

  await expect(page).toHaveURL(/all-services/);

  await takeScreenshot(page, testInfo, 'portfolio');
});


// 3️⃣ Contact
test('Click on Contact button', async ({ page }, testInfo) => {
  await page.goto('/');

  const contactLink = page.locator('a[href*="contact"]');
  await expect(contactLink).toBeVisible();

  await Promise.all([
    page.waitForURL(/contact-us/),
    contactLink.click()
  ]);

  await takeScreenshot(page, testInfo, 'contact');
});


// 4️⃣ Test Management
test('Select Test Management from Testing QA dropdown', async ({ page }, testInfo) => {
  await page.goto('/');

  const menu = page.getByLabel('Services menu').getByRole('link', { name: 'Testing QA' });
  await menu.hover();

  const option = page.getByText('Test management');
  await expect(option).toBeVisible();

  await Promise.all([
    page.waitForURL(/test-management/),
    option.click()
  ]);

  await takeScreenshot(page, testInfo, 'test-management');
});