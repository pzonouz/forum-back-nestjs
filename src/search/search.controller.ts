import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/questions/entities/question.entity';
import { Repository } from 'typeorm';

@Controller('search')
export class SearchController {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ) {}
  @Get()
  search(@Query('query') query: string) {
    const queryString = `${query}:*`;
    return this.questionsRepository
      .createQueryBuilder('question')
      .where('question.tsv_column @@ to_tsquery(:query)', {
        query: { queryString },
      })
      .orderBy('ts_rank_cd(question.tsv_column, to_tsquery(:query))', 'DESC')
      .getMany();
  }
}
