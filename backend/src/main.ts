import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.SERVER_PORT || 3000;

  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(PORT, () => console.log(`Сервер запущен на порту: ${PORT}`));
}

bootstrap();
