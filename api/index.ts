import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import express, { Request, Response } from 'express';

const expressApp = express();
let nestApp;

// Middleware CORS manual para manejar preflight
expressApp.use((req: Request, res: Response, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'https://polaris-frontend-theta.vercel.app'
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Responder inmediatamente a OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
});

async function bootstrap() {
  if (!nestApp) {
    nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { cors: false } // Deshabilitamos CORS de NestJS, lo manejamos manualmente arriba
    );

    nestApp.setGlobalPrefix('api');

    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await nestApp.init();
  }
  return nestApp;
}

export default async (req: Request, res: Response) => {
  await bootstrap();
  expressApp(req, res);
};