import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validateEnv } from './common/helpers/env.validation';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  try {
    validateEnv();
  } catch (error) {
    const logger = new Logger('Bootstrap');
    logger.error(error.message);
    process.exit(1);
  }

  await app.listen(port, () => {
    const logger = new Logger('Bootstrap');
    logger.log(`Application is running on: http://localhost:${port}`);
  });
}
bootstrap();
