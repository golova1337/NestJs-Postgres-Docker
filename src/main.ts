import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { EmojiLogger } from './common/logger/emojiLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new EmojiLogger(),
  });
  app.setGlobalPrefix('v1/api');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const port = parseInt(process.env.PORT, 10) || 3000;

  const config = new DocumentBuilder()
    .setTitle('Shope')
    .setVersion('1.0')
    .setDescription('The projects API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(port);
}
bootstrap();
