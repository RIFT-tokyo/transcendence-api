import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4212',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    credentials: true,
  });

  app.use(
    cookieSession({
      name: 'session',
      keys: [process.env.SESSION_SECRET],
      maxAge: Number(process.env.SESSION_COOKIE_MAX_AGE),
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
