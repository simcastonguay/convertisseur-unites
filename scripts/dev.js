import { createServer } from 'vite';
import { createApp } from '../server/app.js';

const api = createApp();
try {
  await new Promise((resolve, reject) => { api.once('error', reject); api.listen(3001, '127.0.0.1', resolve); });
  const vite = await createServer();
  await vite.listen();
  vite.printUrls();
  const close = async () => { await vite.close(); api.close(); };
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, close);
} catch (error) {
  console.error(error.message);
  api.close();
  process.exitCode = 1;
}
