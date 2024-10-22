import pools from '../db/database.js';
import { testAllConnections } from '../utils/db/testConnection';
import { loadGameAssets } from './assets.js';
import { loadProtos } from './loadProtos.js';

const initServer = async () => {
  try {
    await loadGameAssets();
    await loadProtos();
    await testAllConnections(pools); // db 테스트
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export default initServer;
