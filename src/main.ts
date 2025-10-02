import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  // Create the NestJS application
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  // Security middleware
  app.use(helmet()); // adds HTTP headers to improve security

  // Enable CORS for frontend
  app.enableCors({
    origin: '*',
    // origin: ['http://localhost:5173', 'https://polaris-frontend-theta.vercel.app'], // frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true, // throw an error if extra properties are sent
      transform: true, // auto-transform payloads to DTO instances
    }),
  );

  // Define port
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  // Start the server
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

// Bootstrap the application
bootstrap();
