import { HttpException, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { QueryQuestionDto } from './dto/query-question.dto';
import { Answer } from 'src/answers/entities/answer.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    private readonly userService: UsersService,
  ) {}
  async create(createQuestionDto: CreateQuestionDto) {
    const user = await this.userService.findOneById(createQuestionDto.userId);
    if (!user) {
      throw new HttpException('User not found', 400);
    }
    const existingquestion = await this.questionsRepository.findOne({
      where: { title: createQuestionDto.title },
    });
    if (existingquestion) {
      throw new HttpException('Question already exists', 400);
    }
    const object = this.questionsRepository.create({
      ...createQuestionDto,
      user: user,
    });
    return await this.questionsRepository.save(object);
  }

  async findAll(query: QueryQuestionDto) {
    try {
      if (query.sort_by == 'answers_count') {
        const questions = await this.questionsRepository
          .createQueryBuilder('question')
          .leftJoinAndSelect('question.answers', 'answer')
          .leftJoinAndSelect('question.user', 'user')
          .loadRelationCountAndMap('question.answers_count', 'question.answers')
          .getMany();
        return questions.sort((a: any, b: any) =>
          query?.sort_order === 'DESC'
            ? b?.answers_count - a?.answers_count
            : a?.answers_count - b?.answers_count,
        );
      }
      if (query.sort_by == 'not_solved') {
        const questions = await this.questionsRepository
          .createQueryBuilder('question')
          .leftJoinAndSelect('question.answers', 'answer')
          .leftJoinAndSelect('question.user', 'user')
          .where('question.solved = :solved', { solved: false })
          .orderBy('question.created_at', 'DESC')
          .getMany();
        return questions;
      }
      if (query.sort_by == 'no_answer') {
        const questions = await this.questionsRepository
          .createQueryBuilder('question')
          .leftJoinAndSelect('question.answers', 'answer')
          .leftJoinAndSelect('question.user', 'user')
          .addSelect((subQuery) => {
            return subQuery
              .select('COUNT(answer.id)', 'answers_count')
              .from(Answer, 'answer')
              .where('answer.questionId = question.id');
          }, 'answers_count')
          .where((qb) => {
            const subQuery = qb
              .subQuery()
              .select('COUNT(answer.id)')
              .from(Answer, 'answer')
              .where('answer.questionId = question.id')
              .getQuery();
            return `(${subQuery}) = 0`;
          })
          .orderBy('question.created_at', 'DESC')
          .getMany();
        return questions;
      }
      return await this.questionsRepository.find({
        relations: { answers: true, user: true },
        order: { [query?.sort_by || 'created_at']: query.sort_order || 'DESC' },
        skip: (query.page || 1 - 1) * query.limit || 0,
        take: query.limit,
      });
    } catch (e) {
      return await this.questionsRepository.find({
        relations: { answers: true, user: true },
        order: { created_at: query.sort_order || 'DESC' },
        skip: (query.page || 1 - 1) * query.limit || 0,
        take: query.limit,
      });
    }
  }

  async findOneById(id: string) {
    const question = await this.questionsRepository.findOne({
      where: { id: id },
      relations: { answers: true, user: true },
    });
    if (question) {
      return question;
    }
    throw new HttpException('Question Not Found', 404);
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
    requestUser: User,
  ) {
    const question = await this.questionsRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });
    if (!question) {
      throw new HttpException('Question does not exists', 404);
    }
    if (question.user?.id !== requestUser?.id) {
      throw new HttpException('Only Owener can edit question', 401);
    }

    return this.questionsRepository.update(
      { id: id },
      { ...updateQuestionDto },
    );
  }

  async checkQuestionSolved(id: string) {
    const question = await this.findOneById(id);
    if (!question) {
      throw new HttpException('Question does not exists', 404);
    }
    let solved = false;
    question.answers.map((answer) => {
      if (answer.solving) {
        solved = true;
      }
    });
    return this.questionsRepository.update({ id: id }, { solved: solved });
  }
  async remove(id: string, requestUser: User) {
    const question = await this.findOneById(id);
    if (!question) {
      throw new HttpException('Question does not exists', 404);
    }
    if (question.user.id !== requestUser.id) {
      throw new HttpException('Only Owener can edit question', 401);
    }
    return this.questionsRepository.delete({ id: id });
  }
}
