import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { UsersModule } from 'src/users/users.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer, User]),
    UsersModule,
    QuestionsModule,
  ],
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}
