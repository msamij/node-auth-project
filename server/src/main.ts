import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  dotenv.config({ path: './config.env' });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
  });

  // console.log(join(__dirname, '../../client', 'dist'));
  // app.useStaticAssets(join(__dirname, '../../client', 'dist'));
  app.setBaseViewsDir(join(__dirname, '../../client', 'dist'));
  app.use(bodyParser.json());
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
