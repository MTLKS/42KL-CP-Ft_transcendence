import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    }
  });
  const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
  await app.listen(config.port);
  console.log(`Server running at ${config.url}:${config.port}`);
}
bootstrap();
