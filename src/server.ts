import app from './app';
import { DatabaseConnection } from './config/DatabaseConnection';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;

async function startServer() {
  try {
    await DatabaseConnection.connect();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startServer();

process.on('SIGINT', async () => {
  await DatabaseConnection.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await DatabaseConnection.disconnect();
  process.exit(0);
});