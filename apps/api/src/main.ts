import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
  const origin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({ origin, credentials: true });
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}`);
}
bootstrap();
