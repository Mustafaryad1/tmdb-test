import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validateEnv } from './common/helpers/env.validation';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  try {
    // Check if all environment variables are set
    validateEnv();

    // Swagger setup
    const config = new DocumentBuilder()
      .setTitle('TMDP Test')
      .setDescription('The TMDP API description for the test')
      .setVersion('1.0')
      .addTag('api')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, documentFactory);
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
