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

  // artefakty testów (trace/screenshoty itp.)
  outputDir: 'results/test-results',

  // ✅ reportery (logi + adnotacje w GitHub + HTML report)
  reporter: [
    ['list'],
    ['github'],
    ['html', { outputFolder: 'results/html-report', open: 'never' }],
  ],

  use: {
    baseURL: settings.baseURL,

    // ✅ na CI zawsze headless, lokalnie wg settings
    headless: process.env.CI ? true : (settings.headless ?? true),

    trace: 'on',
    viewport: { width: 1920, height: 1080 },
  },

  projects: [getProject()],
});