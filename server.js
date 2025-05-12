const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const app = express();
const PORT = 5000;

// Serve static files
app.use('/artifacts', express.static(path.join(__dirname, 'test-artifacts')));
app.use('/report', express.static(path.join(__dirname, 'playwright-report')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/standalone.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'standalone.html'));
});

app.get('/run-test/:testFile', (req, res) => {
  const testFile = req.params.testFile;
  const validTests = ['payment.spec.js', 'enhanced-payment.spec.js', 'complete-payment.spec.js'];

  if (!validTests.includes(testFile)) {
    return res.status(400).json({ error: 'Invalid test file' });
  }

  // Use npx directly without hardcoding path
  const command = `npx playwright test tests/${testFile} --headed`;

  console.log(`Executing command: ${command}`);

  exec(command, {
    cwd: process.cwd(), // ensures it's executed in your project folder
    env: process.env
  }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Exec error: ${error.message}`);
      return res.json({ success: false, error: error.message, stderr });
    }

    res.json({ success: true, output: stdout });
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
