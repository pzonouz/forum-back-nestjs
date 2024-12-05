import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/answers/entities/answer.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Repository } from 'typeorm';

@Controller('search')
export class SearchController {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answersRepository: Repository<Answer>,
  ) {}
  @Get()
  async search(@Query('query') query: string) {
    const queryString = `${query}:*`;
    const questionSearch = this.questionsRepository
      .createQueryBuilder('question')
      .where('question.tsv_column @@ to_tsquery(:query)', {
        query: queryString,
      })
      .orderBy('ts_rank_cd(question.tsv_column, to_tsquery(:query))', 'DESC')
      .getMany();
    const answerSearch = this.answersRepository
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.question', 'question')
      .where('answer.tsv_column @@ to_tsquery(:query)', {
        query: queryString,
      })
      .orderBy('ts_rank_cd(answer.tsv_column, to_tsquery(:query))', 'DESC')
      .getMany();
    const res = await Promise.all([questionSearch, answerSearch]);

    return { questions: [...res[0]], answers: [...res[1]] };
  }
}