import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { PostsModule } from './modules/posts/posts.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LikesModule } from './modules/likes/likes.module';
import { HealthController } from './health.controller';
import { AuthGuard } from './modules/auth/guards/auth-guard.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' 
        ? '.env.production' 
        : '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASS'),
          database: configService.get('DB_NAME'),
          // SSL é OBRIGATÓRIO no Render
          ssl: isProduction ? {
            rejectUnauthorized: false, // Necessário para Render
          } : false,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // TEMPORÁRIO: Ativado para criar tabelas no primeiro deploy
          logging: configService.get('DB_LOGGING') === 'true',
        };
      },
    }),
    PostsModule,
    UsersModule,
    RolesModule,
    AuthModule,
    CommentsModule,
    LikesModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}