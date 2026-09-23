import { createApp } from './app.js';

const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || '127.0.0.1';
const server = createApp();
server.on('error', (error) => { console.error(`Impossible de démarrer le serveur : ${error.message}`); process.exitCode = 1; });
server.listen(port, host, () => console.log(`Unité : http://${host}:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
