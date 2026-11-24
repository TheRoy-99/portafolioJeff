
import { ping } from './keepalive';

const INTERVAL_MS = 24 * 60 * 60 * 1000;

async function start() {
  console.log('Keepalive scheduler iniciado.');

  await ping();

  setTimeout(start, INTERVAL_MS);
}

void start();
