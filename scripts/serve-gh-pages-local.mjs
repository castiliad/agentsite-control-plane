import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const port = Number(process.env.PORT || 4178);
const root = path.resolve('dist');
const prefix = '/agentsite-control-plane';
const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8']
]);

function send(res, file) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': types.get(path.extname(file)) || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}

http.createServer((req, res) => {
  const parsed = new URL(req.url || '/', `http://localhost:${port}`);
  let pathname = decodeURIComponent(parsed.pathname);
  if (pathname.startsWith(prefix)) pathname = pathname.slice(prefix.length) || '/';
  if (pathname === '/') return send(res, path.join(root, 'index.html'));
  let file = path.join(root, pathname);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  return send(res, file);
}).listen(port, () => console.log(`serving ${root} at http://localhost:${port}${prefix}/`));
