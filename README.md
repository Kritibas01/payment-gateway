# Payment Automation Using Playwright

This project automates an end-to-end payment journey using the Playwright framework and reaches the OTP simulation screen.

## Features

- Automates flow on a demo e-commerce site
- Adds product to cart and places order
- Fills payment form and simulates OTP screen
- Generates video + screenshot reports on failure

## Prerequisites

- Node.js >= 16.x
- npm

## Setup Instructions

```bash
git clone https://github.com/your-username/payment-automation.git
cd payment-automation
npm install
npx playwright install
```

## Running Tests

Run with browser visible:
```bash
npm run test:headed
```

Run headless (in CI/CD):
```bash
npm run test
```

Debug mode with inspector:
```bash
npm run test:debug
```

## Web Interface

The project includes a web interface to run tests and view results:

1. Start the web server on port 8080:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:8080
```

3. If you're experiencing connection issues, try the test page:
```
http://localhost:8080/test.html
```

4. From the web interface you can:
   - Run any of the three test scenarios
   - View real-time test progress
   - Access screenshots and test reports

## Available Test Scenarios

There are three test files available:

1. Basic payment test:
```bash
npx playwright test tests/payment.spec.js --headed
```

2. Enhanced payment test with better OTP flow:
```bash
npx playwright test tests/enhanced-payment.spec.js --headed
```

3. Complete payment journey with screenshots and logging:
```bash
npx playwright test tests/complete-payment.spec.js --headed
```

## Test Artifacts

When running the complete payment test, screenshots are saved in:
```
test-artifacts/screenshots/complete-payment/
```

Logs are stored in:
```
test-artifacts/logs/
```

## Reports

HTML reports are generated in the `playwright-report` directory after test runs.

## Recording the Test

To record the test execution:

1. Run the test with `--headed` flag
2. Use a screen recording tool:
   - Windows: Xbox Game Bar (Win+G)
   - MacOS: QuickTime Player
   - OBS Studio (cross-platform)

## GitHub

Push the project to GitHub:

```bash
git init
git add .
git commit -m "Initial commit: Payment automation with OTP"
git remote add origin https://github.com/your-username/payment-automation.git
git push -u origin main
```

## Troubleshooting

If you're having trouble accessing the web interface:

1. Make sure Node.js is installed correctly
2. Check if another application is using port 8080
3. Try running with administrator/elevated privileges
4. Check your firewall settings to ensure it's not blocking the connection
5. If you're behind a corporate network, consult with your IT department 


Video Link 
https://drive.google.com/file/d/1LYAzvsBBLiMb-O2vsR50zeOBxBnvWGOA/view?usp=sharing
