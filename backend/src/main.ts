import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

  const config = new DocumentBuilder()
    .setTitle('PONGsh API')
    .setDescription('Replacing Sean\'s markdown files in Discord')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(APP, config);
  SwaggerModule.setup('api', APP, document);

  await APP.listen(process.env.BE_PORT);
  console.log('Server running at ' + process.env.DOMAIN + ':' + process.env.BE_PORT);
}
bootstrap();
