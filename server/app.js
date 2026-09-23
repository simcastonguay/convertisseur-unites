import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories, convert, ConversionError } from './conversions.js';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png' };
function json(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(data));
}

export function createApp() {
  return createServer(async (request, response) => {
    const started = performance.now();
    response.on('finish', () => console.log(JSON.stringify({
      time: new Date().toISOString(),
      method: request.method,
      path: request.url.split('?')[0],
      status: response.statusCode,
      durationMs: Math.round(performance.now() - started),
    })));
    response.setHeader('X-Content-Type-Options', 'nosniff');
    try {
      const url = new URL(request.url, 'http://localhost');
      if (request.method === 'GET' && url.pathname === '/api/health') return json(response, 200, { status: 'ok' });
      if (request.method === 'GET' && url.pathname === '/api/units') return json(response, 200, categories);
      if (request.method === 'POST' && url.pathname === '/api/convert') {
        if (!request.headers['content-type']?.startsWith('application/json')) return json(response, 415, { error: 'Utilisez un contenu JSON.' });
        let body = '';
        for await (const chunk of request) {
          body += chunk;
          if (Buffer.byteLength(body) > 4096) return json(response, 413, { error: 'La demande est trop volumineuse.' });
        }
        let input;
        try { input = JSON.parse(body); } catch { return json(response, 400, { error: 'Le contenu JSON est invalide.' }); }
        return json(response, 200, convert(input));
      }
      if (url.pathname.startsWith('/api/')) return json(response, 404, { error: 'Cette route API n’existe pas.' });
      if (request.method !== 'GET' && request.method !== 'HEAD') return json(response, 405, { error: 'Méthode non autorisée.' });
      const relative = decodeURIComponent(url.pathname) === '/' ? 'index.html' : decodeURIComponent(url.pathname).replace(/^\/+/, '');
      const file = path.resolve(dist, relative);
      if (!file.startsWith(dist)) return json(response, 403, { error: 'Accès interdit.' });
      try {
        const content = await readFile(file);
        response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(file)] || 'application/octet-stream' });
        response.end(request.method === 'HEAD' ? undefined : content);
      } catch (error) {
        if (error.code !== 'ENOENT' && error.code !== 'EISDIR') throw error;
        json(response, 404, { error: 'Page introuvable. Exécutez npm run build avant npm start.' });
      }
    } catch (error) {
      if (error instanceof ConversionError || error instanceof URIError) return json(response, 400, { error: error.message });
      console.error(error);
      json(response, 500, { error: 'Une erreur interne est survenue.' });
    }
  });
}
