const { test } = require('@playwright/test');
const path = require('path');

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_` +
         `${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

test('Open QualityMinds page and take screenshot', async ({ page }, testInfo) => {

  // Wejście na baseURL ustawiony w playwright.config.js
  await page.goto('/', { waitUntil: 'networkidle' });

  const fileName = `qualityminds_${timestamp()}.png`;

  // zapis w katalogu results/.../screenshots
  const screenshotPath = testInfo.outputPath(
    path.join('screenshots', fileName)
  );

  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });

  // opcjonalnie – załącznik w HTML report
  await testInfo.attach('screenshot', {
    path: screenshotPath,
    contentType: 'image/png'
  });

});