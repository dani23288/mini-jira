import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  // nit: reads process.env directly — decision doc says PORT comes from @nestjs/config (ConfigService), like MONGO_URI in app.module.ts. Works today only because ConfigModule happens to load .env into process.env too.
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`GraphQL API running on: http://localhost:${port}/graphql`);
}

bootstrap();
