import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const APP = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CLIENT_DOMAIN + ':' + process.env.FE_PORT,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    }
  });
  await APP.listen(process.env.BE_PORT);
  console.log('Server running at ' + process.env.DOMAIN + ':' + process.env.BE_PORT);
}
bootstrap();
