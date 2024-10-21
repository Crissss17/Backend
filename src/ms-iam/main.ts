import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para localhost y Vercel
  app.enableCors({
    origin: ['https://gonna-crest-martha-render.trycloudflare.com', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Usa los pipes de validación
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(8082); // Puerto donde se ejecuta tu backend
}
bootstrap();
