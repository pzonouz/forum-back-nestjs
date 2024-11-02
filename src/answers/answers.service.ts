import { HttpException, Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { QuestionsService } from 'src/questions/questions.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AnswersService {
  constructor(
    private questionService: QuestionsService,
    private userService: UsersService,
    @InjectRepository(Answer)
    private answerRespository: Repository<Answer>,
  ) {}
  async create(createAnswerDto: CreateAnswerDto) {
    const question = await this.questionService.findOneById(
      createAnswerDto.questionId,
    );
    if (!question) {
      throw new HttpException('Question Not Found', 400);
    }
    const user = await this.userService.findOneById(createAnswerDto.userId);
    return this.answerRespository.save({
      ...createAnswerDto,
      question: question,
      user: user,
    });
  }

  findAll() {
    return this.answerRespository.find();
  }

  findAllByQuestionId(id: string) {
    return this.answerRespository.find({ where: { question: { id: id } } });
  }

  findOneById(id: string) {
    return this.answerRespository.findOne({ where: { id: id } });
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto) {
    return this.answerRespository.update(id, updateAnswerDto);
  }

  remove(id: number) {
    return this.answerRespository.delete(id);
  }
}
