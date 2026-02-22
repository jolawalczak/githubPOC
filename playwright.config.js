const { defineConfig, devices } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, 'config', 'e2e.settings.json');
const settings = fs.existsSync(settingsPath)
  ? JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
  : { browser: 'chrome', headless: true, baseURL: 'https://qualityminds.com/en/' };

function getProject() {
  const browser = (settings.browser || 'chrome').toLowerCase();

  if (browser === 'firefox') {
    return {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], browserName: 'firefox' },
    };
  }

  // chrome
  return {
    name: 'chrome',
    use: { ...devices['Desktop Chrome'], browserName: 'chromium', channel: 'chrome' },
  };
}

module.exports = defineConfig({
  testDir: './tests',
  outputDir: 'results',
  reporter: [['html', { outputFolder: 'results/html-report', open: 'never' }]],
  use: {
    baseURL: settings.baseURL,   // <- to jest kluczowe dla page.goto('/')
    headless: settings.headless,
    trace: 'on',
    viewport: { width: 1920, height: 1080 },
  },
  projects: [getProject()],
});