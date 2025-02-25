import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { QuestionsModule } from './questions/questions.module';
import { CoreModule } from './core/core.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ToLowerCaseMiddleware } from './middlewares/toLowerCase.middleware';
import { AnswersModule } from './answers/answers.module';
import { SearchModule } from './search/search.module';
import { FilesModule } from './files/files.module';
import { UploadsModule } from './uploads/uploads.module';
import { DownloadsModule } from './downloads/downloads.module';
import { MailModule } from './mail/mail.module';
import { ImportModule } from './import/import.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASR_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    CoreModule,
    QuestionsModule,
    AnswersModule,
    SearchModule,
    FilesModule,
    UploadsModule,
    DownloadsModule,
    MailModule,
    ImportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, ToLowerCaseMiddleware).forRoutes('*');
  }
}
