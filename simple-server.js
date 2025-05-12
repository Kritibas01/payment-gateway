const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    const filePath = path.join(__dirname, 'standalone.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading the file');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
    });
  } else {
    res.writeHead(404);
    res.end('File not found');
  }
});

const PORT = 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple server running at http://localhost:${PORT}`);
}); 