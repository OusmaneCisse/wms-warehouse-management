import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { VercelRequest, VercelResponse } from '@vercel/node';

let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    
    // Sécurité
    app.enableCors({
      origin: process.env.CORS_ORIGIN?.split(',') || ['https://wms-warehouse-management.vercel.app'],
      credentials: true,
    });

    // Validation globale des DTOs
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Préfixe API
    app.setGlobalPrefix('api/v1');
    
    await app.init();
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await bootstrap();
  const server = app.getHttpServer();
  
  // Handle the request
  server.emit('request', req, res);
}
