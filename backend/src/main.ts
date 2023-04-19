import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

async function bootstrap() {
  dotenv.config();
  const APP = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    }
  });
  const CONFIG = JSON.parse(fs.readFileSync('config.json', 'utf8'));
  await APP.listen(CONFIG.port);
  console.log(`Server running at ${CONFIG.url}:${CONFIG.port}`);
}
bootstrap();
