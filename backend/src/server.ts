import { createServer } from 'http';
import createApp from './app';
import { env } from './config/env';
import { initializeSocket } from './sockets';

const app = createApp();
const httpServer = createServer(app);

initializeSocket(httpServer);

httpServer.listen(env.port, () => {
  console.log(`FlikChat API running on http://localhost:${env.port}`);
  console.log(`Environment: ${env.nodeEnv}`);
});

export default httpServer;
