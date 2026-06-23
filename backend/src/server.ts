import { createServer } from 'http';
import createApp from './app';
import { env } from './config/env';
import { prisma } from './config/database';
import { initializeSocket } from './sockets';

const app = createApp();
const httpServer = createServer(app);

initializeSocket(httpServer);

httpServer.listen(env.port, () => {
  console.log(`FlikChat API running on http://localhost:${env.port}`);
  console.log(`Environment: ${env.nodeEnv}`);
});

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  httpServer.close(async () => {
    await prisma.$disconnect();
    console.log('Server closed and DB disconnected');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default httpServer;
