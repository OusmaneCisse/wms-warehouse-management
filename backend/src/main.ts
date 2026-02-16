import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const dbPath = process.env.DB_PATH || 'data/wms.sqlite';
  const dataDir = dirname(dbPath);
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  const app = await NestFactory.create(AppModule);

  // Sécurité
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
    credentials: true,
  });

  // Validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Supprime les propriétés non définies dans le DTO
      forbidNonWhitelisted: true,
      transform: true,        // Transforme les types (query params -> number)
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Préfixe API
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`WMS API running on http://localhost:${port}/api/v1`);
}

bootstrap().catch(console.error);
