import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigModule } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  await ConfigModule.forRoot();
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',') 
      : ['http://localhost:3000'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('LeoLink')
    .setDescription(
      'Uma rede social voltada para o mundo acadêmico. Desenvolvida pelos alunos da Uniasselvi. Turmas: EGS0011, EGS0016 e EGS0016.',
    )
    .setVersion('0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addTag('Autenticação', 'Endpoints de autenticação')
    .addTag('Usuários', 'Endpoints de gerenciamento de usuários')
    .addTag('Posts', 'Endpoints de gerenciamento de posts')
    .addTag('Comentários', 'Endpoints de gerenciamento de comentários')
    .addTag('Likes', 'Endpoints de gerenciamento de likes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || process.env.APP_PORT || 5000;
  await app.listen(port, '0.0.0.0');
  console.log(`Aplicação está rodando na porta ${port}`);
  console.log(`Swagger disponível em: http://localhost:${port}/docs`);
}

bootstrap().catch((error) => {
  console.error('Erro ao inicializar a aplicação:', error);
  process.exit(1);
});
