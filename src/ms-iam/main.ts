import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:8083', 'https://delight-customise-iii-translate.trycloudflare.com'], // Cambia esto al origen correcto de tu front-end
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(8082); 
}
bootstrap();
