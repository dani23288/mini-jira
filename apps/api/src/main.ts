import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const port = app.get(ConfigService).get<number>('PORT') || 3000;
  await app.listen(port);
  Logger.log(`GraphQL API running on: http://localhost:${port}/graphql`);
}

bootstrap();
