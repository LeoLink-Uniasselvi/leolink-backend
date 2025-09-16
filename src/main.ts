import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigModule } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  ConfigModule.forRoot();
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('LeoLink')
    .setDescription('Uma rede social voltada para o mundo acadêmico. Desenvolvida pelos alunos da Uniasselvi. Turmas: EGS0011, EGS0016 e EGS0016.')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();