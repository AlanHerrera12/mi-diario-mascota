const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;
const DIST = path.join(__dirname, 'dist');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index';

  let filePath = path.join(DIST, urlPath);

  // Try exact, then .html, then index.html fallback
  const candidates = [filePath, filePath + '.html', path.join(DIST, 'index.html')];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      const ext = path.extname(candidate);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(candidate).pipe(res);
      return;
    }
  }

  res.writeHead(404);
  res.end('Not found');
}).listen(PORT, () => console.log(`Serving dist on http://localhost:${PORT}`));
