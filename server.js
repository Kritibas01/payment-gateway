const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const app = express();
const PORT = 5000;

// Define paths to Node.js executables
const NODE_PATH = '"C:\\Program Files\\nodejs\\node.exe"';
const NPX_CLI_PATH = '"C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npx-cli.js"';

// Serve static files from test-artifacts and playwright-report
app.use('/artifacts', express.static(path.join(__dirname, 'test-artifacts')));
app.use('/report', express.static(path.join(__dirname, 'playwright-report')));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Direct route to the standalone demo
app.get('/standalone.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'standalone.html'));
});

// API endpoint to run tests
app.get('/run-test/:testFile', (req, res) => {
  const testFile = req.params.testFile;
  const validTests = ['payment.spec.js', 'enhanced-payment.spec.js', 'complete-payment.spec.js'];
  
  if (!validTests.includes(testFile)) {
    return res.status(400).json({ error: 'Invalid test file' });
  }
  
  const command = `${NODE_PATH} ${NPX_CLI_PATH} playwright test tests/${testFile} --headed`;
  
  console.log(`Executing command: ${command}`);
  
  exec(command, {
    env: { ...process.env, PATH: `C:\\Program Files\\nodejs;${process.env.PATH}` }
  }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Exec error: ${error.message}`);
      return res.json({ success: false, error: error.message, stderr });
    }
    
    res.json({ success: true, output: stdout });
  });
});

// Home page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 