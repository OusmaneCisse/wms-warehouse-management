import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../backend/src/app.module';
import { VercelRequest, VercelResponse } from '@vercel/node';

let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    
    app.enableCors({
      origin: true,
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api/v1');
    await app.init();
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const app = await bootstrap();
    
    // Simple request forwarding
    const server = app.getHttpServer();
    server.emit('request', req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
