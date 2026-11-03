import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getDeploymentConfig } from './config/deployment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = getDeploymentConfig(process.env);

  app.enableCors({
    origin: config.origin,
    credentials: true,
  });

  await app.listen(config.port);
}

void bootstrap();
