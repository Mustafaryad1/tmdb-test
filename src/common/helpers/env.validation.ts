import { Logger } from '@nestjs/common';

export function validateEnv() {
  const requiredEnvVars = [
    'TMDB_API_KEY',
    'TMDP_BASE_URL',
    'TMDP_READ_ACCESS_TOKEN',
    'DATABASE_URL',
  ];
  const missingVars = requiredEnvVars.filter((env) => !process.env[env]);

  if (missingVars.length) {
    const logger = new Logger('EnvironmentValidation');
    logger.error(`Missing environment variables: ${missingVars.join(', ')}`);
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }

  const logger = new Logger('EnvironmentValidation');
  logger.log('All required environment variables are set.');
}
