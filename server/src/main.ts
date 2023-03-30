import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config({ path: './config.env' });

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  app.use(bodyParser.json());
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
