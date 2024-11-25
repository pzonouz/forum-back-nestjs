import { HttpException, Injectable, UseGuards } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { QuestionsService } from 'src/questions/questions.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

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
    return this.answerRespository.find({
      where: { question: { id: id } },
      relations: { user: true, question: { user: true } },
      order: { created_at: 'ASC' },
    });
  }

  findOneById(id: string) {
    return this.answerRespository.findOne({
      where: { id: id },
      relations: { user: true, question: { user: true } },
    });
  }

  async update(
    id: string,
    updateAnswerDto: UpdateAnswerDto,
    requestUser: User,
  ) {
    const answer = await this.answerRespository.findOne({
      where: { id: id },
      relations: { user: true, question: { user: true } },
    });
    if (!answer) {
      throw new HttpException('Answer does not exists', 404);
    }
    if (answer.user?.id !== requestUser?.id) {
      throw new HttpException('Only Owener can edit answer', 401);
    }
    return await this.answerRespository.update(id, updateAnswerDto);
  }
  async updateWithoutAuth(id: string, updateAnswerDto: UpdateAnswerDto) {
    const answer = await this.answerRespository.findOne({
      where: { id: id },
      relations: { user: true, question: { user: true } },
    });
    if (!answer) {
      throw new HttpException('Answer does not exists', 404);
    }
    return await this.answerRespository.update(id, updateAnswerDto);
  }

  async remove(id: string, requestUser: User) {
    const answer = await this.answerRespository.findOne({
      where: { id: id },
      relations: { user: true },
    });
    if (!answer) {
      throw new HttpException('Answer does not exists', 404);
    }
    if (answer.user.id !== requestUser.id) {
      throw new HttpException('Only Owener can edit answer', 401);
    }
    if (answer.solving) {
      const res = await this.questionService.update(
        answer?.question?.id,
        { solved: false },
        requestUser,
      );
    }

    return this.answerRespository.delete(id);
  }
}
