import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
  await app.listen(config.port);
  console.log(`Server running at ${config.url}:${config.port}`);
}
bootstrap();
