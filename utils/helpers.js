/**
 * Helper utilities for payment automation tests
 */

const fs = require('fs');
const path = require('path');

/**
 * Ensures the test artifacts directory exists
 * @param {string} dirPath - Path to create
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Saves screenshots to the artifacts directory
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} name - Screenshot name
 * @param {string} testName - Optional test name for subdirectory
 */
async function saveScreenshot(page, name, testName = '') {
  const artifactsDir = path.join(process.cwd(), 'test-artifacts');
  const screenshotsDir = path.join(artifactsDir, 'screenshots');
  
  ensureDirectoryExists(artifactsDir);
  ensureDirectoryExists(screenshotsDir);
  
  if (testName) {
    const testDir = path.join(screenshotsDir, testName);
    ensureDirectoryExists(testDir);
    await page.screenshot({ path: path.join(testDir, `${name}.png`), fullPage: true });
  } else {
    await page.screenshot({ path: path.join(screenshotsDir, `${name}.png`), fullPage: true });
  }
}

/**
 * Logs test steps to a file and console
 * @param {string} message - Log message
 * @param {string} testName - Test name
 */
function logTestStep(message, testName = 'payment-test') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${testName}] ${message}`;
  console.log(logMessage);
  
  const logsDir = path.join(process.cwd(), 'test-artifacts', 'logs');
  ensureDirectoryExists(logsDir);
  
  fs.appendFileSync(
    path.join(logsDir, `${testName}.log`),
    `${logMessage}\n`
  );
}

/**
 * Waits for a specified element and highlights it briefly
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @param {number} timeout - Timeout in milliseconds
 */
async function highlightElement(page, selector, timeout = 2000) {
  try {
    await page.waitForSelector(selector);
    
    // Get the element handle using Playwright's APIs
    const elementHandle = await page.$(selector);
    
    if (elementHandle) {
      // Use elementHandle.evaluate to work with the element directly
      await elementHandle.evaluate(element => {
        const originalBorder = element.style.border;
        const originalBg = element.style.backgroundColor;
        
        element.style.border = '2px solid red';
        element.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        
        setTimeout(() => {
          element.style.border = originalBorder;
          element.style.backgroundColor = originalBg;
        }, 1000);
      });
    }
    
    await page.waitForTimeout(timeout);
  } catch (error) {
    console.log(`Warning: Could not highlight element with selector "${selector}": ${error.message}`);
  }
}

module.exports = {
  saveScreenshot,
  logTestStep,
  highlightElement,
  ensureDirectoryExists
}; 