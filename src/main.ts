import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys:['asasasa']
  }))
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true //to stop user adding extra properties in request body
  }));
  await app.listen(3000);
}
bootstrap();
