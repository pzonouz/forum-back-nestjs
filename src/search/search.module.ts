import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { QuestionsModule } from 'src/questions/questions.module';
import { AnswersModule } from 'src/answers/answers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/questions/entities/question.entity';
import { Answer } from 'src/answers/entities/answer.entity';

@Module({
  imports: [
    QuestionsModule,
    AnswersModule,
    TypeOrmModule.forFeature([Question, Answer]),
  ],
  controllers: [SearchController],
})
export class SearchModule {}
