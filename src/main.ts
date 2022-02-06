import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  });

  app.use(
    session({
      secret: 'nest cats',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 7 * 24 * 3600 * 1000 }, // 1 week
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
