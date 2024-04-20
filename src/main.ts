import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());

  const applicationPort = process.env.APP_PORT;
  await app.listen(applicationPort, () => {
    console.log(`application running in port ${applicationPort}`);
  });
}
bootstrap();
